import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Plus } from "lucide-react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Button } from "../shared/Button";
import { Modal } from "../shared/Modal";
import { JournalEntryCard } from "./JournalEntryCard";
import { JournalEditor } from "./JournalEditor";
import type { JournalEntry, Mood } from "../../types";

/** Generate a few sample entries. */
function createMockEntries(): JournalEntry[] {
  return [
    {
      id: 1,
      title: "Starting fresh",
      content:
        "Today I decided to take control of my habits. Installed the blocker and set everything up. Feeling motivated and ready to commit to this journey. One day at a time.",
      mood: "great",
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    },
    {
      id: 2,
      title: "Tough day but held strong",
      content:
        "Had some urges today but used the panic button twice and it helped me refocus. Went for a walk instead. The streaks counter is really motivating.",
      mood: "okay",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      updatedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: 3,
      title: "One week milestone!",
      content:
        "Made it to 7 days! This is the longest streak I have had in months. The blocker categories are helping a lot. Need to keep the momentum going.",
      mood: "great",
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      updatedAt: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      id: 4,
      title: "Reflecting on progress",
      content:
        "Looking back at the stats page and seeing the green squares fill up is satisfying. Still have bad days but they are fewer. Journaling helps.",
      mood: "good",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
}

export function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>(createMockEntries);
  const [searchQuery, setSearchQuery] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editingEntry, setEditingEntry] = useState<JournalEntry | undefined>(
    undefined,
  );
  const [listParent] = useAutoAnimate<HTMLDivElement>();
  const nextIdRef = useRef(100);

  // Filtered entries
  const filtered = searchQuery.trim()
    ? entries.filter(
        (e) =>
          e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          e.content.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : entries;

  // Sort by createdAt descending
  const sorted = [...filtered].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  const handleNewEntry = useCallback(() => {
    setEditingEntry(undefined);
    setIsEditing(true);
  }, []);

  const handleEdit = useCallback((entry: JournalEntry) => {
    setEditingEntry(entry);
    setIsEditing(true);
  }, []);

  const handleDelete = useCallback((id: number) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  }, []);

  const handleSave = useCallback(
    (data: Omit<JournalEntry, "id" | "createdAt" | "updatedAt">) => {
      const now = new Date().toISOString();

      if (editingEntry) {
        // Update existing
        setEntries((prev) =>
          prev.map((e) =>
            e.id === editingEntry.id
              ? { ...e, ...data, updatedAt: now }
              : e,
          ),
        );
      } else {
        // Create new
        const newEntry: JournalEntry = {
          id: nextIdRef.current++,
          ...data,
          createdAt: now,
          updatedAt: now,
        };
        setEntries((prev) => [newEntry, ...prev]);
      }

      setIsEditing(false);
      setEditingEntry(undefined);
    },
    [editingEntry],
  );

  const handleCancel = useCallback(() => {
    setIsEditing(false);
    setEditingEntry(undefined);
  }, []);

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto pb-8">
      {/* Header */}
      <motion.h1
        className="font-display text-lg uppercase tracking-wider text-accent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        Journal
      </motion.h1>

      {/* Search + New Entry */}
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.05 }}
      >
        {/* Search input */}
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search entries..."
            className={[
              "w-full bg-bg-card border border-border rounded-md pl-9 pr-3 py-2",
              "font-sans text-sm text-text-primary placeholder:text-text-secondary/50",
              "outline-none focus:border-accent/60 focus:shadow-[0_0_8px_var(--accent-glow)]",
              "transition-all duration-200",
            ].join(" ")}
          />
        </div>

        {/* New Entry button */}
        <Button onClick={handleNewEntry} icon={<Plus size={16} />}>
          New Entry
        </Button>
      </motion.div>

      {/* Entry list */}
      <div ref={listParent} className="flex flex-col gap-3">
        {sorted.map((entry) => (
          <JournalEntryCard
            key={entry.id}
            entry={entry}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ))}

        {sorted.length === 0 && (
          <div className="text-center py-12">
            <p className="font-sans text-sm text-text-secondary">
              {searchQuery
                ? "No entries match your search."
                : "No journal entries yet. Start writing!"}
            </p>
          </div>
        )}
      </div>

      {/* Editor modal */}
      <Modal
        isOpen={isEditing}
        onClose={handleCancel}
        title={editingEntry ? "Edit Entry" : "New Entry"}
      >
        <AnimatePresence mode="wait">
          {isEditing && (
            <JournalEditor
              key={editingEntry?.id ?? "new"}
              entry={editingEntry}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          )}
        </AnimatePresence>
      </Modal>
    </div>
  );
}
