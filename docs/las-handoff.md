# LAS handoff from LASweb-v2

Content facts about Lazy Alien Server (LAS), extracted from LASweb-v2 (`../LASweb-v2`, the current production site) when v3 was started. Use this as the source for any LAS copy, data, links, and assets in v3; when v2 changes, v2 wins and this file should be refreshed.

Already copied into v3: `public/hero.webp`, `public/floatingcity.webp`, `public/ftl-ender-pearl.webp`, `public/favicon.svg`, and `src/assets/logo.svg` (the 97 × 73 wordmark). Section 11 describes v2's visual identity for reference only; v3 has its own design direction (see `AGENTS.md`).

All source paths below are relative to the LASweb-v2 repository. Quoted copy retains source spelling, punctuation, case, and Chinese text. Line wrapping around HTML elements is not content. Source implementation takes precedence over repository prose (notably the GitHub count).

## 1. Identity

Sources: `index.html`; `src/components/HeroSection.vue:1-40`; `src/components/IntroSection.vue:14-51`; `src/components/LiveTimer.vue:156-165`; `AGENTS.md:1-30`; `src/data/rules.ts`.

- Full name: `Lazy Alien Server`; uppercase wordmark: `LAZY ALIEN SERVER`; abbreviation: `LAS`; domain/version: `LZALIEN.ORG — V2.0`.
- Positioning: `Lazy Alien Server简称LAS~是以学生群体为主的技术交流向Minecraft服务器。`
- Hero kicker: `STUDENT-LED` / `TECH EXCHANGE`; descriptor: `MINECRAFT TECH SERVER`.
- Slogans: `与 LAS 的成员们，携手并进`; `A Realistic Dream.`; `做一场现实的梦`.
- Founding: `EST. 2022.08.29`; timer origin: `2022-08-29T00:00:00+08:00`.
- Page title: `LAS | Lazy Alien Server`.
- Meta description: `Lazy Alien Server (LAS) — 以学生群体为主的技术交流向 Minecraft 服务器`.
- Document language: `zh-CN`.
- Other Minecraft game version/edition text: none found in the specified content sources. `V2.0` is the displayed site version text.
- Rules positioning: `「Lazy Alien Server」 是一个免费的、公益的Minecraft生电服务器` (full article preserved in section 7).

## 2. Navigation & routes

Sources: `src/router/index.ts:1-24`; `src/components/SiteNav.vue:1-20`; `src/components/SiteNavbar.vue:1-14`; `src/components/HeroSection.vue:13-15`; `src/components/JoinSection.vue:12-58`; `src/views/RulesPage.vue:48-95`; `src/components/FooterSection.vue:1-31`; `src/components/GithubProjects.vue`.

| Route      | Route name | Nav label | Nav index |
| ---------- | ---------- | --------- | --------- |
| `/`        | `home`     | 首页      | 0         |
| `/rules`   | `rules`    | 规章      | 1         |
| `/gallery` | `gallery`  | 画廊      | 2         |

- Main navigation accessibility label: `主导航`.
- Nav brand `LAZY ALIEN SERVER`, image alt `LAS logo` → `/`.
- Hero `加入我们` → `#join`; `了解详情` → `#about`.
- Join `审核制` / `PATH 01` → `/rules?path=01#06`.
- Join `邀请制` / `PATH 02` → `/rules?path=02#06`.
- Join `加入 QQ 群` → `https://qm.qq.com/q/32DhVd36iI`.
- GitHub `查看更多` → `https://github.com/LazyAlienServer`; individual project links use API `html_url`.
- Team Bilibili links: section 5.
- Rules chapter links: `#01` 关于服务器; `#02` 强规章制度; `#03` 作弊; `#04` 言论与道德规范; `#05` 工程规范; `#06` 白名单审核与邀请制度; `#07` 管理约束; `#08` 奖惩制度; `#09` 解释. Accessibility copy: `章节目录`, `展开章节目录`.
- Rules signoff `tanh丶桁` → `https://space.bilibili.com/454721668`; `LazyAlienServer` → `https://space.bilibili.com/` (the source contains no user ID on this second link).
- Rules article links use `CATCOIN` / `TANH`, preserved below.
- Footer brand `LAZY ALIEN SERVER` → `/`.
- No additional routes are defined in `src/router/index.ts`.

## 3. Homepage sections in page order

Source for order: `src/views/HomePage.vue:1-27`. Shared navigation precedes the routed page. Order: Hero → ticker (left) → introduction (`about`) → ticker (right) → live timer → hardware plus infrastructure → GitHub → team → join → footer.

### Hero

Source: `src/components/HeroSection.vue:1-40`.

