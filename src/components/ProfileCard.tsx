import {
  useCallback,
  useEffect,
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

type DeviceOrientationPermissionEvent = DeviceOrientationEventConstructor & {
  requestPermission?: () => Promise<PermissionState>;
};

const clamp = (value: number, min: number, max: number) =>
  Math.min(Math.max(value, min), max);

const applyDeadZone = (value: number, threshold: number) =>
  Math.abs(value) < threshold ? 0 : value;

const resetTilt = (node: HTMLElement) => {
  node.style.setProperty("--profile-x", "50%");
  node.style.setProperty("--profile-y", "50%");
  node.style.setProperty("--profile-rotate-x", "0deg");
  node.style.setProperty("--profile-rotate-y", "0deg");
  node.style.setProperty("--profile-glow-opacity", "0");
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
  const orientationEnabledRef = useRef(false);
  const orientationPermissionRequestedRef = useRef(false);

  useEffect(() => {
    if (!enableTilt) return;

    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = window.matchMedia("(hover: none), (pointer: coarse)");
    if (reduceMotionQuery.matches || !mobileQuery.matches) return;

    let frame = 0;
    let baselineBeta: number | null = null;
    let baselineGamma: number | null = null;
    let targetBeta = 0;
    let targetGamma = 0;
    let smoothBeta = 0;
    let smoothGamma = 0;

    const writeOrientationTilt = () => {
      frame = 0;

      const node = ref.current;
      if (!node) return;

      smoothBeta += (targetBeta - smoothBeta) * 0.22;
      smoothGamma += (targetGamma - smoothGamma) * 0.22;

      const beta = applyDeadZone(smoothBeta, 1.25);
      const gamma = applyDeadZone(smoothGamma, 1.25);
      const normalizedBeta = clamp(beta / 18, -1, 1);
      const normalizedGamma = clamp(gamma / 14, -1, 1);
      const rotateX = normalizedBeta * -5.5;
      const rotateY = normalizedGamma * 5.5;
      const percentX = clamp(50 + normalizedGamma * 28, 22, 78);
      const percentY = clamp(50 + normalizedBeta * 24, 24, 76);

      node.style.setProperty("--profile-x", `${percentX}%`);
      node.style.setProperty("--profile-y", `${percentY}%`);
      node.style.setProperty("--profile-rotate-x", `${rotateX}deg`);
      node.style.setProperty("--profile-rotate-y", `${rotateY}deg`);
      node.style.setProperty("--profile-glow-opacity", beta === 0 && gamma === 0 ? "0" : "1");

      if (Math.abs(targetBeta - smoothBeta) > 0.1 || Math.abs(targetGamma - smoothGamma) > 0.1) {
        frame = window.requestAnimationFrame(writeOrientationTilt);
      }
    };

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (event.beta === null || event.gamma === null) return;

      if (baselineBeta === null || baselineGamma === null) {
        baselineBeta = event.beta;
        baselineGamma = event.gamma;
        targetBeta = 0;
        targetGamma = 0;
        smoothBeta = 0;
        smoothGamma = 0;
      } else {
        targetBeta = clamp(event.beta - baselineBeta, -24, 24);
        targetGamma = clamp(event.gamma - baselineGamma, -18, 18);
      }

      if (!frame) frame = window.requestAnimationFrame(writeOrientationTilt);
    };

    const startOrientation = () => {
      if (orientationEnabledRef.current) return;
      orientationEnabledRef.current = true;
      window.addEventListener("deviceorientation", handleOrientation, true);
    };

    const requestOrientationPermission = () => {
      if (orientationPermissionRequestedRef.current) return;
      orientationPermissionRequestedRef.current = true;

      const orientationEvent = window.DeviceOrientationEvent as
        | DeviceOrientationPermissionEvent
        | undefined;
      if (!orientationEvent?.requestPermission) {
        startOrientation();
        return;
      }

      void orientationEvent
        .requestPermission()
        .then((state) => {
          if (state === "granted") startOrientation();
        })
        .catch(() => {
          orientationPermissionRequestedRef.current = false;
        });
    };

    const orientationEvent = window.DeviceOrientationEvent as
      | DeviceOrientationPermissionEvent
      | undefined;
    if (!orientationEvent?.requestPermission) {
      startOrientation();
    } else {
      window.addEventListener("touchend", requestOrientationPermission, {
        once: true,
        passive: true,
      });
      window.addEventListener("click", requestOrientationPermission, {
        once: true,
        passive: true,
      });
    }

    return () => {
      orientationEnabledRef.current = false;
      window.removeEventListener("deviceorientation", handleOrientation, true);
      if (frame) window.cancelAnimationFrame(frame);
      window.removeEventListener("touchend", requestOrientationPermission);
      window.removeEventListener("click", requestOrientationPermission);

      const node = ref.current;
      if (node) resetTilt(node);
    };
  }, [enableTilt]);

  const setPointer = useCallback(
    (event: PointerEvent<HTMLDivElement>) => {
      if (!enableTilt) return;
      if (orientationEnabledRef.current) return;

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
    if (orientationEnabledRef.current) return;

    const node = ref.current;
    if (!node) return;

    resetTilt(node);
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
