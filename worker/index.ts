import { connect } from "cloudflare:sockets";

// Server status with uptime history.
//
// Routes come from the STATUS_ROUTES secret, a JSON array of groups in display
// order:
//   [{ "name": "group name", "routes": [{ "name": "route name", "target": "host:port" }] }]
// The cron (`scheduled`, every 10 minutes in cloudflare.config.ts) tcpings
// every route, retrying a failed connect up to RETRIES times, and records the
// result in D1 (STATUS_DB): the latest result per route plus hourly and daily
// counts of successful / total checks. GET /api/status only reads D1.
//
// Only names, up/down, and counts leave the Worker. Targets never appear in
// responses, logs, or D1 (routes are keyed by a hash of the target, so a
// renamed route keeps its history and a moved one starts over); connection
// errors are swallowed whole, since their messages can carry the address.

// a dropped SYN never rejects `opened`, so a silent host counts as offline
const TIMEOUT_MS = 3000;
const RETRIES = 3;
const RETRY_DELAY_MS = 1000;
// history shown on the page; rollups are kept a little longer, then pruned
const DAYS = 90;
const HOURS = 24;
const KEEP_DAYS = 100;
const KEEP_HOURS = 48;
// shared per Cloudflare data center (Cache API) and in the browser; data only
// changes every 10 minutes
const CACHE_SECONDS = 60;
// days are calendar days in UTC+8, the community's time zone
const DAY_OFFSET_MS = 8 * 3_600_000;

interface Route {
  name: string;
  target: string;
}

interface Group {
  name: string;
  routes: Route[];
}

// [successful checks, total checks]; null when a slot has no checks
type Slot = [number, number] | null;

const isText = (value: unknown): value is string =>
  typeof value === "string" && value.trim() !== "";

const isRoute = (value: unknown): value is Route =>
  typeof value === "object" &&
  value !== null &&
  isText((value as Route).name) &&
  isText((value as Route).target);

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
const hourOf = (time: number): number => Math.floor(time / 3_600_000);

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

// online when any of 1 + RETRIES attempts connects
const probe = async (target: string): Promise<boolean> => {
  for (let attempt = 0; attempt <= RETRIES; attempt++) {
    if (attempt > 0) await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
    if (await tcping(target)) return true;
  }
  return false;
};

// WITHOUT ROWID: the primary key is the table, so an upsert writes one row
const ensureSchema = (db: D1Database) =>
  db.batch([
    db.prepare(
      "CREATE TABLE IF NOT EXISTS latest (route TEXT PRIMARY KEY, online INTEGER NOT NULL, checked_at INTEGER NOT NULL) WITHOUT ROWID",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS hourly (route TEXT NOT NULL, hour INTEGER NOT NULL, up INTEGER NOT NULL, total INTEGER NOT NULL, PRIMARY KEY (route, hour)) WITHOUT ROWID",
    ),
    db.prepare(
      "CREATE TABLE IF NOT EXISTS daily (route TEXT NOT NULL, day TEXT NOT NULL, up INTEGER NOT NULL, total INTEGER NOT NULL, PRIMARY KEY (route, day)) WITHOUT ROWID",
    ),
  ]);

const record = async (db: D1Database, groups: Group[], now: number) => {
  const routes = groups.flatMap((group) => group.routes);
  // Every route at once; the runtime opens at most six connections at a time
  // and queues the rest.
  const results = await Promise.all(
    routes.map(async (route) => ({
      key: await routeKey(route.target),
      up: (await probe(route.target)) ? 1 : 0,
    })),
  );
  const day = dayOf(now);
  const hour = hourOf(now);
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
          "INSERT INTO hourly (route, hour, up, total) VALUES (?1, ?2, ?3, 1) ON CONFLICT (route, hour) DO UPDATE SET up = up + excluded.up, total = total + 1",
        )
        .bind(key, hour, up),
      db
        .prepare(
          "INSERT INTO daily (route, day, up, total) VALUES (?1, ?2, ?3, 1) ON CONFLICT (route, day) DO UPDATE SET up = up + excluded.up, total = total + 1",
        )
        .bind(key, day, up),
    ]),
    db.prepare("DELETE FROM hourly WHERE hour < ?1").bind(hour - KEEP_HOURS + 1),
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
  // slot labels, oldest first; the last slot is the current day / hour
  const days = Array.from({ length: DAYS }, (_, i) => dayOf(now - (DAYS - 1 - i) * 86_400_000));
  const hourNow = hourOf(now);
  const hours = Array.from({ length: HOURS }, (_, i) => hourNow - (HOURS - 1) + i);

  await ensureSchema(db);
  const [latest, hourly, daily] = await db.batch<LatestRow | CountRow>([
    db.prepare("SELECT route, online, checked_at FROM latest"),
    db.prepare("SELECT route, hour AS slot, up, total FROM hourly WHERE hour >= ?1").bind(hours[0]),
    db.prepare("SELECT route, day AS slot, up, total FROM daily WHERE day >= ?1").bind(days[0]),
  ]);

  const latestBy = new Map((latest.results as LatestRow[]).map((row) => [row.route, row]));
  const countsBy = (rows: CountRow[]) =>
    new Map(rows.map((row) => [`${row.route}|${row.slot}`, [row.up, row.total] as Slot]));
  const hourlyBy = countsBy(hourly.results as CountRow[]);
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
            hourly: hours.map((hour) => hourlyBy.get(`${key}|${hour}`) ?? null),
          };
        }),
      ),
    })),
  );

  return {
    checkedAt: checkedAt ? new Date(checkedAt).toISOString() : null,
    days,
    hours: hours.map((hour) => new Date(hour * 3_600_000).toISOString()),
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
