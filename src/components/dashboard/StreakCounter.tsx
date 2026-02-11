import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Flame, Play } from "lucide-react";
import { useStreakStore } from "../../store/streakStore";
import { useAppStore } from "../../store/appStore";
import { Card } from "../shared/Card";

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function StreakCounter() {
  const { currentStreakStart, isRunning, getStreakDuration, startStreak } =
    useStreakStore();
  const theme = useAppStore((s) => s.theme);

  const [duration, setDuration] = useState(getStreakDuration());

  useEffect(() => {
    if (!isRunning) return;

    // Immediately sync on mount / when streak starts
    setDuration(getStreakDuration());

    const id = setInterval(() => {
      setDuration(getStreakDuration());
    }, 1000);

    return () => clearInterval(id);
  }, [isRunning, currentStreakStart, getStreakDuration]);

  const isAnime = theme === "anime";
  const numberClass = isAnime ? "gradient-text-anime" : "text-accent";

  return (
    <Card
      className="relative overflow-hidden text-center py-8 px-6"
      hoverable={false}
    >
      {/* Subtle accent glow border effect */}
      <div
        className="pointer-events-none absolute inset-0 rounded-md"
        style={{
          boxShadow: "inset 0 0 30px var(--accent-glow)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Flame icon */}
        <Flame
          size={24}
          className="text-accent"
          style={{ filter: "drop-shadow(0 0 6px var(--accent))" }}
        />

        {/* Big timer numbers */}
        <div
          className={`font-mono font-bold text-5xl tracking-tight ${numberClass}`}
        >
          <span>{pad(duration.days)}</span>
          <span className="text-text-secondary mx-1">:</span>
          <span>{pad(duration.hours)}</span>
          <span className="text-text-secondary mx-1">:</span>
          <span>{pad(duration.minutes)}</span>
          <span className="text-text-secondary mx-1">:</span>
          <span>{pad(duration.seconds)}</span>
        </div>

        {/* Labels */}
        <div className="font-sans text-xs text-text-secondary tracking-widest select-none">
          <span className="inline-block w-14">days</span>
          <span className="inline-block w-14">hrs</span>
          <span className="inline-block w-14">min</span>
          <span className="inline-block w-14">sec</span>
        </div>

        {/* Streak label / start button */}
        {isRunning ? (
          <p className="font-display text-xs uppercase tracking-wider text-text-secondary mt-1">
            Current Focus Streak
          </p>
        ) : (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            onClick={startStreak}
            className="mt-2 flex items-center gap-2 rounded-md bg-accent/10 border border-accent/30 px-5 py-2 font-display text-xs uppercase tracking-wider text-accent transition-colors hover:bg-accent/20 cursor-pointer"
          >
            <Play size={14} />
            Start Your Journey
          </motion.button>
        )}
      </div>
    </Card>
  );
}