```text
STUDENT-LED
TECH EXCHANGE
LAZY ALIEN
SERVER
与 LAS 的成员们，携手并进
加入我们
了解详情
SERVER STATUS: ONLINE
LZALIEN.ORG — V2.0
MINECRAFT TECH SERVER
EST. 2022.08.29
LAS
```

Image: `/hero.webp`; alt: `LAS survival build — gothic hall`.

### Upper ticker

Source: `src/components/ScrollTicker.vue:1-24`; `src/views/HomePage.vue:5`.

`LAZY ALIEN SERVER` appears twice per unit; `TICKER_UNITS = 4`. Upper ticker direction is `left`. No other ticker copy.

### Introduction / about

Source: `src/components/IntroSection.vue:1-62`.

```text
LAS
PROFILE // 档案
关于我们
NAME
Lazy Alien Server
FOCUS
技术交流
MEMBERS
学生群体
Lazy Alien Server简称LAS~是以学生群体为主的技术交流向Minecraft服务器。
我们充分鼓励技术探索与交流，并欢迎有能力的玩家加入。
我们为成员提供强大的硬件支持，依托于高性能物理机和完善的存储与备份方案，我们能够提供充足的性能并保障数据安全。
除此之外，我们还设有开发团队，并有多个自主开发的模组和插件。
+
SYS.STATUS // ONLINE
MODE // SURVIVAL
+
```

Logo label: `LAS emblem`. Logo: `src/assets/logo.svg`; alternate: `src/assets/logo-v1.svg`.

### Lower ticker

Source: `src/components/ScrollTicker.vue:1-24`; `src/views/HomePage.vue:7`.

Same `LAZY ALIEN SERVER` copy and four repeated units; direction `right`.

### Live timer

Source: `src/components/LiveTimer.vue:1-207`.

```text
A Realistic Dream.
做一场现实的梦
2022.08.29
NOW
天
小时
分钟
秒
SIGNAL LOCK // LIVE FEED
```

Timeline accessibility label: `LAS 运行时间线`. Timeline adds each year from 2023 through the current calendar year. Uptime begins at `2022-08-29T00:00:00+08:00`. Carousel index is zero-padded current position / total (`03` total). Background captions and paths, in source order:

| Path                    | Caption                        |
| ----------------------- | ------------------------------ |
| `/floatingcity.webp`    | FLOATING CITY // 浮空城        |
| `/ftl-ender-pearl.webp` | FTL PEARL CANNON // FTL 珍珠炮 |
| `/hero.webp`            | GOTHIC HALL // 哥特殿堂        |

Controls: `切换到背景 ${i + 1}`, `上一张背景`, `下一张背景`.

### Hardware / technical support

Source: `src/components/HardwareSection.vue:1-136`.

```text
技术支持
强劲的服务与支持为服务器保驾护航
TECH
SUPPORT
```

Tag list (source order): `99% UPTIME`, `13900K`, `96GB DDR5`, `4TB RAID 10`, `BGP & CN2`, `DEV TEAM`. List accessibility label: `Hardware status`.

| Index | Short | Title                     | Metric value | Unit |
| ----- | ----- | ------------------------- | ------------ | ---- |
| 01    | CPU   | CPU — i9-13900K           | 5.8          | GHZ  |
| 02    | RAM   | RAM — DDR5 5600MHz 内存   | 96           | GB   |
| 03    | RAID  | Storage — 2TB × 4 RAID 10 | 4            | TB   |

Descriptions, verbatim in matching order:

1. Intel 酷睿 i9-13900K，24 核 32 线程（8 个性能核 + 16 个能效核），主频可达 5.8–6.0GHz，配备 36MB 智能缓存。高主频让单线程的游戏逻辑运算稳定流畅，多核心则承担区块加载、备份等后台任务，为服务器提供充沛算力。
2. 两条 48GB 幻锋戟 DDR5-5600MHz 内存组成双通道，总容量 96GB。高频带宽加快数据交换，大容量可同时常驻更多已加载区块、实体与后台服务，保障多人在线时依然流畅运行。
3. 4 块 2TB M.2 NVMe SSD 组成 RAID 10 存储阵列，可用容量 4TB。条带化提升并发读写速度，镜像冗余让任意一块硬盘故障时数据仍完整可用，兼顾速度、容量与数据安全。

### Infrastructure features

Source: `src/components/InfrastructureFeatures.vue:25-42`. Part of the hardware section.

| Title                   | Description                                                                                  |
| ----------------------- | -------------------------------------------------------------------------------------------- |
| BGP 线路接入，多线容灾  | 多节点 BGP 负载容灾，降低跨网QoS丢包，提升最大吞吐量，减少高峰期延迟。                       |
| 香港 CN2 节点，海外加速 | 为海外玩家提供更稳定的跨境链路，平均降低 100-200ms 延迟，丢包率低于 10% 。                   |
| 自研插件模组，持续迭代  | 运维工具、服务器插件和模组自主开发；按服务器需求持续迭代，兼顾功能扩展、性能控制与版本兼容。 |

