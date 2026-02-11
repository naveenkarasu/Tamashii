import { useEffect } from "react";
import { motion } from "framer-motion";
import { useAchievementStore } from "../../store/achievementStore";
import { achievements as achievementDefinitions } from "../../lib/achievements";
import { AchievementCard } from "./AchievementCard";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export function AchievementsPage() {
  const achievements = useAchievementStore((s) => s.achievements);
  const loadAchievements = useAchievementStore((s) => s.loadAchievements);

  useEffect(() => {
    if (achievements.length === 0) {
      loadAchievements(achievementDefinitions);
    }
  }, [achievements.length, loadAchievements]);

  const unlockedCount = achievements.filter((a) => a.unlockedAt !== null).length;
  const totalCount = achievements.length;

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="font-display uppercase text-2xl text-accent tracking-wider">
          Achievements
        </h1>
        <span className="font-mono text-sm text-text-secondary">
          {unlockedCount} / {totalCount} Unlocked
        </span>
      </div>

      {/* Achievement grid */}
      <motion.div
        className="grid grid-cols-3 gap-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {achievements.map((achievement) => (
          <motion.div key={achievement.id} variants={itemVariants}>
            <AchievementCard achievement={achievement} />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
