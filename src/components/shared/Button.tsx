import type { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
  size?: "sm" | "md" | "lg";
  fullWidth?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
}

const variantStyles: Record<string, string> = {
  primary: [
    "bg-accent text-bg-primary font-display uppercase text-xs tracking-wider",
    "shadow-[0_0_12px_var(--accent-glow)]",
    "hover:shadow-[0_0_24px_var(--accent-glow)] hover:scale-[1.02]",
  ].join(" "),
  secondary: [
    "bg-bg-card border border-border text-text-primary",
    "hover:bg-bg-card-hover hover:scale-[1.02]",
  ].join(" "),
  danger: [
    "bg-danger text-white",
    "shadow-[0_0_12px_var(--danger-glow)]",
    "hover:shadow-[0_0_24px_var(--danger-glow)] hover:scale-[1.02]",
  ].join(" "),
  ghost: [
    "bg-transparent text-text-secondary",
    "hover:text-text-primary hover:bg-bg-card",
  ].join(" "),
};

const sizeStyles: Record<string, string> = {
  sm: "h-8 px-3 text-xs",
  md: "h-10 px-4 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  onClick,
  className = "",
  icon,
  ...rest
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        // Base layout
        "inline-flex items-center justify-center gap-2 rounded-md",
        "transition-all duration-200 select-none",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
        // Variant
        variantStyles[variant],
        // Size
        sizeStyles[size],
        // Full width
        fullWidth ? "w-full" : "",
        // Disabled
        disabled ? "opacity-50 cursor-not-allowed pointer-events-none" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
