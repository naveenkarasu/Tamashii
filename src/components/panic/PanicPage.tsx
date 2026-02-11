import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { X } from "lucide-react";
import { BreathingExercise } from "./BreathingExercise";
import { GroundingExercise } from "./GroundingExercise";
import { ProductiveActions } from "./ProductiveActions";

/** Stagger animation variants shared by all sections. */
const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

/** Hardcoded personal reasons (editable later). */
const REASONS: string[] = [
  "I want to land a great job",
  "I want to be proud of myself",
  "I want to be healthy and disciplined",
];

/**
 * PanicPage - Full emergency / "I need help right now" page.
 *
 * Designed to be calming but assertive. Uses staggered entrance
 * animations so content fades in progressively as the user scrolls.
 */
export function PanicPage() {
  const navigate = useNavigate();

  return (
    <div className="relative flex flex-col gap-8 max-w-xl mx-auto pb-12">
      {/* ---- Close button ---- */}
      <motion.button
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.3, delay: 0 }}
        onClick={() => navigate("/")}
        className="absolute top-0 right-0 flex items-center justify-center w-10 h-10 rounded-md
                   bg-bg-card border border-border text-text-secondary
                   hover:text-text-primary hover:bg-bg-card-hover
                   transition-colors duration-200 cursor-pointer z-10"
        aria-label="Close panic page"
      >
        <X size={18} />
      </motion.button>

      {/* ---- Section 1: Take a Breath ---- */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.05 }}
        className="flex flex-col items-center gap-2 pt-2"
      >
        <h1 className="font-display text-2xl uppercase tracking-wider text-text-primary text-center">
          Take a Breath
        </h1>
        <p className="font-sans text-sm text-text-secondary text-center">
          You came here instead. That's real strength.
        </p>
      </motion.div>

      {/* ---- Section 2: Breathing Exercise ---- */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <BreathingExercise />
      </motion.div>

      {/* ---- Section 3: Grounding Exercise ---- */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.25 }}
      >
        <GroundingExercise />
      </motion.div>

      {/* ---- Section 4: Your Reasons ---- */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.35 }}
        className="flex flex-col gap-4"
      >
        <h3 className="font-display text-base uppercase tracking-wider text-text-primary">
          Your Reasons
        </h3>

        <div className="flex flex-col gap-3">
          {REASONS.map((reason) => (
            <div
              key={reason}
              className="border-l-2 border-accent pl-4 py-1"
            >
              <p className="font-sans text-sm italic text-text-secondary">
                {reason}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ---- Section 5: Productive Actions ---- */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.45 }}
      >
        <ProductiveActions />
      </motion.div>
    </div>
  );
}
