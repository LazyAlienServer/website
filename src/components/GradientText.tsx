import type { CSSProperties, ReactNode } from "react";

type GradientTextProps = {
  children: ReactNode;
  className?: string;
  colors?: string[];
  animationSpeed?: number;
  direction?: "horizontal" | "vertical" | "diagonal";
  showBorder?: boolean;
  as?: "span" | "div";
};

const sizeByDirection = {
  horizontal: "300% 100%",
  vertical: "100% 300%",
  diagonal: "300% 300%",
};

const angleByDirection = {
  horizontal: "90deg",
  vertical: "180deg",
  diagonal: "135deg",
};

const GradientText = ({
  children,
  className = "",
  colors = ["#f7f9ff", "#5d9bff", "#0d6bff", "#f7f9ff"],
  animationSpeed = 5,
  direction = "horizontal",
  showBorder = false,
  as: Component = "span",
}: GradientTextProps) => {
  const resolvedColors = colors.length
    ? colors
    : ["#f7f9ff", "#5d9bff", "#0d6bff"];
  const style = {
    "--gradient-text-colors": [...resolvedColors, resolvedColors[0]].join(", "),
    "--gradient-text-speed": `${animationSpeed}s`,
    "--gradient-text-angle": angleByDirection[direction],
    "--gradient-text-size": sizeByDirection[direction],
  } as CSSProperties;

  return (
    <Component
      className={["gradient-text", showBorder ? "is-bordered" : "", className]
        .filter(Boolean)
        .join(" ")}
      style={style}
    >
      <span className="gradient-text-inner">{children}</span>
    </Component>
  );
};

export default GradientText;
