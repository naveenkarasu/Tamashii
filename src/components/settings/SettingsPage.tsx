import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { useStreakStore } from "../../store/streakStore";
import { useAchievementStore } from "../../store/achievementStore";
import { useAppStore } from "../../store/appStore";
import { Button } from "../shared/Button";
import { ThemeSelector } from "./ThemeSelector";
import { MascotSelector } from "./MascotSelector";
import { NotificationSettings } from "./NotificationSettings";

const sectionVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.35 },
  }),
};

export function SettingsPage() {
  const theme = useAppStore((s) => s.theme);
  const resetStreak = useStreakStore((s) => s.resetStreak);
  const loadAchievements = useAchievementStore((s) => s.loadAchievements);

  // Inline confirmation state
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);
  const [resetInput, setResetInput] = useState("");
  const [clearConfirmOpen, setClearConfirmOpen] = useState(false);
  const [clearInput, setClearInput] = useState("");

  function handleResetStreak() {
    if (resetInput === "CONFIRM") {
      resetStreak();
      setResetConfirmOpen(false);
      setResetInput("");
    }
  }

  function handleClearAllData() {
    if (clearInput === "CONFIRM") {
      // Reset all stores to defaults
      resetStreak();
      loadAchievements([]);
      localStorage.clear();
      setClearConfirmOpen(false);
      setClearInput("");
    }
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <motion.h1
        className="font-display uppercase text-2xl text-accent tracking-wider"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Settings
      </motion.h1>

      {/* Theme selector */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={0}
      >
        <ThemeSelector />
      </motion.div>

      {/* Mascot selector (anime only) */}
      {theme === "anime" && (
        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          custom={1}
        >
          <MascotSelector />
        </motion.div>
      )}

      {/* Notifications */}
      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={2}
      >
        <NotificationSettings />
      </motion.div>

      {/* Danger zone */}
      <motion.section
        className="flex flex-col gap-4 mt-4 pt-6 border-t border-border"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        custom={3}
      >
        <h2 className="font-display text-xs uppercase tracking-wider text-danger flex items-center gap-2">
          <AlertTriangle size={14} />
          Danger Zone
        </h2>

        {/* Reset Streak */}
        <div className="flex flex-col gap-2">
          {!resetConfirmOpen ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setResetConfirmOpen(true)}
              className="self-start"
            >
              Reset Streak
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder='Type "CONFIRM" to reset'
                value={resetInput}
                onChange={(e) => setResetInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleResetStreak()}
                className={[
                  "bg-bg-card border border-danger/50 rounded-md px-3 py-1.5",
                  "font-mono text-sm text-text-primary placeholder:text-text-secondary/50",
                  "focus:outline-none focus:ring-2 focus:ring-danger/50",
                  "w-56",
                ].join(" ")}
                autoFocus
              />
              <Button
                variant="danger"
                size="sm"
                onClick={handleResetStreak}
                disabled={resetInput !== "CONFIRM"}
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setResetConfirmOpen(false);
                  setResetInput("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>

        {/* Clear All Data */}
        <div className="flex flex-col gap-2">
          {!clearConfirmOpen ? (
            <Button
              variant="danger"
              size="sm"
              onClick={() => setClearConfirmOpen(true)}
              className="self-start"
            >
              Clear All Data
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder='Type "CONFIRM" to clear all data'
                value={clearInput}
                onChange={(e) => setClearInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleClearAllData()}
                className={[
                  "bg-bg-card border border-danger/50 rounded-md px-3 py-1.5",
                  "font-mono text-sm text-text-primary placeholder:text-text-secondary/50",
                  "focus:outline-none focus:ring-2 focus:ring-danger/50",
                  "w-64",
                ].join(" ")}
                autoFocus
              />
              <Button
                variant="danger"
                size="sm"
                onClick={handleClearAllData}
                disabled={clearInput !== "CONFIRM"}
              >
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setClearConfirmOpen(false);
                  setClearInput("");
                }}
              >
                Cancel
              </Button>
            </div>
          )}
        </div>
      </motion.section>
    </div>
  );
}
