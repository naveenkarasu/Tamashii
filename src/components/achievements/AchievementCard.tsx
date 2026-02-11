import { motion } from "framer-motion";
import {
  Footprints,
  Flame,
  Sword,
  Shield,
  Crown,
  Lock,
  BookOpen,
  Heart,
  Star,
  Trophy,
  Zap,
  Target,
  Sun,
  Moon,
  RefreshCw,
  Mountain,
  Gem,
  ShieldCheck,
  Castle,
  Timer,
  ShieldAlert,
  NotebookPen,
  ScrollText,
  PencilLine,
  Feather,
  Siren,
  Waves,
  CloudSun,
  Sunrise,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Achievement } from "../../types";
import { Card } from "../shared/Card";
import { ProgressBar } from "../shared/ProgressBar";

interface AchievementCardProps {
  achievement: Achievement;
}

const iconMap: Record<string, LucideIcon> = {
  footprints: Footprints,
  flame: Flame,
  sword: Sword,
  shield: Shield,
  crown: Crown,
  lock: Lock,
  "book-open": BookOpen,
  heart: Heart,
  star: Star,
  trophy: Trophy,
  zap: Zap,
  target: Target,
  sun: Sun,
  moon: Moon,
  "refresh-cw": RefreshCw,
  mountain: Mountain,
  gem: Gem,
  "shield-check": ShieldCheck,
  castle: Castle,
  timer: Timer,
  "shield-alert": ShieldAlert,
  "notebook-pen": NotebookPen,
  "scroll-text": ScrollText,
  "pencil-line": PencilLine,
  feather: Feather,
  siren: Siren,
  waves: Waves,
  "cloud-sun": CloudSun,
  sunrise: Sunrise,
  "rotate-ccw": RotateCcw,
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function AchievementCard({ achievement }: AchievementCardProps) {
  const isUnlocked = achievement.unlockedAt !== null;
  const IconComponent = iconMap[achievement.icon] ?? HelpCircle;

  if (isUnlocked) {
    return (
      <motion.div whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 400, damping: 20 }}>
        <Card
          className="flex flex-col items-center text-center gap-2 py-5 !border-accent shadow-[0_0_12px_var(--accent-glow)]"
        >
          <IconComponent size={28} className="text-accent" />
          <span className="font-sans font-semibold text-sm text-text-primary">
            {achievement.name}
          </span>
          <span className="font-sans text-xs text-text-secondary leading-tight">
            {achievement.description}
          </span>
          <span className="font-mono text-[10px] text-accent mt-1">
            Unlocked: {formatDate(achievement.unlockedAt!)}
          </span>
        </Card>
      </motion.div>
    );
  }

  return (
    <Card className="flex flex-col items-center text-center gap-2 py-5 grayscale opacity-50">
      <IconComponent size={28} className="text-text-secondary" />
      <span className="font-sans font-semibold text-sm text-text-primary">
        {achievement.name}
      </span>
      <span className="font-sans text-xs text-text-secondary leading-tight">
        {achievement.description}
      </span>
      <div className="w-full mt-1 px-2">
        <ProgressBar
          value={achievement.progress}
          max={achievement.requirement}
          size="sm"
          color="accent"
        />
      </div>
      <span className="font-mono text-xs text-text-secondary">
        {achievement.progress}/{achievement.requirement}
      </span>
    </Card>
  );
}
