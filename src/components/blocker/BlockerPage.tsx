import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Shield, Eye, List } from "lucide-react";
import { useBlockerStore } from "../../store/blockerStore";
import { blocklists } from "../../lib/blocklists";
import { Button } from "../shared/Button";
import { LockStatus } from "./LockStatus";
import { CategoryCard } from "./CategoryCard";
import { ActivateForm } from "./ActivateForm";
import { DomainListModal } from "./DomainListModal";
import type { BlockCategory } from "../../types";

/** Map blocklist keys to human-readable names and icons. */
const CATEGORY_META: Record<string, { name: string; icon: string }> = {
  adult: { name: "Adult Content", icon: "ShieldOff" },
  social_media: { name: "Social Media", icon: "Users" },
  gambling: { name: "Gambling", icon: "Dice5" },
  news: { name: "News & Media", icon: "Newspaper" },
  entertainment: { name: "Entertainment", icon: "Tv" },
  gaming: { name: "Gaming", icon: "Gamepad2" },
  shopping: { name: "Shopping", icon: "ShoppingCart" },
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

export function BlockerPage() {
  const { isLocked, categories, addCategory, toggleCategory, customDomains } =
    useBlockerStore();

  const [domainModalOpen, setDomainModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Seed categories from blocklists on first mount if the store is empty
  useEffect(() => {
    if (categories.length > 0) return;

    for (const key of Object.keys(blocklists)) {
      const meta = CATEGORY_META[key] ?? {
        name: key.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
        icon: "Globe",
      };

      const category: BlockCategory = {
        id: key,
        name: meta.name,
        icon: meta.icon,
        domainCount: blocklists[key].domains.length,
        isLocked: false,
        isEnabled: false,
      };

      addCategory(category);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleOpenDomains(categoryId: string, categoryName: string) {
    setSelectedCategory({ id: categoryId, name: categoryName });
    setDomainModalOpen(true);
  }

  return (
    <div className="flex flex-col gap-5 max-w-xl mx-auto pb-8">
      {/* Header */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0 }}
        className="flex items-center gap-3"
      >
        <Shield size={22} className="text-accent" />
        <h1 className="font-display text-lg uppercase tracking-wider text-text-primary">
          Website Blocking
        </h1>
      </motion.div>

      {/* Lock status card (only when locked) */}
      {isLocked && (
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.08 }}
        >
          <LockStatus />
        </motion.div>
      )}

      {/* Categories section */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.16 }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Eye size={14} className="text-text-secondary" />
          <h2 className="font-display text-xs uppercase tracking-wider text-text-secondary">
            Categories
          </h2>
        </div>

        <div className="space-y-2">
          {categories.map((cat) => (
            <div key={cat.id} className="group relative">
              <CategoryCard
                category={cat}
                onToggle={toggleCategory}
                isLocked={isLocked}
              />
              {/* View domains button overlay */}
              <button
                onClick={() => handleOpenDomains(cat.id, cat.name)}
                className={[
                  "absolute right-14 top-1/2 -translate-y-1/2",
                  "opacity-0 group-hover:opacity-100",
                  "p-1.5 rounded text-text-secondary hover:text-accent",
                  "transition-all duration-200",
                ].join(" ")}
                title={`View ${cat.name} domains`}
              >
                <List size={14} />
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Activate form (only when NOT locked) */}
      {!isLocked && (
        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.4, delay: 0.24 }}
        >
          <ActivateForm />
        </motion.div>
      )}

      {/* Custom domains section */}
      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.4, delay: 0.32 }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <List size={14} className="text-text-secondary" />
            <h2 className="font-display text-xs uppercase tracking-wider text-text-secondary">
              Custom Domains
            </h2>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleOpenDomains("custom", "Custom Domains")}
          >
            <span className="font-mono text-xs">
              {customDomains.length} added
            </span>
          </Button>
        </div>

        {customDomains.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {customDomains.slice(0, 8).map((domain) => (
              <span
                key={domain}
                className={[
                  "inline-flex items-center h-7 px-2.5 rounded",
                  "bg-bg-card border border-border",
                  "font-mono text-xs text-text-secondary",
                ].join(" ")}
              >
                {domain}
              </span>
            ))}
            {customDomains.length > 8 && (
              <span className="inline-flex items-center h-7 px-2.5 font-mono text-xs text-text-secondary">
                +{customDomains.length - 8} more
              </span>
            )}
          </div>
        ) : (
          <p className="text-sm text-text-secondary font-sans">
            No custom domains added yet. Use the modal to add specific sites.
          </p>
        )}
      </motion.div>

      {/* Domain list modal */}
      <DomainListModal
        isOpen={domainModalOpen}
        onClose={() => {
          setDomainModalOpen(false);
          setSelectedCategory(null);
        }}
        categoryId={selectedCategory?.id ?? null}
        categoryName={selectedCategory?.name ?? ""}
      />
    </div>
  );
}
