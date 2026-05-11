import {
  useCallback,
  useRef,
  type CSSProperties,
  type PointerEvent,
  type ReactNode,
} from "react";

type SpotlightCardProps = {
  children: ReactNode;
  className?: string;
  spotlightColor?: string;
  as?: "div" | "article" | "section" | "figure";
  style?: CSSProperties;
};

const SpotlightCard = ({
  children,
  className = "",
  spotlightColor = "rgba(93, 155, 255, 0.28)",
  as: Component = "div",
  style,
}: SpotlightCardProps) => {
  const ref = useRef<HTMLElement | null>(null);

  const setPosition = useCallback((event: PointerEvent<HTMLElement>) => {
    const node = ref.current;
    if (!node) return;

    const rect = node.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;

    node.style.setProperty("--spotlight-x", `${x}%`);
    node.style.setProperty("--spotlight-y", `${y}%`);
    node.style.setProperty("--spotlight-opacity", "1");
  }, []);

  const clearPosition = useCallback(() => {
    const node = ref.current;
    if (!node) return;

    node.style.setProperty("--spotlight-opacity", "0");
    node.style.setProperty("--spotlight-x", "50%");
    node.style.setProperty("--spotlight-y", "50%");
  }, []);

  const mergedStyle = {
    "--spotlight-color": spotlightColor,
    ...style,
  } as CSSProperties;

  return (
    <Component
      ref={ref}
      className={["spotlight-card", className].filter(Boolean).join(" ")}
      style={mergedStyle}
      onPointerEnter={setPosition}
      onPointerMove={setPosition}
      onPointerLeave={clearPosition}
    >
      {children}
    </Component>
  );
};

export default SpotlightCard;
