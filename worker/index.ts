import { connect } from "cloudflare:sockets";

// Server status with uptime history.
//
// Routes come from the STATUS_ROUTES secret, a JSON array of groups in display
// order:
//   [{ "name": "group name", "routes": [{ "name": "route name", "target": "host:port" }] }]
// The cron (`scheduled`, every 5 minutes in cloudflare.config.ts) checks
// every route and records the result in D1 (STATUS_DB): the latest result per
// route plus half-hourly and daily counts of successful / total checks. GET
// /api/status only reads D1.
//
// A route is checked one of two ways:
// - TCP (default): connect to `target`, retrying a failed connect up to
//   RETRIES times.
// - DNS (`"dns": "hostname"` on the route): for lines behind failover DNS that
//   Cloudflare cannot reach directly. The failover service health-checks each
//   line and suspends a failed line's record, so the route is online while its
//   `target` address (an IPv4 literal) is among the hostname's A records.
//   Each hostname is looked up once per run, over TCP straight from its zone's
//   authoritative nameservers (found through DoH), so no resolver cache adds
//   delay. No records means every line is down; a failed lookup records
//   nothing for its routes that run. Lag: the failover check interval plus up
//   to one cron period.
//
// Only names, up/down, and counts leave the Worker. Targets never appear in
// responses, logs, or D1 (routes are keyed by a hash of the target, so a
// renamed route keeps its history and a moved one starts over); connection
// errors are swallowed whole, since their messages can carry the address.

// a dropped SYN never rejects `opened`, so a silent host counts as offline;
// also the limit for each DNS request
const TIMEOUT_MS = 3000;
const RETRIES = 3;
const RETRY_DELAY_MS = 1000;
// JSON API; only used to find a failover zone's nameservers, which rarely
// change, so its cache does no harm
const DOH_URL = "https://cloudflare-dns.com/dns-query";
// history shown on the page; rollups are kept a little longer, then pruned
const DAYS = 90;
// 30-minute slots: 48 cover the 24-hour view
const SLOT_MS = 1_800_000;
const SLOTS = 48;
const KEEP_DAYS = 100;
const KEEP_SLOTS = 96;
// shared per Cloudflare data center (Cache API) and in the browser; data only
// changes every 5 minutes
const CACHE_SECONDS = 60;
// days are calendar days in UTC+8, the community's time zone
const DAY_OFFSET_MS = 8 * 3_600_000;

interface Route {
  name: string;
  target: string;
  // failover DNS hostname; when set, `target`'s host must be an IP literal
  dns?: string;
}

interface Group {
  name: string;
  routes: Route[];
}

// [successful checks, total checks]; null when a slot has no checks
type Slot = [number, number] | null;

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

// host part of `host:port`
const hostOf = (target: string): string => target.trim().replace(/:\d+$/, "");

const isIPv4 = (host: string): boolean => /^\d{1,3}(\.\d{1,3}){3}$/.test(host);

const isRoute = (value: unknown): value is Route =>
  typeof value === "object" &&
  value !== null &&
  isText((value as Route).name) &&
  isText((value as Route).target) &&
  ((value as Route).dns === undefined ||
    (isText((value as Route).dns) && isIPv4(hostOf((value as Route).target))));

const isGroup = (value: unknown): value is Group =>
  typeof value === "object" &&
  value !== null &&
  isText((value as Group).name) &&
  Array.isArray((value as Group).routes) &&
  (value as Group).routes.length > 0 &&
  (value as Group).routes.every(isRoute);

// null when the secret is missing or malformed
const parseGroups = (raw: string | undefined): Group[] | null => {
  if (!raw) return null;
  try {
    const groups: unknown = JSON.parse(raw);
    return Array.isArray(groups) && groups.length > 0 && groups.every(isGroup) ? groups : null;
  } catch {
    return null;
  }
};