### GitHub / open source

Source: `src/components/GithubProjects.vue:1-325`.

```text
GITHUB
GITHUB.COM/
LAZYALIENSERVER
LAZY ALIEN SERVER
OPEN SOURCE
开源项目
REPOSITORY INDEX OFFLINE
No public repositories found.
RETRY UPLINK
MISC
No description provided.
—
查看更多
```

Dynamic labels include `// ${language}`, project name, description, stars, zero-padded project index, current / total. Date format derives from `pushed_at` as `YYYY.MM.DD`. Accessibility labels: `开源项目轮播`, `开源项目移动端列表`, `上一个项目`, `下一个项目`. Source error messages: `Failed to fetch repos`, `Invalid repository response`, `Unknown error`. Runtime repository content is not hard-coded; none found as static project entries. Full data contract: section 4.

### Team

Source: `src/components/AdminTeam.vue:1-177`.

```text
CREW MANIFEST // 名册
管理团队
OPERATORS
BILIBILI →
—
```

Count: `07`; role counts: `ADMIN 02`, `TECH 04`, `MOD 01`. Entry indices: `OP-01` through `OP-07`. All entries preserved in section 5.

### Join

Source: `src/components/JoinSection.vue:1-118`. Full copy and destinations: section 6.

### Footer

Source: `src/components/FooterSection.vue:1-39`. Full copy: section 9.

## 4. GitHub

Sources: `src/components/GithubProjects.vue:255-388`; `architecture.md:119-132`; conflicting older summary in `AGENTS.md:28`.

- Organization: `LazyAlienServer`.
- Organization URL: `https://github.com/LazyAlienServer`.
- API endpoint: `https://api.github.com/orgs/LazyAlienServer/repos?per_page=100`.
- Cache key: `las-github-repos`.
- Cache TTL: `10 * 60 * 1000` (10 minutes).
- Cache envelope fields: `at`, `repos`.
- Count: `REPO_COUNT = 5`; descending `stargazers_count`, then first five. `AGENTS.md` says “six most-starred repositories”; implementation and `architecture.md` specify five.
- Fields used: `name: string`; `description: string | null`; `html_url: string`; `stargazers_count: number`; `language: string | null`; `pushed_at: string`.
- Names, descriptions, languages, stars, dates, and links are populated from this API, not supplied by static LAS data.

## 5. Team/operators

Source: `src/components/AdminTeam.vue:83-164`.

Avatar base, verbatim: `https://lzalien.org/source/img/admins`. Each avatar below expands the source `${AVATAR_BASE}` expression without changing its path. All seven source statuses are `online`.

| Name         | Title         | Role  | Display role | Avatar URL                                             | Bilibili URL                         |
| ------------ | ------------- | ----- | ------------ | ------------------------------------------------------ | ------------------------------------ |
| tanh_Heng    | 物理服主      | admin | ADMIN        | https://lzalien.org/source/img/admins/tanh_Heng.png    | https://space.bilibili.com/454721668 |
| CatCoinZHSM  | 服主          | admin | ADMIN        | https://lzalien.org/source/img/admins/CatCoinZHSM.png  | https://space.bilibili.com/401914568 |
| Fanzhitianyu | 技术管理/红石 | tech  | TECH         | https://lzalien.org/source/img/admins/Fanzhitianyu.png | null                                 |
| RCY_QWQ      | 技术管理/红石 | tech  | TECH         | https://lzalien.org/source/img/admins/RCY_QWQ.png      | null                                 |
| yizhi_jiyan_ | 技术管理/建筑 | tech  | TECH         | https://lzalien.org/source/img/admins/yizhi_jiyan_.png | null                                 |
| Eclipse_313  | 寄术支持      | tech  | TECH         | https://lzalien.org/source/img/admins/Eclipse_313.png  | null                                 |
| bookban_7    | 综合管理      | mod   | MOD          | https://lzalien.org/source/img/admins/bookban_7.png    | null                                 |

Additional role-label constant: `core: "CORE"` (no operator entry uses it). Avatar alt pattern: `${op.name} operator avatar`; unavailable label: `${op.name} operator avatar unavailable`; fallback character is the first character of the name.

## 6. Join

Source: `src/components/JoinSection.vue:1-118`; `src/views/RulesPage.vue:111-133`.

