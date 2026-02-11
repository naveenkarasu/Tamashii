import { motion } from "framer-motion";
import { useMemo } from "react";

interface StreakRecord {
  startDate: string;
  endDate: string;
  days: number;
  isCurrent: boolean;
}

/** Generate 5-8 mock streak records. */
function generateMockStreaks(): StreakRecord[] {
  const streaks: StreakRecord[] = [];
  const today = new Date();
  let cursor = new Date(today);
  cursor.setDate(cursor.getDate() - 5);

  const lengths = [14, 3, 21, 7, 45, 2, 10];
  const count = 5 + Math.floor(Math.random() * 3); // 5-7

  for (let i = 0; i < count && i < lengths.length; i++) {
    const days = lengths[i];
    const end = new Date(cursor);
    const start = new Date(cursor);
    start.setDate(start.getDate() - days + 1);

    streaks.push({
      startDate: formatShortDate(start),
      endDate: formatShortDate(end),
      days,
      isCurrent: i === 0,
    });

    // Gap between streaks
    cursor.setDate(cursor.getDate() - days - Math.floor(Math.random() * 5 + 1));
  }

  return streaks;
}

function formatShortDate(d: Date): string {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  return `${months[d.getMonth()]} ${d.getDate()}`;
}

export function StreakHistory() {
  const streaks = useMemo(() => generateMockStreaks(), []);
  const maxDays = useMemo(
    () => Math.max(...streaks.map((s) => s.days)),
    [streaks],
  );

  return (
    <div>
      <h3 className="font-display text-xs uppercase tracking-wider text-accent mb-4">
        Streak History
      </h3>

      <div className="flex flex-col gap-3">
        {streaks.map((streak, idx) => {
          const widthPct = Math.max(8, (streak.days / maxDays) * 100);

          return (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.06 }}
              className="flex items-center gap-3"
            >
              {/* Date range */}
              <span className="font-mono text-xs text-text-secondary w-32 shrink-0 text-right">
                {streak.startDate} – {streak.endDate}
              </span>

              {/* Bar */}
              <div className="flex-1 min-w-0">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${widthPct}%` }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.06 + 0.15,
                    ease: "easeOut",
                  }}
                  className={[
                    "h-6 rounded-sm",
                    streak.isCurrent
                      ? "bg-accent shadow-[0_0_12px_var(--accent-glow)]"
                      : "bg-accent/60",
                  ].join(" ")}
                />
              </div>

              {/* Days count */}
              <span
                className={[
                  "font-mono text-sm w-12 shrink-0 text-right",
                  streak.isCurrent ? "text-accent font-bold" : "text-accent",
                ].join(" ")}
              >
                {streak.days}d
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