const routeKey = async (target: string): Promise<string> => {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(target.trim()));
  return [...new Uint8Array(digest, 0, 8)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

const dayOf = (time: number): string => new Date(time + DAY_OFFSET_MS).toISOString().slice(0, 10);
const slotOf = (time: number): number => Math.floor(time / SLOT_MS);

const tcping = async (target: string): Promise<boolean> => {
  let timer: number | null = null;
  let socket: ReturnType<typeof connect> | undefined;
  try {
    socket = connect(target.trim());
    socket.closed.catch(() => {});
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
    });
    await Promise.race([socket.opened, timeout]);
    return true;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
    socket?.close().catch(() => {});
  }
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// online when any of 1 + RETRIES attempts connects
const probe = async (target: string): Promise<boolean> => {
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAY_MS);
    if (await tcping(target)) return true;
  }
  return false;
};

interface DnsJson {
  Status: number;
  Answer?: { name: string; type: number; data: string }[];
  Authority?: { name: string; type: number; data: string }[];
}

// Nameservers of the zone that holds `name`: its own NS records when it is a
// delegated zone apex, else those of the zone named by the SOA that comes back
// with the empty answer.
const nameserversOf = async (name: string): Promise<string[] | null> => {
  const ask = async (qname: string): Promise<DnsJson | null> => {
    const query = new URLSearchParams({ name: qname, type: "NS" }).toString();
    const response = await fetch(`${DOH_URL}?${query}`, {
      headers: { accept: "application/dns-json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    return response.ok ? response.json() : null;
  };
  const nsOf = (body: DnsJson | null) =>
    body?.Status === 0
      ? (body.Answer ?? [])
          .filter((record) => record.type === 2)
          .map((record) => record.data.replace(/\.$/, ""))
      : [];
  const body = await ask(name);
  const own = nsOf(body);
  if (own.length > 0) return own;
  const zone = body?.Authority?.find((record) => record.type === 6)?.name;
  const parent = zone ? nsOf(await ask(zone)) : [];
  return parent.length > 0 ? parent : null;
};

// DNS over TCP: a 2-byte length, then the message. Header flags 0 is a
// standard query without recursion (the server asked is the authority).
const encodeQuery = (id: number, name: string): Uint8Array => {
  const labels = name
    .replace(/\.$/, "")
    .split(".")
    .map((label) => new TextEncoder().encode(label));
  const length = 12 + labels.reduce((sum, label) => sum + 1 + label.length, 0) + 1 + 4;
  const message = new Uint8Array(2 + length);
  const view = new DataView(message.buffer);
  view.setUint16(0, length);
  view.setUint16(2, id);
  view.setUint16(6, 1); // one question
  let offset = 14;
  for (const label of labels) {
    message[offset++] = label.length;
    message.set(label, offset);
    offset += label.length;
  }
  offset++; // root label
  view.setUint16(offset, 1); // type A
  view.setUint16(offset + 2, 1); // class IN
  return message;
};

const skipName = (message: Uint8Array, offset: number): number => {
  for (;;) {
    const length = message[offset];
    if (length === undefined) throw new RangeError("truncated name");
    if ((length & 0xc0) === 0xc0) return offset + 2; // compression pointer
    offset += 1 + length;
    if (length === 0) return offset;
  }
};

// A records of an authoritative answer; an empty set when the name has none
// (NODATA) or does not exist (NXDOMAIN): both mean every line is suspended.
// null for anything else: an error, a non-authoritative reply, or a CNAME
// (its addresses live in another zone).
const parseAddresses = (message: Uint8Array, id: number): Set<string> | null => {
  const view = new DataView(message.buffer, message.byteOffset, message.byteLength);
  const flags = view.getUint16(2);
  const isAuthoritativeReply =
    view.getUint16(0) === id && (flags & 0x8000) !== 0 && (flags & 0x0400) !== 0;
  const rcode = flags & 0xf;
  if (!isAuthoritativeReply || (rcode !== 0 && rcode !== 3)) return null;
  const addresses = new Set<string>();
  if (rcode === 3) return addresses;
  let offset = 12;
  for (let i = view.getUint16(4); i > 0; i--) offset = skipName(message, offset) + 4;
  for (let i = view.getUint16(6); i > 0; i--) {
    offset = skipName(message, offset);
    const type = view.getUint16(offset);
    const length = view.getUint16(offset + 8);
    offset += 10;
    if (type === 5) return null;
    if (type === 1 && length === 4)
      addresses.add([...message.subarray(offset, offset + 4)].join("."));
    offset += length;
  }
  return addresses;
};

const queryA = async (nameserver: string, name: string): Promise<Set<string> | null> => {
  const id = crypto.getRandomValues(new Uint16Array(1))[0] ?? 0;
  let timer: number | null = null;
  let socket: ReturnType<typeof connect> | undefined;
  try {
    const opened = connect(`${nameserver}:53`);
    socket = opened;
    opened.closed.catch(() => {});
    const exchange = async () => {
      const writer = opened.writable.getWriter();
      await writer.write(encodeQuery(id, name));
      writer.releaseLock();
      const reader = opened.readable.getReader();
      let buffer = new Uint8Array(0);
      for (;;) {
        const result: ReadableStreamReadResult<Uint8Array> = await reader.read();
        if (result.done) return null;
        const chunk = result.value;
        const joined = new Uint8Array(buffer.length + chunk.length);
        joined.set(buffer);
        joined.set(chunk, buffer.length);
        buffer = joined;
        if (buffer.length < 2) continue;
        const length = new DataView(buffer.buffer).getUint16(0);
        if (buffer.length >= 2 + length) return parseAddresses(buffer.subarray(2, 2 + length), id);
      }
    };
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), TIMEOUT_MS);
    });
    return await Promise.race([exchange(), timeout]);
  } catch {
    return null;
  } finally {
    clearTimeout(timer);
    socket?.close().catch(() => {});
  }
};

