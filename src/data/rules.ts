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
    title: "第一章 关于 Lazy Alien Server 服务器",
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
