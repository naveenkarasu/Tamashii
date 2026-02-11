import type { ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
};

export function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="hidden"
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            variants={backdropVariants}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />

          {/* Content */}
          <motion.div
            className={[
              "relative w-full max-w-md mx-4",
              "bg-bg-card border border-border rounded-md p-6",
              "shadow-[0_0_30px_var(--accent-glow)]",
              "card-anime-border",
            ].join(" ")}
            variants={contentVariants}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-sm uppercase tracking-wider text-accent">
                {title}
              </h2>
              <button
                onClick={onClose}
                className={[
                  "p-1 rounded-md text-text-secondary",
                  "hover:text-text-primary hover:bg-bg-card-hover",
                  "transition-colors duration-200",
                ].join(" ")}
              >
                <X size={18} />
              </button>
            </div>

            {/* Body */}
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
