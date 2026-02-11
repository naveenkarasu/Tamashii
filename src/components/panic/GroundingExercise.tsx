import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";

interface GroundingItem {
  count: number;
  sense: string;
  keyword: string;
}

const ITEMS: GroundingItem[] = [
  { count: 5, sense: "things you can", keyword: "SEE" },
  { count: 4, sense: "things you can", keyword: "TOUCH" },
  { count: 3, sense: "things you can", keyword: "HEAR" },
  { count: 2, sense: "things you can", keyword: "SMELL" },
  { count: 1, sense: "thing you can", keyword: "TASTE" },
];

/**
 * GroundingExercise - Interactive 5-4-3-2-1 grounding technique.
 *
 * Each sense row has a custom checkbox. When all five are checked
 * a success message is displayed.
 */
export function GroundingExercise() {
  const [checked, setChecked] = useState<boolean[]>(
    Array(ITEMS.length).fill(false)
  );

  const toggle = (index: number) => {
    setChecked((prev) => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const allChecked = checked.every(Boolean);

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h3 className="font-display text-base uppercase tracking-wider text-text-primary">
        Ground Yourself: 5-4-3-2-1
      </h3>

      {/* Items */}
      <div className="flex flex-col gap-3">
        {ITEMS.map((item, idx) => (
          <button
            key={item.keyword}
            type="button"
            onClick={() => toggle(idx)}
            className="flex items-center gap-3 group cursor-pointer bg-transparent border-0 p-0 text-left outline-none"
          >
            {/* Custom checkbox */}
            <span
              className={[
                "flex items-center justify-center shrink-0",
                "w-6 h-6 rounded-md border-2 transition-all duration-200",
                checked[idx]
                  ? "bg-accent border-accent"
                  : "bg-transparent border-accent/50 group-hover:border-accent",
              ].join(" ")}
            >
              {checked[idx] && (
                <Check
                  size={14}
                  strokeWidth={3}
                  className="text-bg-primary"
                />
              )}
            </span>

            {/* Label */}
            <span
              className={[
                "font-sans text-base transition-colors duration-200",
                checked[idx]
                  ? "text-text-secondary line-through"
                  : "text-text-primary",
              ].join(" ")}
            >
              {item.count}{" "}
              {item.sense}{" "}
              <span className="font-display text-accent">
                {item.keyword}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Completion message */}
      <AnimatePresence>
        {allChecked && (
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
            className="font-sans text-sm text-success mt-1"
          >
            Well done! You're grounded.
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
