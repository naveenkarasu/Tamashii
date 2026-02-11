import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { mascotDialogues } from "../../lib/mascotDialogues";

interface MascotDialogueProps {
  /** Key into the mascotDialogues map (e.g. "greeting", "day_7"). */
  context: string;
  visible: boolean;
  onDismiss: () => void;
}

/**
 * MascotDialogue - Anime-style speech bubble.
 *
 * Picks a random message from `mascotDialogues[context]` and displays it
 * inside a warm cream bubble with a triangular tail pointing bottom-left.
 * Auto-dismisses after 8 seconds or on click.
 *
 * Uses Framer Motion AnimatePresence for a smooth fade-in-from-below /
 * fade-out transition.
 */
export function MascotDialogue({ context, visible, onDismiss }: MascotDialogueProps) {
  // Pick a random message once per context/visible combination
  const message = useMemo(() => {
    const pool = mascotDialogues[context];
    if (!pool || pool.length === 0) return null;
    return pool[Math.floor(Math.random() * pool.length)];
  }, [context, visible]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-hide after 8 seconds
  useEffect(() => {
    if (!visible) return;

    const timer = setTimeout(() => {
      onDismiss();
    }, 8000);

    return () => clearTimeout(timer);
  }, [visible, onDismiss]);

  if (!message) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          onClick={onDismiss}
          className="relative max-w-xs cursor-pointer select-none"
        >
          {/* Bubble */}
          <div
            className="rounded-xl p-4 font-anime text-sm leading-relaxed"
            style={{
              backgroundColor: "#fef3c7",
              color: "#1a0a2e",
              border: "2px solid transparent",
              borderImage: "linear-gradient(135deg, #f472b6, #8b5cf6) 1",
              borderImageSlice: 1,
              /* borderImage doesn't work with border-radius, so we layer a
                 pseudo-element-style approach via boxShadow + outline instead */
              borderColor: "transparent",
              outline: "2px solid",
              outlineColor: "#f472b6",
              backgroundClip: "padding-box",
            }}
          >
            {/* Gradient border overlay using box-shadow trick */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                background:
                  "linear-gradient(135deg, #f472b6, #8b5cf6) border-box",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
                padding: "2px",
                borderRadius: "inherit",
              }}
            />

            <span className="relative z-10">{message}</span>
          </div>

          {/* Triangular tail (bottom-left) */}
          <svg
            width="20"
            height="14"
            viewBox="0 0 20 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute -bottom-3 left-6"
            aria-hidden="true"
          >
            <path d="M0 0 L10 14 L20 0" fill="#fef3c7" />
            <path
              d="M0 0 L10 14 L20 0"
              stroke="url(#tailGradient)"
              strokeWidth="2"
              fill="none"
            />
            <defs>
              <linearGradient
                id="tailGradient"
                x1="0"
                y1="0"
                x2="20"
                y2="0"
              >
                <stop offset="0%" stopColor="#f472b6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
