import { Pencil, Trash2 } from "lucide-react";
import { Card } from "../shared/Card";
import type { JournalEntry, Mood } from "../../types";

interface JournalEntryProps {
  entry: JournalEntry;
  onEdit: (entry: JournalEntry) => void;
  onDelete: (id: number) => void;
}

const MOOD_EMOJI: Record<Mood, string> = {
  great: "\u{1F604}",   // 😄
  good: "\u{1F642}",    // 🙂
  okay: "\u{1F610}",    // 😐
  bad: "\u{1F61E}",     // 😞
  terrible: "\u{1F622}", // 😢
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function JournalEntryCard({ entry, onEdit, onDelete }: JournalEntryProps) {
  const preview =
    entry.content.length > 100
      ? entry.content.slice(0, 100) + "..."
      : entry.content;

  return (
    <Card hoverable onClick={() => onEdit(entry)}>
      {/* Top row: mood emoji + title */}
      <div className="flex items-center gap-2 mb-1">
        <span className="text-lg" role="img" aria-label={entry.mood}>
          {MOOD_EMOJI[entry.mood]}
        </span>
        <h3 className="font-sans font-semibold text-text-primary truncate">
          {entry.title}
        </h3>
      </div>

      {/* Content preview */}
      <p className="font-sans text-sm text-text-secondary mb-2 line-clamp-2">
        {preview}
      </p>

      {/* Bottom row: date + actions */}
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs text-accent">
          {formatDate(entry.createdAt)}
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit(entry);
            }}
            className={[
              "p-1.5 rounded-md text-text-secondary",
              "hover:text-accent hover:bg-bg-card-hover",
              "transition-colors duration-150",
            ].join(" ")}
            aria-label="Edit entry"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(entry.id);
            }}
            className={[
              "p-1.5 rounded-md text-text-secondary",
              "hover:text-danger hover:bg-bg-card-hover",
              "transition-colors duration-150",
            ].join(" ")}
            aria-label="Delete entry"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </Card>
  );
}
