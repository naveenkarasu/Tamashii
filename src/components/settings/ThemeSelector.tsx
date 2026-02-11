import { Moon, Sun, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import type { Theme } from "../../types";
import { useAppStore } from "../../store/appStore";
import { applyTheme } from "../../lib/theme";

interface ThemeOption {
  id: Theme;
  label: string;
  icon: typeof Moon;
  previewBg: string;
  previewIconColor: string;
}

const themes: ThemeOption[] = [
  {
    id: "dark",
    label: "Dark",
    icon: Moon,
    previewBg: "bg-zinc-900",
    previewIconColor: "text-cyan-400",
  },
  {
    id: "light",
    label: "Light",
    icon: Sun,
    previewBg: "bg-zinc-100",
    previewIconColor: "text-amber-500",
  },
  {
    id: "anime",
    label: "Anime",
    icon: Sparkles,
    previewBg: "bg-purple-950",
    previewIconColor: "text-pink-400",
  },
];

export function ThemeSelector() {
  const currentTheme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  function handleSelect(theme: Theme) {
    setTheme(theme);
    applyTheme(theme);
    localStorage.setItem("tamashii-theme", theme);
  }

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xs uppercase tracking-wider text-text-secondary">
        Appearance
      </h2>

      <div className="grid grid-cols-3 gap-4">
        {themes.map(({ id, label, icon: Icon, previewBg, previewIconColor }) => {
          const isSelected = currentTheme === id;

          return (
            <motion.button
              key={id}
              onClick={() => handleSelect(id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={[
                "h-[100px] flex flex-col items-center justify-center gap-2 rounded-md",
                "transition-all duration-200 cursor-pointer",
                previewBg,
                isSelected
                  ? "border-2 border-accent shadow-[0_0_12px_var(--accent-glow)]"
                  : "border border-border",
              ].join(" ")}
            >
              <Icon size={24} className={previewIconColor} />
              <span className="font-sans text-sm text-text-primary">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
