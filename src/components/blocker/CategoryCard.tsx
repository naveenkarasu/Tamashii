import type { BlockCategory } from "../../types";
import { Toggle } from "../shared/Toggle";

interface CategoryCardProps {
  category: BlockCategory;
  onToggle: (id: string) => void;
  isLocked: boolean;
}

export function CategoryCard({ category, onToggle, isLocked }: CategoryCardProps) {
  return (
    <div
      className={[
        "flex items-center justify-between h-14 px-4",
        "bg-bg-card border border-border rounded-md",
        "transition-colors duration-200",
        !isLocked && "hover:bg-bg-card-hover",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Left: status dot + name */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className={[
            "w-2 h-2 rounded-full shrink-0",
            category.isEnabled
              ? "bg-success shadow-[0_0_6px_var(--success)]"
              : "bg-zinc-600",
          ].join(" ")}
        />
        <span className="font-sans text-sm text-text-primary truncate">
          {category.name}
        </span>
      </div>

      {/* Center: domain count */}
      <span className="font-mono text-sm text-text-secondary px-4 shrink-0">
        {category.domainCount} domains
      </span>

      {/* Right: locked badge or toggle */}
      <div className="shrink-0">
        {isLocked ? (
          <span className="font-display text-xs uppercase tracking-wider text-danger">
            LOCKED
          </span>
        ) : (
          <Toggle
            checked={category.isEnabled}
            onChange={() => onToggle(category.id)}
          />
        )}
      </div>
    </div>
  );
}
