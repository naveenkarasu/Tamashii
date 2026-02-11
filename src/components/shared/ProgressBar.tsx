interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  color?: "accent" | "success" | "danger" | "warning";
  size?: "sm" | "md";
  showLabel?: boolean;
  label?: string;
}

const colorMap: Record<string, { bar: string; glow: string }> = {
  accent: {
    bar: "bg-accent",
    glow: "shadow-[0_0_10px_var(--accent-glow)]",
  },
  success: {
    bar: "bg-success",
    glow: "shadow-[0_0_10px_var(--success-glow)]",
  },
  danger: {
    bar: "bg-danger",
    glow: "shadow-[0_0_10px_var(--danger-glow)]",
  },
  warning: {
    bar: "bg-warning",
    glow: "shadow-[0_0_10px_rgba(251,191,36,0.25)]",
  },
};

const sizeMap: Record<string, string> = {
  sm: "h-1",
  md: "h-2",
};

export function ProgressBar({
  value,
  max = 100,
  color = "accent",
  size = "md",
  showLabel = false,
  label,
}: ProgressBarProps) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const { bar, glow } = colorMap[color];

  return (
    <div className="w-full">
      {/* Label row */}
      {(showLabel || label) && (
        <div className="flex items-center justify-between mb-1.5">
          {label && (
            <span className="text-xs font-mono text-text-secondary">
              {label}
            </span>
          )}
          {showLabel && (
            <span className="text-xs font-mono text-text-secondary ml-auto">
              {Math.round(pct)}%
            </span>
          )}
        </div>
      )}

      {/* Track */}
      <div className="w-full rounded-full bg-border overflow-hidden">
        <div
          className={[
            "rounded-full transition-all duration-500 ease-out",
            sizeMap[size],
            bar,
            glow,
          ].join(" ")}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
    </div>
  );
}
