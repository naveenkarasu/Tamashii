import { motion } from "framer-motion";
import { Lock, Unlock } from "lucide-react";
import { useBlockerStore } from "../../store/blockerStore";
import { StreakCounter } from "./StreakCounter";
import { DailyQuote } from "./DailyQuote";
import { QuickStats } from "./QuickStats";
import { PanicButton } from "./PanicButton";

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function DashboardPage() {
  const { isLocked, lockExpiresAt, categories } = useBlockerStore();

  const enabledCount = categories.filter((c) => c.isEnabled).length;

  // Format lock expiry for display
  let lockLabel = "";
  if (isLocked && lockExpiresAt) {
    const expires = new Date(lockExpiresAt);
    lockLabel = `Locked until ${expires.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  } else if (isLocked) {
    lockLabel = "Blocker locked";
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto pb-8">
      {/* 1 - Hero streak counter */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0 }}
      >
        <StreakCounter />
      </motion.div>

      {/* 2 - Daily quote */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <DailyQuote />
      </motion.div>

      {/* 3 - Quick stats row */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <QuickStats />
      </motion.div>

      {/* 4 - Panic button */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.24 }}
      >
        <PanicButton />
      </motion.div>

      {/* 5 - Blocker status summary */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.32 }}
        className="flex items-center justify-center gap-2 text-xs text-text-secondary font-mono"
      >
        {isLocked ? (
          <Lock size={12} className="text-success" />
        ) : (
          <Unlock size={12} className="text-warning" />
        )}
        <span>
          {isLocked
            ? `${lockLabel} \u00b7 ${enabledCount} categories active`
            : enabledCount > 0
              ? `${enabledCount} categories enabled \u00b7 not locked`
              : "No blocker categories enabled"}
        </span>
      </motion.div>
    </div>
  );
}
