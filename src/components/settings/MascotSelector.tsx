import { motion } from "framer-motion";
import { Cat, User } from "lucide-react";
import type { MascotGender } from "../../types";
import { useAppStore } from "../../store/appStore";

interface MascotOption {
  id: MascotGender;
  label: string;
  icon: typeof Cat;
  accentColor: string;
  glowColor: string;
  borderColor: string;
}

const mascots: MascotOption[] = [
  {
    id: "girl",
    label: "Girl",
    icon: Cat,
    accentColor: "text-pink-400",
    glowColor: "shadow-[0_0_12px_rgba(244,114,182,0.5)]",
    borderColor: "border-pink-400",
  },
  {
    id: "boy",
    label: "Boy",
    icon: User,
    accentColor: "text-blue-400",
    glowColor: "shadow-[0_0_12px_rgba(96,165,250,0.5)]",
    borderColor: "border-blue-400",
  },
];

export function MascotSelector() {
  const theme = useAppStore((s) => s.theme);
  const currentGender = useAppStore((s) => s.mascotGender);
  const setMascotGender = useAppStore((s) => s.setMascotGender);

  if (theme !== "anime") return null;

  return (
    <section className="flex flex-col gap-3">
      <h2 className="font-display text-xs uppercase tracking-wider text-text-secondary">
        Mascot
      </h2>

      <div className="grid grid-cols-2 gap-4">
        {mascots.map(({ id, label, icon: Icon, accentColor, glowColor, borderColor }) => {
          const isSelected = currentGender === id;

          return (
            <motion.button
              key={id}
              onClick={() => setMascotGender(id)}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className={[
                "h-[100px] flex flex-col items-center justify-center gap-2 rounded-md",
                "bg-bg-card transition-all duration-200 cursor-pointer",
                isSelected
                  ? `border-2 ${borderColor} ${glowColor}`
                  : "border border-border",
              ].join(" ")}
            >
              <Icon size={28} className={accentColor} />
              <span className="font-sans text-sm text-text-primary">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </section>
  );
}
