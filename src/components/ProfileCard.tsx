import {
  useCallback,
  useRef,
  type CSSProperties,
  type PointerEvent,
} from "react";

type ProfileCardProps = {
  avatarUrl: string;
  iconUrl?: string;
  miniAvatarUrl?: string;
  innerGradient?: string;
  behindGlowEnabled?: boolean;
  behindGlowColor?: string;
  behindGlowSize?: string;
  className?: string;
  enableTilt?: boolean;
  name?: string;
  title?: string;
  handle?: string;
  status?: string;
  contactText?: string;
  showUserInfo?: boolean;
  onContactClick?: () => void;
};

const ProfileCard = ({
  avatarUrl,
  iconUrl,
  miniAvatarUrl,
  innerGradient = "linear-gradient(145deg, rgba(13, 107, 255, 0.34), rgba(4, 8, 13, 0.94) 58%, rgba(247, 249, 255, 0.08))",
  behindGlowEnabled = true,
  behindGlowColor = "rgba(93, 155, 255, 0.5)",
  behindGlowSize = "48%",
  className = "",
  enableTilt = true,
  name = "Lazy Alien Server",
  title = "Minecraft 技术交流服务器",
  handle = "lazy-alien-server",
  status = "成员招募中",
  contactText = "提交申请",
  showUserInfo = true,
  onContactClick,
}: ProfileCardProps) => {
  const ref = useRef<HTMLDivElement>(null);

  const setPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enableTilt) return;

      const node = ref.current;
      if (!node) return;

      const rect = node.getBoundingClientRect();
      const percentX = ((event.clientX - rect.left) / rect.width) * 100;
      const percentY = ((event.clientY - rect.top) / rect.height) * 100;
      const rotateX = ((percentY - 50) / 50) * -7;
      const rotateY = ((percentX - 50) / 50) * 7;

      node.style.setProperty("--profile-x", `${percentX}%`);
      node.style.setProperty("--profile-y", `${percentY}%`);
      node.style.setProperty("--profile-rotate-x", `${rotateX}deg`);
      node.style.setProperty("--profile-rotate-y", `${rotateY}deg`);
      node.style.setProperty("--profile-glow-opacity", "1");
    },
    [enableTilt],
  );

  const resetPointer = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    node.style.setProperty("--profile-x", "50%");
    node.style.setProperty("--profile-y", "50%");
    node.style.setProperty("--profile-rotate-x", "0deg");
    node.style.setProperty("--profile-rotate-y", "0deg");
    node.style.setProperty("--profile-glow-opacity", "0");
  }, []);

  const style = {
    "--profile-gradient": innerGradient,
    "--profile-glow-color": behindGlowColor,
    "--profile-glow-size": behindGlowSize,
  } as CSSProperties;

  return (
    <div
      ref={ref}
      className={[
        "profile-card-wrap",
        behindGlowEnabled ? "" : "without-glow",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={style}
      onPointerEnter={setPointer}
      onPointerMove={setPointer}
      onPointerLeave={resetPointer}
    >
      <section className="profile-card" aria-label={`${name} 身份卡`}>
        {iconUrl && (
          <div className="profile-card-bg" aria-hidden="true">
            <img src={iconUrl} alt="" />
          </div>
        )}

        <div className="profile-card-band" aria-hidden="true">
          <span>IDENTITY</span>
          <i />
        </div>

        <div className="profile-card-heading">
          <span>@{handle}</span>
          <strong>{status}</strong>
        </div>

        <div className="profile-card-avatar">
          <img src={avatarUrl} alt={`${name} 标识`} />
        </div>

        <div className="profile-card-title">
          <h3>{name}</h3>
          <p>{title}</p>
        </div>

        {showUserInfo && (
          <div className="profile-card-info">
            <div className="profile-mini">
              <img src={miniAvatarUrl ?? avatarUrl} alt="" aria-hidden="true" />
              <div>
                <span>SERVER</span>
                <strong>Lazy Alien Server</strong>
              </div>
            </div>
            <button
              type="button"
              className="profile-action"
              onClick={onContactClick}
            >
              {contactText}
            </button>
          </div>
        )}

        <span className="profile-card-label" aria-hidden="true">
          IDENTITY CARD
        </span>
      </section>
    </div>
  );
};

export default ProfileCard;
