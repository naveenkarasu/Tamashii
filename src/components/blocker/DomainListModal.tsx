import { useState } from "react";
import { Plus, Globe } from "lucide-react";
import { Modal } from "../shared/Modal";
import { Button } from "../shared/Button";
import { useBlockerStore } from "../../store/blockerStore";
import { blocklists } from "../../lib/blocklists";

interface DomainListModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryId: string | null;
  categoryName: string;
}

export function DomainListModal({
  isOpen,
  onClose,
  categoryId,
  categoryName,
}: DomainListModalProps) {
  const { customDomains, addCustomDomain } = useBlockerStore();
  const [newDomain, setNewDomain] = useState("");
  const [error, setError] = useState("");

  // Get domains for the selected category, or custom domains
  const isCustom = categoryId === "custom";
  const domains: string[] = isCustom
    ? customDomains
    : categoryId && blocklists[categoryId]
      ? blocklists[categoryId].domains
      : [];

  function handleAddDomain() {
    const trimmed = newDomain.trim().toLowerCase();

    if (!trimmed) return;

    // Basic domain validation
    const domainRegex = /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)*\.[a-z]{2,}$/;
    if (!domainRegex.test(trimmed)) {
      setError("Please enter a valid domain (e.g. example.com)");
      return;
    }

    if (customDomains.includes(trimmed)) {
      setError("Domain already added");
      return;
    }

    addCustomDomain(trimmed);
    setNewDomain("");
    setError("");
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddDomain();
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={categoryName}>
      <div className="space-y-4">
        {/* Domain list */}
        <div className="max-h-64 overflow-y-auto space-y-1 pr-1 scrollbar-thin">
          {domains.length > 0 ? (
            domains.map((domain) => (
              <div
                key={domain}
                className={[
                  "flex items-center gap-2 h-8 px-2 rounded",
                  "hover:bg-bg-card-hover/50 transition-colors duration-150",
                ].join(" ")}
              >
                <Globe size={12} className="text-text-secondary shrink-0" />
                <span className="font-mono text-sm text-text-primary truncate">
                  {domain}
                </span>
              </div>
            ))
          ) : (
            <p className="text-sm text-text-secondary text-center py-4 font-sans">
              No domains in this category.
            </p>
          )}
        </div>

        {/* Divider */}
        <div className="border-t border-border" />

        {/* Add custom domain input */}
        <div>
          <label className="block font-display text-xs uppercase tracking-wider text-text-secondary mb-2">
            Add Custom Domain
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={newDomain}
              onChange={(e) => {
                setNewDomain(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder="example.com"
              className={[
                "flex-1 h-9 px-3 rounded-md",
                "bg-bg-primary border border-border",
                "font-mono text-sm text-text-primary",
                "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
                "transition-colors duration-200",
                "placeholder:text-text-secondary/50",
              ].join(" ")}
            />
            <Button
              variant="primary"
              size="sm"
              onClick={handleAddDomain}
              icon={<Plus size={14} />}
            >
              Add
            </Button>
          </div>
          {error && (
            <p className="mt-1 text-xs text-danger font-sans">{error}</p>
          )}
        </div>
      </div>
    </Modal>
  );
}