```text
JOIN US
加入我们
审核制
PATH 01
通过素养审核（一审）与技术审核（二审），考察综合素质与红石、后勤或建筑能力。
邀请制
PATH 02
由成员担保邀请，通过面试及技术审核；被邀请人违规时邀请人承担连带责任。
CHANNEL OPEN // RECRUITING
835047145
服外交流群 // QQ GROUP
加入 QQ 群
复制群号
已复制群号
```

- Group constant: `GROUP_NUMBER = "835047145"`.
- QQ group link: `https://qm.qq.com/q/32DhVd36iI`.
- 审核制: `/rules?path=01#06`; highlighted source article IDs: `article-37`, `article-38`, `article-39`, `article-40`, `article-41`, `article-42`, `article-43`.
- 邀请制: `/rules?path=02#06`; highlighted source article IDs: `article-44`, `article-45`, `article-46`, `article-47`.
- Both point to chapter anchor `06`, not `chapter-6`.
- Separate numbered join steps: none found; the two path descriptions above are the complete homepage joining instructions.

## 7. Rules page

Sources: `src/views/RulesPage.vue:1-137`; complete `src/data/rules.ts` below.

Page copy:

```text
LAS // COMMUNITY PROTOCOL
Lazy Alien Server
规章制度
REVISION
2023.08.15
CHAPTERS
ARTICLES
END OF DOCUMENT
tanh丶桁
&
LazyAlienServer
2023.08.15
```

Counts derived from data: `09` chapters, `57` articles. No separate introductory paragraph found. Chapter metadata pattern, verbatim: `{{ chapter.label }} // 共 {{ chapter.articles.length }} 条`. Heading anchors `01`–`09` correspond to chapter order. Signoff links are listed in section 2.

### Complete rules.ts (verbatim source)

