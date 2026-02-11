import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "../shared/Button";
import type { JournalEntry, Mood } from "../../types";

interface JournalEditorProps {
  entry?: JournalEntry;
  onSave: (
    entry: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">,
  ) => void;
  onCancel: () => void;
}

const MOODS: { value: Mood; emoji: string }[] = [
  { value: "great", emoji: "\u{1F604}" },     // 😄
  { value: "good", emoji: "\u{1F60E}" },      // 😎
  { value: "okay", emoji: "\u{1F610}" },      // 😐
  { value: "bad", emoji: "\u{1F61E}" },       // 😞
  { value: "terrible", emoji: "\u{1F622}" },  // 😢
];

export function JournalEditor({ entry, onSave, onCancel }: JournalEditorProps) {
  const [title, setTitle] = useState(entry?.title ?? "");
  const [content, setContent] = useState(entry?.content ?? "");
  const [mood, setMood] = useState<Mood>(entry?.mood ?? "okay");

  const isEditing = !!entry;
  const canSave = title.trim().length > 0 && content.trim().length > 0;

  function handleSave() {
    if (!canSave) return;
    onSave({ title: title.trim(), content: content.trim(), mood });
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-4"
    >
      {/* Header */}
      <h2 className="font-display text-sm uppercase tracking-wider text-accent">
        {isEditing ? "Edit Entry" : "New Entry"}
      </h2>

      {/* Title input */}
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Entry title..."
        className={[
          "w-full bg-bg-card border border-border rounded-md px-3 py-2",
          "font-sans text-sm text-text-primary placeholder:text-text-secondary/50",
          "outline-none focus:border-accent/60 focus:shadow-[0_0_8px_var(--accent-glow)]",
          "transition-all duration-200",
        ].join(" ")}
      />

      {/* Content textarea */}
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write your thoughts..."
        className={[
          "w-full bg-bg-card border border-border rounded-md px-3 py-2",
          "font-sans text-sm text-text-primary placeholder:text-text-secondary/50",
          "outline-none focus:border-accent/60 focus:shadow-[0_0_8px_var(--accent-glow)]",
          "transition-all duration-200",
          "min-h-32 resize-y",
        ].join(" ")}
      />

      {/* Mood selector */}
      <div>
        <span className="font-sans text-xs text-text-secondary mb-2 block">
          How are you feeling?
        </span>
        <div className="flex items-center gap-2">
          {MOODS.map((m) => {
            const isSelected = mood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setMood(m.value)}
                className={[
                  "w-10 h-10 rounded-md text-lg flex items-center justify-center",
                  "border transition-all duration-200",
                  isSelected
                    ? "border-accent scale-110 shadow-[0_0_10px_var(--accent-glow)]"
                    : "border-border opacity-60 hover:opacity-80 hover:border-border/80",
                ].join(" ")}
                aria-label={m.value}
                type="button"
              >
                {m.emoji}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <Button onClick={handleSave} disabled={!canSave}>
          {isEditing ? "Save Changes" : "Create Entry"}
        </Button>
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </motion.div>
  );
}
