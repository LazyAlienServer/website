import { useEffect, useState } from "react";
import {
  ArrowDown,
  BookOpenText,
  ChevronRight,
  Cpu,
  HardDrive,
  Image,
  MapPinned,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from "lucide-react";
import GradientText from "../components/GradientText";
import Navbar, { type NavItem } from "../components/Navbar";
import PixelCard from "../components/PixelCard";
import PixelBlast from "../components/PixelBlast";
import ProfileCard from "../components/ProfileCard";
import SpotlightCard from "../components/SpotlightCard";
import { publicAsset } from "./publicAsset";

const navItems: NavItem[] = [
  { id: "home", label: "首页", subLabel: "HOME" },
  { id: "server", label: "服务器", subLabel: "SERVER" },
  { id: "about", label: "关于", subLabel: "ABOUT" },
  { id: "dream", label: "图册", subLabel: "ALBUM" },
  { id: "join", label: "加入", subLabel: "JOIN" },
];

const heroTags = ["Minecraft", "技术交流", "生电工程", "自主开发"];

const serverFeatures = [
  {
    icon: Cpu,
    title: "高性能硬件",
    description:
      "依托物理机与稳定网络运行，为大型工程、长期测试和日常游玩留出余量。",
  },
  {
    icon: HardDrive,
    title: "存储与备份",
    description: "重视数据安全和存档延续，尽量让每一次创造都有安心落点。",
  },
  {
    icon: MessageSquareText,
    title: "技术交流",
    description: "成员围绕生电、建筑、运维和开发分享经验，也一起复盘工程问题。",
  },
  {
    icon: ShieldCheck,
    title: "规则共识",
    description:
      "通过清晰规则保护成员作品，也让公共设施和服务器秩序能够长期维护。",
  },
];

const principles = [
  {
    title: "学生主导",
    copy: "以学生成员为核心，鼓励技术探索、长期协作和稳定产出。",
  },
  {
    title: "生电友好",
    copy: "为大型机器、长期工程和高频测试预留性能与规则空间。",
  },
  {
    title: "透明维护",
    copy: "服务器事务尽可能归档、可查、可交接，降低维护成本。",
  },
];

const works = [
  {
    title: "珍珠炮工程",
    meta: "红石 / 远程投送",
    body: "面向高精度测试的工程记录，从设计假设到实装反馈都能被后来者接上。",
  },
  {
    title: "主城基础设施",
    meta: "建筑 / 交通 / 仓储",
    body: "将公共设施作为长期项目维护，兼顾美观、效率和服务器负载。",
  },
  {
    title: "数据与备份",
    meta: "运维 / 存档 / 恢复",
    body: "围绕物理机、存储和备份建立稳定流程，让创造可以安心延续。",
  },
];

const serverStats = [
  { value: "SERVER", label: "Lazy Alien Server" },
  { value: "MC", label: "Minecraft Java" },
  { value: "DEV", label: "自研插件与模组" },
];

const App = () => {
  const [activeSection, setActiveSection] = useState("home");

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (!element) return;

    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveSection(sectionId);
  };

  useEffect(() => {
    const controller = new AbortController();

    const handleScroll = () => {
      const offset = window.innerHeight * 0.35;
      let current = "home";

      for (const item of navItems) {
        const section = document.getElementById(item.id);
        if (section && section.getBoundingClientRect().top <= offset) {
          current = item.id;
        }
      }

      setActiveSection(current);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, {
      passive: true,
      signal: controller.signal,
    });

    return () => controller.abort();
  }, []);

  return (
    <div className="site-shell">
      <a href="#main-content" className="skip-link">
        跳转到主要内容
      </a>
      <Navbar
        activeSection={activeSection}
        items={navItems}
        scrollToSection={scrollToSection}
      />

      <main id="main-content">
        <section id="home" className="hero-section section-frame">
          <div className="hero-media" aria-hidden="true">
            <img
              src={publicAsset("cathedral-bg.png")}
              alt=""
              width={1920}
              height={1080}
              className="hero-image"
            />
            <div className="hero-shade" />
            <div className="hero-pixels">
              <PixelBlast
                variant="diamond"
                pixelSize={5}
                pixelSizeJitter={1.4}
                color="#0d6bff"
                patternScale={4.6}
                patternDensity={0.72}
                enableRipples
                rippleSpeed={0.3}
                rippleThickness={0.055}
                rippleIntensityScale={0.65}
                speed={0.72}
                edgeFade={0.12}
                transparent
              />
            </div>
          </div>

          <div className="hero-grid">
            <div className="hero-copy">
              <p className="eyebrow">
                Lazy Alien Server
                <span>Minecraft 技术交流服务器</span>
              </p>
              <h1>
                LAZY ALIEN
                <GradientText
                  colors={["#f7f9ff", "#8ebdff", "#0d6bff", "#f7f9ff"]}
                  animationSpeed={6}
                  className="hero-gradient-word"
                >
                  SERVER
                </GradientText>
              </h1>
              <div className="hero-tags" aria-label="服务器特色">
                {heroTags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <p className="hero-lede">
                与 Lazy Alien Server
                的成员们携手并进：建造、开发、研究生电工程，也把服务器里的创造、规则和回忆认真留下来。
              </p>
              <div className="hero-actions">
                <button
                  type="button"
                  className="primary-action"
                  onClick={() => scrollToSection("server")}
                >
                  了解服务器
                  <ChevronRight size={18} aria-hidden="true" />
                </button>
                <button
                  type="button"
                  className="ghost-action"
                  onClick={() => scrollToSection("join")}
                >
                  加入我们
                </button>
              </div>
            </div>

            <div className="hero-orbit" aria-label="Lazy Alien Server 视觉标识">
              <div className="orbit-card">
                <div className="orbit-topline">
                  <span>SERVER NODE</span>
                  <span>ONLINE</span>
                </div>
                <img src={publicAsset("logo.svg")} alt="Lazy Alien Server" />
                <div className="orbit-preview">
                  <img src={publicAsset("cathedral-bg-small.png")} alt="" width={1920} height={1080} />
                </div>
                <div className="orbit-readout">
                  <span>Minecraft</span>
                  <span>Community server</span>
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            aria-label="滚动到服务器介绍"
            className="scroll-cue"
            onClick={() => scrollToSection("server")}
          >
            <ArrowDown size={22} aria-hidden="true" />
          </button>
        </section>

        <section id="server" className="platform-section section-frame">
          <div className="section-heading">
            <p className="eyebrow">SERVER</p>
            <h2>面向创造、协作与技术探索的 Minecraft 服务器</h2>
            <p>
              从设计稿延展出的官网版本保留黑白蓝主视觉，将服务器的硬件、规则、成员协作和作品沉淀放在更清楚的位置。
            </p>
          </div>

          <div className="platform-layout">
            <SpotlightCard
              className="dashboard-mockup"
              spotlightColor="rgba(93, 155, 255, 0.24)"
            >
              <div className="mockup-header">
                <div>
                  <span className="mockup-kicker">Server Brief</span>
                  <strong>Lazy Alien Server</strong>
                </div>
                <div className="window-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
              <div className="mockup-body">
                <div className="brief-image">
                  <img
                    src={publicAsset("cathedral-bg-small.png")}
                    alt="Lazy Alien Server 场景"
                    width={1920}
                    height={1080}
                  />
                </div>
                <div className="status-panel">
                  <MapPinned size={28} aria-hidden="true" />
                  <div>
                    <span>服务器据点</span>
                    <strong>在同一张地图里持续创造</strong>
                  </div>
                </div>
                <div className="stat-grid">
                  {serverStats.map((stat) => (
                    <div key={stat.label}>
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  ))}
                </div>
                <div className="activity-list">
                  <div>
                    <BookOpenText size={18} aria-hidden="true" />
                    <span>规章制度与公共设施持续维护</span>
                  </div>
                  <div>
                    <Image size={18} aria-hidden="true" />
                    <span>图册记录建筑、生电与服务器瞬间</span>
                  </div>
                  <div>
                    <MapPinned size={18} aria-hidden="true" />
                    <span>地图与工程点位帮助成员快速接入</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>

            <div className="module-grid">
              {serverFeatures.map((module) => {
                const Icon = module.icon;

                return (
                  <PixelCard
                    key={module.title}
                    className="module-card"
                    colors="#f7f9ff,#8ebdff,#0d6bff"
                    gap={12}
                    speed={22}
                  >
                    <article className="module-card-content">
                      <Icon size={24} aria-hidden="true" />
                      <h3>{module.title}</h3>
                      <p>{module.description}</p>
                    </article>
                  </PixelCard>
                );
              })}
            </div>
          </div>
        </section>

        <section id="about" className="about-section section-frame">
          <div className="about-copy">
            <p className="eyebrow">ABOUT US</p>
            <h2>一群认真把 Minecraft 玩成长期项目的人</h2>
            <p>
              Lazy Alien Server 是以学生群体为主的技术交流向 Minecraft
              服务器。我们鼓励技术探索、工程协作和审美表达，也欢迎有能力的玩家加入开发、建筑、生电与维护。
            </p>
            <p>
              服务器依托高性能物理机、完善存储与备份方案运行，同时保留自研模组和插件的开发空间。我们希望每一次创造都能被记录、被复盘、被下一位成员继续推进。
            </p>
          </div>

          <div className="principle-stack">
            {principles.map((principle, index) => (
              <SpotlightCard
                as="article"
                key={principle.title}
                className="principle-card"
                spotlightColor="rgba(126, 177, 255, 0.2)"
              >
                <span>{String(index + 1).padStart(2, "0")}</span>
                <h3>{principle.title}</h3>
                <p>{principle.copy}</p>
              </SpotlightCard>
            ))}
          </div>
        </section>

        <section id="dream" className="works-section section-frame">
          <div className="section-heading compact">
            <p className="eyebrow">ALBUM</p>
            <h2>让作品不只停留在截图里</h2>
          </div>

          <div className="works-showcase">
            <figure className="feature-image-card">
              <img
                src={publicAsset("cathedral-bg.png")}
                alt="Lazy Alien Server 建筑场景"
                width={1920}
                height={1080}
              />
            </figure>
            <div className="works-layout">
              {works.map((work) => (
                <SpotlightCard
                  as="article"
                  key={work.title}
                  className="work-card"
                  spotlightColor="rgba(13, 107, 255, 0.22)"
                >
                  <span>{work.meta}</span>
                  <h3>{work.title}</h3>
                  <p>{work.body}</p>
                </SpotlightCard>
              ))}
            </div>
          </div>
        </section>

        <section id="join" className="join-section section-frame">
          <div className="join-panel">
            <div>
              <p className="eyebrow">JOIN</p>
              <h2>如果你想把想法做成可运行的东西，来聊聊。</h2>
              <p>
                我们欢迎愿意共同维护规则、记录过程、尊重他人作品的成员。无论你偏向生电、建筑、插件开发还是服务器运维，都可以在
                Lazy Alien Server 找到能一起推进的人。
              </p>
            </div>
            <div className="join-side">
              <ProfileCard
                avatarUrl={publicAsset("logo.svg")}
                miniAvatarUrl={publicAsset("logo-simplified.svg")}
                iconUrl={publicAsset("cathedral-bg-small.png")}
                name="Lazy Alien Server"
                title="Minecraft 技术交流服务器"
                handle="lazy-alien-server"
                status="成员招募中"
                contactText="提交申请"
                onContactClick={() => scrollToSection("join")}
              />
              <div className="join-actions">
                <button type="button" className="primary-action">
                  <UsersRound size={18} aria-hidden="true" />
                  提交申请
                </button>
                <button type="button" className="ghost-action">
                  <Sparkles size={18} aria-hidden="true" />
                  查看规章
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <img
          src={publicAsset("logo-simplified.svg")}
          alt="Lazy Alien Server"
        />
        <span>Copyright © 2026 Lazy Alien Server</span>
        <span>CatCoinZHSM & tanh_Heng</span>
      </footer>
    </div>
  );
};

export default App;