// Current A records of `name`, read from its zone's authoritative nameservers
// so no resolver cache delays a failover change; null when 1 + RETRIES
// attempts (rotating through the nameservers) all failed.
const resolve = async (name: string): Promise<Set<string> | null> => {
  let nameservers: string[] | null = null;
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await sleep(RETRY_DELAY_MS);
    try {
      nameservers ??= await nameserversOf(name);
    } catch {
      // network error or timeout: retry
    }
    const nameserver = nameservers ? nameservers[attempt % nameservers.length] : undefined;
    if (!nameserver) continue;
    const addresses = await queryA(nameserver, name);
    if (addresses) return addresses;
  }
  return null;
};

// WITHOUT ROWID: the primary key is the table, so an upsert writes one row
const ensureSchema = (db: D1Database) =>
  db.batch([
    db.prepare(
      "CREATE TABLE IF NOT EXISTS latest (route TEXT PRIMARY KEY, online INTEGER NOT NULL, checked_at INTEGER NOT NULL) WITHOUT ROWID",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS half_hourly (route TEXT NOT NULL, slot INTEGER NOT NULL, up INTEGER NOT NULL, total INTEGER NOT NULL, PRIMARY KEY (route, slot)) WITHOUT ROWID",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS daily (route TEXT NOT NULL, day TEXT NOT NULL, up INTEGER NOT NULL, total INTEGER NOT NULL, PRIMARY KEY (route, day)) WITHOUT ROWID",
    ),
  ]);

const record = async (db: D1Database, groups: Group[], now: number) => {
  const routes = groups.flatMap((group) => group.routes);
  // one lookup per hostname, shared by its routes
  const lookups = new Map<string, Promise<Set<string> | null>>();
  // null: DNS lookup failed, nothing to record
  const check = async (route: Route): Promise<boolean | null> => {
    if (route.dns === undefined) return probe(route.target);
    const name = route.dns.trim().toLowerCase();
    let lookup = lookups.get(name);
    if (!lookup) {
      lookup = resolve(name);
      lookups.set(name, lookup);
    }
    const addresses = await lookup;
    return addresses ? addresses.has(hostOf(route.target)) : null;
  };
  // Every route at once; the runtime opens at most six connections at a time
  // and queues the rest.
  const checked = await Promise.all(
    routes.map(async (route) => ({
      key: await routeKey(route.target),
      online: await check(route),
    })),
  );
  const results = checked.flatMap(({ key, online }) =>
    online === null ? [] : [{ key, up: online ? 1 : 0 }],
  );
  const day = dayOf(now);
  const slot = slotOf(now);
  await ensureSchema(db);
  await db.batch([
    ...results.flatMap(({ key, up }) => [
      db
        .prepare(
          "INSERT INTO latest (route, online, checked_at) VALUES (?1, ?2, ?3) ON CONFLICT (route) DO UPDATE SET online = excluded.online, checked_at = excluded.checked_at",
        )
        .bind(key, up, now),
      db
        .prepare(
          "INSERT INTO half_hourly (route, slot, up, total) VALUES (?1, ?2, ?3, 1) ON CONFLICT (route, slot) DO UPDATE SET up = up + excluded.up, total = total + 1",
        )
        .bind(key, slot, up),
      db
        .prepare(
          "INSERT INTO daily (route, day, up, total) VALUES (?1, ?2, ?3, 1) ON CONFLICT (route, day) DO UPDATE SET up = up + excluded.up, total = total + 1",
        )
        .bind(key, day, up),
    ]),
    db.prepare("DELETE FROM half_hourly WHERE slot < ?1").bind(slot - KEEP_SLOTS + 1),
    db.prepare("DELETE FROM daily WHERE day < ?1").bind(dayOf(now - (KEEP_DAYS - 1) * 86_400_000)),
  ]);
};

