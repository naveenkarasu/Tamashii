import { motion } from "framer-motion";
import { CalendarHeatmap } from "./CalendarHeatmap";
import { StreakHistory } from "./StreakHistory";
import { WeeklySummary } from "./WeeklySummary";
import { Card } from "../shared/Card";

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function StatsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-xl mx-auto pb-8">
      {/* Header */}
      <motion.h1
        className="font-display text-lg uppercase tracking-wider text-accent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Statistics
      </motion.h1>

      {/* Calendar Heatmap */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0 }}
      >
        <Card>
          <CalendarHeatmap />
        </Card>
      </motion.div>

      {/* Streak History */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.08 }}
      >
        <Card>
          <StreakHistory />
        </Card>
      </motion.div>

      {/* Weekly Summary */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <Card>
          <WeeklySummary />
        </Card>
      </motion.div>
    </div>
  );
}