```ts
export interface Article {
  id: string;
  title: string;
  content: string;
}

export interface Chapter {
  id: string;
  title: string;
  articles: Article[];
}

const CATCOIN = "https://space.bilibili.com/401914568";
const TANH = "https://space.bilibili.com/454721668";

/**
 * LazyAlienServer 规章制度 — transcribed from https://lzalien.org/rules/
 * Static content; edit here and redeploy to update.
 */
export const chapters: Chapter[] = [
  {
    id: "chapter-1",
    title: "第一章 关于服务器",
    articles: [
      {
        id: "article-1",
        title: "第一条",
        content: `<p>「Lazy Alien Server」 是一个免费的、公益的Minecraft生电服务器，由<a href="${CATCOIN}" target="_blank" rel="noopener noreferrer">「服主」CatCoinZHSM</a>和<a href="${TANH}" target="_blank" rel="noopener noreferrer">「物理服主」tanh_Heng</a>共同建立，简称「LAS」。</p>`,
      },
      {
        id: "article-2",
        title: "第二条",
        content: `<p>建立宗旨：「?」。</p>`,
      },
    ],
  },
  {
    id: "chapter-2",
    title: "第二章 强规章制度",
    articles: [
      {
        id: "article-3",
        title: "第三条",
        content: `<p>「强规章制度」指：任何成员不得以任何理由，违反本章下的任何条目；一经发现，处以「禁令处罚」</p><p class="note">禁令处罚 参见「第八章 奖惩制度」</p>`,
      },
      { id: "article-4", title: "第四条", content: `<p>严令禁止违反国家法律法规</p>` },
      {
        id: "article-5",
        title: "第五条",
        content: `<p>严令禁止损坏、阻碍服务器软件、硬件、网络通信等正常运行。严禁损坏、覆盖、恶意修改、删除服务器数据。</p>`,
      },
      {
        id: "article-6",
        title: "第六条",
        content: `<p>严令禁止以LAS成员身份，在外刻意贬低或拔高LAS，或将LAS与其他服务器、组织、个人相比较。</p>`,
      },
      {
        id: "article-7",
        title: "第七条",
        content: `<p>严令禁止泄露服务器内部敏感信息，包括但不限于服务器ip地址、连接域名、内部交流群群号等。</p><p class="note">未经允许转发内群聊天记录同样适用于本条目。</p>`,
      },
      {
        id: "article-8",
        title: "第八条",
        content: `<p>制度中并未明确，但对服务器或其成员造成严重实质损害，或侵犯其合法权利的行为严令禁止。</p>`,
      },
      {
        id: "article-9",
        title: "第九条",
        content: `<p>制度中并未明确，但在LAS外造成严重不良影响的行为严令禁止。</p>`,
      },
      {
        id: "article-10",
        title: "第十条",
        content: `<p>严令禁止通过教唆、引诱、诱导等方式使其他成员进行违反制度的行为，严禁包庇其他成员违反制度的行为。</p>`,
      },
    ],
  },
  {
    id: "chapter-3",
    title: "第三章 作弊",
    articles: [
      {
        id: "article-11",
        title: "第十一条",
        content: `<p>必须使用服务器客户端或其他自改客户端游玩。严令禁止使用任何能够破坏服务器公平稳定的客户端。本条目为「禁令」。</p><p class="note">严令禁止使用的客户端包括但不限于：外挂类客户端（如水影Liquidbounce,沃斯特Wurst）</p>`,
      },
      {
        id: "article-12",
        title: "第十二条",
        content: `<p>严禁进行任何付出与回报严重不对等的行为。本条目为「禁令」。 </p><p class="note">严禁使用更新抑制复制物品，原版不可再生且无carpet再生特性的物品除外；</p><p class="note">严禁使用任何软件进行矿物透视、AI挖矿等；</p><p class="note">严禁通过更改carpet设置项获取物品或简化操作。</p>`,
      },
      {
        id: "article-13",
        title: "第十三条",
        content: `<p>严禁使用投影打印机。本条目为「禁令」。</p>`,
      },
      {
        id: "article-14",
        title: "第十四条",
        content: `<p>严禁使用不被允许的第三方软件或指令修改玩家、物品等的数据或行为。本条目为「禁令」。</p><p class="note">包括但不限于：以任何方式获得当前版本生存模式下无法获得的物品，以非常规方式执行常规状态下无法执行的指令，以任何方式进行当前版本生存模式下无法进行的行为。</p>`,
      },
      {
        id: "article-15",
        title: "第十五条",
        content: `<p>部分特殊行为本章并未明确，但经管理组讨论禁止的，应在警告后及时停止该行为。</p>`,
      },
    ],
  },
  {
    id: "chapter-4",
    title: "第四章 言论与道德规范",
    articles: [
      { id: "article-16", title: "第十六条", content: `<p>严禁出现任何政治敏感话题。</p>` },
      {
        id: "article-17",
        title: "第十七条",
        content: `<p>严禁以任何行为，挑起成员间矛盾、对立。</p>`,
      },
      {
        id: "article-18",
        title: "第十八条",
        content: `<p>严禁人身攻击，包括但不限于辱骂、歧视、孤立等攻击他人的行为。</p>`,
      },
      {
        id: "article-19",
        title: "第十九条",
        content: `<p>严禁刷屏。</p><p class="note">刷屏 包括但不限于连续发送超过三条（不包括三条）重复信息，重复性的长段信息，或超过三张的相同表情、图片。</p>`,
      },
      { id: "article-20", title: "第二十条", content: `<p>除特殊说明外，严禁发布广告。</p>` },
      {
        id: "article-21",
        title: "第二十一条",
        content: `<p>严禁发布不良网络链接。转发不明连接时，应注明链接内容。</p>`,
      },
      {
        id: "article-22",
        title: "第二十二条",
        content: `<p>本章未明确规定但经管理组讨论认为不宜的行为，应及时停止。</p><p class="note">此类不宜行为包括：讨论与外挂类客户端相关的内容(2023.08.21增加)</p>`,
      },
      { id: "article-23", title: "第二十三条", content: `<p>严禁干扰其他成员正常游玩。</p>` },
      {
        id: "article-24",
        title: "第二十四条",
        content: `<p>若因个人违规行为造成他人资源损耗，应及时补偿。</p>`,
      },
      {
        id: "article-25",
        title: "第二十五条",
        content: `<p>未经对方允许，严禁攻击他人、展开PVP。</p><p class="note">PVP 指玩家与玩家间对战。</p>`,
      },
      {
        id: "article-26",
        title: "第二十六条",
        content: `<p>因误发生纠纷，若无法协商解决，应第一时间联系管理组。</p>`,
      },
      {
        id: "article-27",
        title: "第二十七条",
        content: `<p>因误造成大量无用卡顿，警告后须及时采取相应措施。</p>`,
      },
    ],
  },
  {
    id: "chapter-5",
    title: "第五章 工程规范",
    articles: [
      {
        id: "article-28",
        title: "第二十八条",
        content: `<p>为避免对服务器物力资源与人力资源造成不必要的浪费，所有建设实装的工程应事先联系管理组进行报备。未报备的机器将视为「违规工程」，不在本章的保护范围内。本章下文中「工程」或「机器」均指已报备通过的机器、建筑等工程项目。</p>`,
      },
      { id: "article-29", title: "第二十九条", content: `<p>本章适用于所有子服务器。</p>` },
      { id: "article-30", title: "第三十条", content: `<p>严禁未经同意改造、破坏、拆除工程。</p>` },
      {
        id: "article-31",
        title: "第三十一条",
        content: `<p>若因不正当方式使用机器导致损坏，应及时修复。如无力修复，请及时联系机器负责人。严禁隐瞒、谎报机器损坏情况。若多次损坏机器，须接受惩罚。</p>`,
      },
      {
        id: "article-32",
        title: "第三十二条",
        content: `<p>参与工程实装时，若出现实装错误，应及时修复或联系工程负责人。若因误导致工程延期、资源损耗等，应及时采取补救措施。</p>`,
      },
      {
        id: "article-33",
        title: "第三十三条",
        content: `<p>实装违规工程造成服务器资源损耗的，须承担所有责任。</p><p class="note">责任 包括但不限于人力资源损耗、物力资源损耗、影响其他工程建造导致延期等。</p>`,
      },
      { id: "article-34", title: "第三十四条", content: `<p>严禁拿取已经标明的工程材料。</p>` },
      { id: "article-35", title: "第三十五条", content: `<p>工程规划必须明示全体成员。</p>` },
    ],
  },
  {
    id: "chapter-6",
    title: "第六章 白名单审核与邀请制度",
    articles: [
      {
        id: "article-36",
        title: "第三十六条",
        content: `<p>白名单制度分为审核制和邀请担保制。</p>`,
      },
      { id: "article-37", title: "第三十七条", content: `<p>本章第二至八条为审核制度。</p>` },
      {
        id: "article-38",
        title: "第三十八条",
        content: `<p>审核制度分为素养审核和技术审核。</p><p class="note">素养审核 即「一审」，指考察综合素质素养的问卷。</p><p class="note">技术审核 即「二审」，指考察红石技术、后勤能力或建筑水平的审核。</p>`,
      },
      {
        id: "article-39",
        title: "第三十九条",
        content: `<p>所有审核卷应经由管理组一致同意后发放。</p>`,
      },
      {
        id: "article-40",
        title: "第四十条",
        content: `<p>除指定的审核员外，其余成员无权审核，严禁向未通过审核的成员泄露相关内容。</p>`,
      },
      {
        id: "article-41",
        title: "第四十一条",
        content: `<p>红石审核不得以高难题目刻意刁难。</p>`,
      },
      {
        id: "article-42",
        title: "第四十二条",
        content: `<p>建筑审核不得以高难题目刻意刁难。建筑审核须至少两名建筑审核员参与评审。</p>`,
      },
      {
        id: "article-43",
        title: "第四十三条",
        content: `<p>后勤审核可适当要求活跃时长。后勤活跃时长未达标的，管理组有权要求复审。</p><p class="note">活跃时长 指在服务器内参与工程建设的时长。</p>`,
      },
      {
        id: "article-44",
        title: "第四十四条",
        content: `<p>本章第九至十二条为邀请担保制度。</p>`,
      },
      {
        id: "article-45",
        title: "第四十五条",
        content: `<p>由管理员担保邀请的人员可不进行问卷审核，但需要接受面试。面试须至少两名面试审核员参与评审</p><p class="note">面试 指通过线上交流，如QQ聊天、语音通话等方式进行审核。</p>`,
      },
      {
        id: "article-46",
        title: "第四十六条",
        content: `<p>非管理员担保邀请的人员可不进行素养审核，但需要接受面试及技术审核。</p><p class="note">技术审核 指红石审核、后勤审核或建筑审核。</p>`,
      },
      {
        id: "article-47",
        title: "第四十七条",
        content: `<p>被邀请人违反制度时，邀请人必须承担连带责任。</p>`,
      },
      {
        id: "article-48",
        title: "第四十八条",
        content: `<p>成员进入白名单前必须详细阅读《LazyAlienServer规章制度》。</p>`,
      },
    ],
  },
  {
    id: "chapter-7",
    title: "第七章 管理约束",
    articles: [
      {
        id: "article-49",
        title: "第四十九条",
        content: `<p>管理组成员必须严格依照本制度规范成员行为，严禁出现任何有违制度的越界行为。</p>`,
      },
      {
        id: "article-50",
        title: "第五十条",
        content: `<p>当有涉及服务器内多数成员利益或服务器核心利益的决策时，应进行表决。</p><p class="note">表决 指管理组与成员投票表决。除特殊说明外，管理组同意率达50%及以上且成员同意率达50%及以上时，表决通过；反之驳回。</p>`,
      },
      {
        id: "article-51",
        title: "第五十一条",
        content: `<p>管理组受全体成员监督。若管理员违反制度，则按照制度处罚，并暂时或永久撤去管理员身份。</p>`,
      },
    ],
  },
  {
    id: "chapter-8",
    title: "第八章 奖惩制度",
    articles: [
      {
        id: "article-52",
        title: "第五十二条",
        content: `<p>根据违规程度，对应以下处罚：</p><ol><li>踢出服务器并永久禁止再次加入</li><li>踢出服务器，需要再次由管理组严格复审后才可重新加入</li><li>长期封禁</li><li>暂时封禁</li><li>通告批评</li><li>口头警告</li></ol>`,
      },
      {
        id: "article-53",
        title: "第五十三条",
        content: `<p>处罚以管理组最终决定为准。除口头警告外，其余处罚结果都应公示在群公告及官网公告。</p>`,
      },
      {
        id: "article-54",
        title: "第五十四条",
        content: `<p>根据违规程度，可追加7-30天观察期。观察期内被观察人员若再次受到处罚，则根据严重程度处长期封禁至踢出服务器处罚。</p>`,
      },
      {
        id: "article-55",
        title: "第五十五条",
        content: `<p>若违反「禁令」，一经发现，即刻踢出服务器并永久禁止再次加入，拉入服务器黑名单。</p>`,
      },
    ],
  },
  {
    id: "chapter-9",
    title: "第九章 解释",
    articles: [
      { id: "article-56", title: "第五十六条", content: `<p>本制度有待补充完善。</p>` },
      {
        id: "article-57",
        title: "第五十七条",
        content: `<p>本制度最终解释权归<a href="${CATCOIN}" target="_blank" rel="noopener noreferrer">「服主」CatCoinZHSM</a>和<a href="${TANH}" target="_blank" rel="noopener noreferrer">「物理服主」tanh丶桁</a>所有。</p><p class="note">本条目仅用于限制利用制度漏洞违规的行为。</p>`,
      },
    ],
  },
];
```

