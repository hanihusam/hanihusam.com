import { clsxm } from "@/utils/clsxm";

interface ConcentricCirclesProps {
  /** Rendered width/height in px. */
  size?: number;
  /** Distance between rings in px. */
  ringGap?: number;
  /** Render a brand-colored dot at the center. */
  accent?: boolean;
  className?: string;
}

const ACCENT_RADIUS = 12;

/** Decorative concentric rings with an optional center dot, as inline SVG. */
export function ConcentricCircles({
  size = 485,
  ringGap = 60,
  accent = false,
  className,
}: ConcentricCirclesProps) {
  const center = size / 2;
  const ringCount = Math.floor(center / ringGap);
  const radii = Array.from({ length: ringCount }, (_, i) => (i + 1) * ringGap);

  return (
    <svg
      aria-hidden
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      fill="none"
      className={className}
    >
      {radii.map((r) => (
        <circle
          key={r}
          cx={center}
          cy={center}
          r={r}
          stroke="var(--border-primary)"
          strokeWidth={1}
        />
      ))}

      <circle
        cx={center}
        cy={center}
        r={ACCENT_RADIUS}
        fill={clsxm(
          accent ? "var(--color-sunset-400)" : "var(--color-sky-500)",
        )}
      />
    </svg>
  );
}
