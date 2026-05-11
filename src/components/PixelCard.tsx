import {
  useCallback,
  useEffect,
  useRef,
  type FocusEvent,
  type ReactNode,
} from "react";

class Pixel {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly x: number;
  private readonly y: number;
  private readonly color: string;
  private readonly speed: number;
  private readonly sizeStep: number;
  private readonly minSize = 0.5;
  private readonly maxSizeInteger = 2;
  private readonly maxSize: number;
  private readonly delay: number;
  private counter = 0;
  private readonly counterStep: number;
  private isReverse = false;
  private isShimmer = false;
  public isIdle = true;
  public size = 0;

  constructor(
    canvas: HTMLCanvasElement,
    context: CanvasRenderingContext2D,
    x: number,
    y: number,
    color: string,
    speed: number,
    delay: number,
  ) {
    this.ctx = context;
    this.x = x;
    this.y = y;
    this.color = color;
    this.speed = this.getRandomValue(0.1, 0.9) * speed;
    this.sizeStep = Math.random() * 0.4;
    this.maxSize = this.getRandomValue(this.minSize, this.maxSizeInteger);
    this.delay = delay;
    this.counterStep =
      Math.random() * 4 + (canvas.width + canvas.height) * 0.01;
  }

  private getRandomValue(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  private draw() {
    const centerOffset = this.maxSizeInteger * 0.5 - this.size * 0.5;
    this.ctx.fillStyle = this.color;
    this.ctx.fillRect(
      this.x + centerOffset,
      this.y + centerOffset,
      this.size,
      this.size,
    );
  }

  public appear() {
    this.isIdle = false;

    if (this.counter <= this.delay) {
      this.counter += this.counterStep;
      return;
    }

    if (this.size >= this.maxSize) {
      this.isShimmer = true;
    }

    if (this.isShimmer) {
      this.shimmer();
    } else {
      this.size += this.sizeStep;
    }

    this.draw();
  }

  public disappear() {
    this.isShimmer = false;
    this.counter = 0;

    if (this.size <= 0) {
      this.isIdle = true;
      return;
    }

    this.size -= 0.1;
    this.draw();
  }

  private shimmer() {
    if (this.size >= this.maxSize) {
      this.isReverse = true;
    } else if (this.size <= this.minSize) {
      this.isReverse = false;
    }

    this.size += this.isReverse ? -this.speed : this.speed;
  }
}

type PixelCardProps = {
  children: ReactNode;
  className?: string;
  gap?: number;
  speed?: number;
  colors?: string;
  noFocus?: boolean;
};

type AnimationName = "appear" | "disappear";

const getEffectiveSpeed = (value: number, reducedMotion: boolean) => {
  if (reducedMotion || value <= 0) return 0;
  return Math.min(value, 100) * 0.001;
};

const PixelCard = ({
  children,
  className = "",
  gap = 10,
  speed = 24,
  colors = "#f7f9ff,#5d9bff,#0d6bff",
  noFocus = false,
}: PixelCardProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pixelsRef = useRef<Pixel[]>([]);
  const animationRef = useRef<ReturnType<typeof requestAnimationFrame> | null>(
    null,
  );
  const previousTimeRef = useRef(0);
  const reducedMotionRef = useRef(false);

  const initPixels = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const width = Math.floor(rect.width);
    const height = Math.floor(rect.height);
    const ctx = canvas.getContext("2d");
    if (!ctx || width <= 0 || height <= 0) return;

    canvas.width = width;
    canvas.height = height;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const palette = colors
      .split(",")
      .map((color) => color.trim())
      .filter(Boolean);
    const resolvedColors = palette.length ? palette : ["#f7f9ff"];
    const pixels: Pixel[] = [];
    const resolvedGap = Math.max(3, Math.floor(gap));
    const resolvedSpeed = getEffectiveSpeed(speed, reducedMotionRef.current);

    for (let x = 0; x < width; x += resolvedGap) {
      for (let y = 0; y < height; y += resolvedGap) {
        const color =
          resolvedColors[Math.floor(Math.random() * resolvedColors.length)];
        const dx = x - width / 2;
        const dy = y - height / 2;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const delay = reducedMotionRef.current ? 0 : distance;

        pixels.push(new Pixel(canvas, ctx, x, y, color, resolvedSpeed, delay));
      }
    }

    pixelsRef.current = pixels;
  }, [colors, gap, speed]);

  const animate = useCallback((name: AnimationName) => {
    animationRef.current = requestAnimationFrame(() => animate(name));

    const now = performance.now();
    const elapsed = now - previousTimeRef.current;
    const frame = 1000 / 60;
    if (elapsed < frame) return;

    previousTimeRef.current = now - (elapsed % frame);

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let allIdle = true;
    for (const pixel of pixelsRef.current) {
      pixel[name]();
      if (!pixel.isIdle) allIdle = false;
    }

    if (allIdle && animationRef.current !== null) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }
  }, []);

  const handleAnimation = useCallback(
    (name: AnimationName) => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
      previousTimeRef.current = performance.now();
      animationRef.current = requestAnimationFrame(() => animate(name));
    },
    [animate],
  );

  useEffect(() => {
    reducedMotionRef.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    initPixels();

    const observer = new ResizeObserver(initPixels);
    const container = containerRef.current;
    if (container) observer.observe(container);

    return () => {
      observer.disconnect();
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [initPixels]);

  const handleFocus = (event: FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    ) {
      return;
    }
    handleAnimation("appear");
  };

  const handleBlur = (event: FocusEvent<HTMLDivElement>) => {
    const relatedTarget = event.relatedTarget;
    if (
      relatedTarget instanceof Node &&
      event.currentTarget.contains(relatedTarget)
    ) {
      return;
    }
    handleAnimation("disappear");
  };

  return (
    <div
      ref={containerRef}
      className={["pixel-card", className].filter(Boolean).join(" ")}
      onMouseEnter={() => handleAnimation("appear")}
      onMouseLeave={() => handleAnimation("disappear")}
      onFocus={noFocus ? undefined : handleFocus}
      onBlur={noFocus ? undefined : handleBlur}
      tabIndex={noFocus ? -1 : 0}
    >
      <canvas className="pixel-card-canvas" ref={canvasRef} />
      <div className="pixel-card-content">{children}</div>
    </div>
  );
};

export default PixelCard;