## 8. Gallery

Sources: `src/data/gallery.ts:1-56`; `src/views/GalleryPage.vue:1-290`; timer captions: `src/components/LiveTimer.vue:197-202`.

Categories:

| id           | label | labelEn      |
| ------------ | ----- | ------------ |
| architecture | 建筑  | ARCHITECTURE |
| redstone     | 红石  | REDSTONE     |

Every gallery item, source order:

| Archive no. | id               | title      | titleEn          | src                   | category     | width | height |
| ----------- | ---------------- | ---------- | ---------------- | --------------------- | ------------ | ----- | ------ |
| 01          | gothic-hall      | 哥特殿堂   | GOTHIC HALL      | /hero.webp            | architecture | 1920  | 1080   |
| 02          | floating-city    | 浮空城     | FLOATING CITY    | /floatingcity.webp    | architecture | 1920  | 1080   |
| 03          | ftl-pearl-cannon | FTL 珍珠炮 | FTL PEARL CANNON | /ftl-ender-pearl.webp | redstone     | 1920  | 981    |

Dedicated `caption` field: none found. Visible frame captions comprise title, English title, and category labels above; timer-specific captions are preserved in section 3.

Page copy:

```text
LAS // VISUAL ARCHIVE
画廊
GALLERY
服务器中的建筑、机械与红石工程，记录 Lazy Alien Server 成员共同建造的世界。
FRAMES
CATEGORIES
SINCE
2022.08.29
全部
建筑
红石
SHOWING
GRID
INDEX
该类别暂无作品 // NO FRAMES
查看 / VIEW
NO.
标题 / TITLE
类别
尺寸 / PX
```

