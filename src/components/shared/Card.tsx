import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export function Card({
  children,
  className = "",
  hoverable = false,
  onClick,
}: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        // Base
        "bg-bg-card border border-border rounded-md p-4",
        // Hoverable
        hoverable &&
          "transition-all duration-200 hover:bg-bg-card-hover hover:shadow-[0_0_20px_var(--accent-glow)] cursor-pointer",
        // Anime mode gradient border
        "card-anime-border",
        // Clickable without hoverable still gets pointer
        onClick && !hoverable ? "cursor-pointer" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </div>
  );
}