interface LatestRow {
  route: string;
  online: number;
  checked_at: number;
}

interface CountRow {
  route: string;
  slot: string | number;
  up: number;
  total: number;
}

const report = async (db: D1Database, groups: Group[], now: number) => {
  // slot labels, oldest first; the last slot is the current day / half hour
  const days = Array.from({ length: DAYS }, (_, i) => dayOf(now - (DAYS - 1 - i) * 86_400_000));
  const slotNow = slotOf(now);
  const slots = Array.from({ length: SLOTS }, (_, i) => slotNow - (SLOTS - 1) + i);

  await ensureSchema(db);
  const [latest, halfHourly, daily] = await db.batch<LatestRow | CountRow>([
    db.prepare("SELECT route, online, checked_at FROM latest"),
    db.prepare("SELECT route, slot, up, total FROM half_hourly WHERE slot >= ?1").bind(slots[0]),
    db.prepare("SELECT route, day AS slot, up, total FROM daily WHERE day >= ?1").bind(days[0]),
  ]);

  const latestBy = new Map((latest.results as LatestRow[]).map((row) => [row.route, row]));
  const countsBy = (rows: CountRow[]) =>
    new Map(rows.map((row) => [`${row.route}|${row.slot}`, [row.up, row.total] as Slot]));
  const halfHourlyBy = countsBy(halfHourly.results as CountRow[]);
  const dailyBy = countsBy(daily.results as CountRow[]);

  let checkedAt = 0;
  const reported = await Promise.all(
    groups.map(async (group) => ({
      name: group.name.trim(),
      routes: await Promise.all(
        group.routes.map(async (route) => {
          const key = await routeKey(route.target);
          const last = latestBy.get(key);
          if (last) checkedAt = Math.max(checkedAt, last.checked_at);
          return {
            name: route.name.trim(),
            online: last ? last.online === 1 : null,
            daily: days.map((day) => dailyBy.get(`${key}|${day}`) ?? null),
            halfHourly: slots.map((slot) => halfHourlyBy.get(`${key}|${slot}`) ?? null),
          };
        }),
      ),
    })),
  );

  return {
    checkedAt: checkedAt ? new Date(checkedAt).toISOString() : null,
    days,
    halfHours: slots.map((slot) => new Date(slot * SLOT_MS).toISOString()),
    groups: reported,
  };
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    if (url.pathname !== "/api/status") return new Response(null, { status: 404 });
    if (request.method !== "GET") {
      return new Response(null, { status: 405, headers: { Allow: "GET" } });
    }
    // misconfiguration: report no status rather than a false "offline"
    const groups = parseGroups(env.STATUS_ROUTES);
    if (!groups) return new Response(null, { status: 503 });

    const cache = caches.default;
    const key = new Request(`${url.origin}/api/status`);
    const cached = await cache.match(key);
    if (cached) return cached;

    const response = Response.json(await report(env.STATUS_DB, groups, Date.now()), {
      headers: { "Cache-Control": `public, max-age=${CACHE_SECONDS}` },
    });
    ctx.waitUntil(cache.put(key, response.clone()));
    return response;
  },

  async scheduled(controller, env) {
    const groups = parseGroups(env.STATUS_ROUTES);
    if (groups) await record(env.STATUS_DB, groups, controller.scheduledTime);
  },
} satisfies ExportedHandler<Env>;