Totals: `FRAMES 03`, `CATEGORIES 02`; filter counts: `全部 03`, `建筑 02`, `红石 01`. Size display uses `${width} × ${height} PX`; viewer caption combines `${titleEn} // ${category.labelEn} // ${width} × ${height} PX`. Coordinate decoration: `X`, `0000`, `Y`, `0000`.

Accessibility/control copy: `按类别筛选`, `显示方式`, `网格视图`, `索引视图`, `画廊作品`, `查看大图：${entry.item.title}`, `画廊索引`, `图片查看器`, `上一张`, `下一张`, `关闭`, `选择图片`. Viewer thumbnail labels use the corresponding item title.

## 9. Footer / under-footer

Source: `src/components/FooterSection.vue:1-39`; use on pages: `src/views/HomePage.vue`, `src/views/RulesPage.vue`, `src/views/GalleryPage.vue`.

```text
LAZY ALIEN SERVER
官网设计 / tanh_Heng
技术支持 / LAS Dev Team
联系我们 / 835047145
(服外交流群)
© {{ year }} LAZY ALIEN SERVER
EST. 2022.08.29 — V2.0
LAZY ALIEN SERVER
```

`year` source: `new Date().getFullYear()`. The brand link targets `/`; image alt is `LAS logo`. Closing wordmark accessibility label: `LAZY ALIEN SERVER`.

`UnderFooterSection.vue`: none found in the complete `src/components/` listing; the closing wordmark is part of `FooterSection.vue`. ICP/备案 or other registration text: none found in the specified source content (search covered `src`, `index.html`, `AGENTS.md`, and `architecture.md`). Additional footer external links: none found.

