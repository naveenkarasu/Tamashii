import { motion } from "framer-motion";
import { ProgressBar } from "../shared/ProgressBar";

interface WeekMetric {
  label: string;
  thisWeek: number;
  lastWeek: number;
  unit: string;
  lowerIsBetter?: boolean;
  max: number;
}

const MOCK_METRICS: WeekMetric[] = [
  {
    label: "Focus hours",
    thisWeek: 18,
    lastWeek: 14,
    unit: "hrs",
    max: 40,
  },
  {
    label: "Journal entries",
    thisWeek: 5,
    lastWeek: 3,
    unit: "",
    max: 7,
  },
  {
    label: "Panic button uses",
    thisWeek: 1,
    lastWeek: 4,
    unit: "",
    lowerIsBetter: true,
    max: 10,
  },
];

function getDeltaColor(
  thisWeek: number,
  lastWeek: number,
  lowerIsBetter: boolean,
): string {
  if (thisWeek === lastWeek) return "text-text-secondary";
  const improved = lowerIsBetter
    ? thisWeek < lastWeek
    : thisWeek > lastWeek;
  return improved ? "text-success" : "text-danger";
}

function getDeltaLabel(thisWeek: number, lastWeek: number): string {
  const diff = thisWeek - lastWeek;
  if (diff === 0) return "same";
  const sign = diff > 0 ? "+" : "";
  return `${sign}${diff}`;
}

export function WeeklySummary() {
  return (
    <div>
      <h3 className="font-display text-xs uppercase tracking-wider text-accent mb-4">
        Weekly Summary
      </h3>

      <div className="flex flex-col gap-5">
        {MOCK_METRICS.map((metric, idx) => {
          const pctThis = (metric.thisWeek / metric.max) * 100;
          const improved =
            metric.lowerIsBetter
              ? metric.thisWeek <= metric.lastWeek
              : metric.thisWeek >= metric.lastWeek;
          const barColor = improved ? "accent" : "warning";

          return (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: idx * 0.08 }}
            >
              {/* Label row */}
              <div className="flex items-baseline justify-between mb-2">
                <span className="font-sans text-sm text-text-primary">
                  {metric.label}
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-xl text-text-primary">
                    {metric.thisWeek}
                    {metric.unit && (
                      <span className="text-xs text-text-secondary ml-0.5">
                        {metric.unit}
                      </span>
                    )}
                  </span>
                  <span
                    className={[
                      "font-mono text-xs",
                      getDeltaColor(
                        metric.thisWeek,
                        metric.lastWeek,
                        !!metric.lowerIsBetter,
                      ),
                    ].join(" ")}
                  >
                    {getDeltaLabel(metric.thisWeek, metric.lastWeek)} vs last
                    week
                  </span>
                </div>
              </div>

              {/* Progress bar */}
              <ProgressBar value={pctThis} color={barColor} size="sm" />

              {/* Last week comparison line */}
              <div className="flex items-center gap-2 mt-1">
                <span className="font-mono text-[10px] text-text-secondary">
                  Last week: {metric.lastWeek}
                  {metric.unit}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
