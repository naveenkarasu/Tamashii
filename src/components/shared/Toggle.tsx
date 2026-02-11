import { motion } from "framer-motion";

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
}

export function Toggle({
  checked,
  onChange,
  disabled = false,
  label,
}: ToggleProps) {
  return (
    <label
      className={[
        "inline-flex items-center gap-3 select-none",
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
      ].join(" ")}
    >
      {label && (
        <span className="text-sm text-text-primary">{label}</span>
      )}

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        disabled={disabled}
        onClick={() => !disabled && onChange(!checked)}
        className={[
          "relative w-[44px] h-[24px] rounded-full",
          "transition-all duration-200",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/50",
          checked
            ? "bg-accent shadow-[0_0_8px_var(--accent-glow)]"
            : "bg-zinc-700 border border-border",
        ].join(" ")}
      >
        <motion.span
          className="absolute top-[3px] left-[3px] w-[18px] h-[18px] rounded-full bg-white"
          animate={{ x: checked ? 20 : 0 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </button>
    </label>
  );
}