## 10. Assets

Sources: complete file listings of `public/`, `src/assets/`, `.design/resources/`, `.design/logos/`; `src/data/gallery.ts`; `src/components/HeroSection.vue`; `src/components/IntroSection.vue`; `src/components/LiveTimer.vue`; `src/components/SiteNav.vue`; `src/components/GithubProjects.vue`; `src/components/FooterSection.vue`; first SVG lines; `index.html`.

| File                                    | Dimensions supplied by source                      | Depiction / source-backed use                                                                 |
| --------------------------------------- | -------------------------------------------------- | --------------------------------------------------------------------------------------------- |
| `public/favicon.svg`                    | 96 × 96                                            | Site favicon, referenced by `index.html`                                                      |
| `public/hero.webp`                      | 1920 × 1080                                        | `哥特殿堂` / `GOTHIC HALL`; hero alt `LAS survival build — gothic hall`; hero, timer, gallery |
| `public/floatingcity.webp`              | 1920 × 1080                                        | `浮空城` / `FLOATING CITY`; timer and gallery                                                 |
| `public/ftl-ender-pearl.webp`           | 1920 × 981                                         | `FTL 珍珠炮` / `FTL PEARL CANNON`; timer and gallery                                          |
| `src/assets/logo.svg`                   | SVG width 97, height 73, viewBox `0 0 97 73`       | LAS logo; navigation, introduction, GitHub rail, footer                                       |
| `src/assets/logo-v1.svg`                | SVG width 881, height 1080, viewBox `0 0 881 1080` | LAS v1 logo; introduction alternate emblem                                                    |
| `.design/logos/logo.svg`                | SVG width 881, height 1080, viewBox `0 0 881 1080` | v1 logo identified by `architecture.md:137`; no direct runtime import found in `src`          |
| `.design/logos/logo-v2.svg`             | SVG width 97, height 73, viewBox `0 0 97 73`       | Design logo file; no direct runtime import found in `src`                                     |
| `.design/resources/floatingcity.jpg`    | none found in data                                 | Design resource; name `floatingcity`; no direct runtime reference found in `src`              |
| `.design/resources/FTL-ender-pearl.png` | none found in data                                 | Design resource; name `FTL-ender-pearl`; no direct runtime reference found in `src`           |
| `.design/resources/hero-image.png`      | none found in data                                 | Design resource; name `hero-image`; no direct runtime reference found in `src`                |

These are all 11 files in the four requested asset directories. No other files or subdirectories were returned there. Design-resource depictions beyond filenames are not asserted; no image-to-image identity is assumed. Remote operator avatar images, URLs and source names are all listed in section 5; intrinsic avatar dimensions are not supplied by the operator data.

## 11. v2 visual identity summary

Sources: `src/styles/variables.scss:1-18`; `index.html:12-18`; `src/components/FooterSection.vue:136-139`; `AGENTS.md:15-19`; `.design/reference/conclusion.md:3-39`; `architecture.md:151-164`.

Actual v2 tokens: `$color-primary-blue: #0f66dd`; `$color-blue-bright: #1e90ff`; `$color-blue-dim: rgba(30, 144, 255, 0.45)`; `$color-primary-black: #0a0a0a`; `$color-black-soft: #111114`; `$color-white: #ffffff`; `$color-gray-dark: #2a2a2a`; `$color-gray-mid: #aaaaaa`; `$color-gray-light: #cccccc`. Fonts: `$font-primary: "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`; `$font-display: "Roboto Condensed", "Inter", sans-serif`; Google Fonts loads Inter 400/600/700, Noto Sans SC 900, Roboto Condensed 500/700; the closing wordmark uses `"Noto Sans SC", sans-serif`. Reference style label: **Neo-industrial anime sci-fi / brutalist editorial UI**. Actual project description: “blue and black are primary colors, white is used for contrast”; the reference document's yellow/magenta/mint/red palette describes the reference, not the actual v2 tokens. Tilt rule, verbatim from `AGENTS.md`: “Tilt rule: every slanted mark, edge, or panel uses the hero split-line angle, never a hand-picked degree. The angle is the shared `--hero-slant` (with `--hero-slant-tan`) defined in `src/styles/global.scss`. It is computed from the hero image's clipped left edge, so it follows the viewport. Apply it as `transform: skewX(calc(-1 * var(--hero-slant)))` so slants lean like `/`. For a slanted edge on one side only, skew a background pseudo-element and clip it with `overflow: hidden` rather than hard-coding a pixel offset in `clip-path`. Out of scope: 45° corner chamfers (`clipped-panel`), diagonal hatch patterns, rotations (clock hands, arrows, vertical labels), and the hero seam itself.”
