import { useState } from "react";
import { ShieldAlert } from "lucide-react";
import { Card } from "../shared/Card";
import { Button } from "../shared/Button";
import { Modal } from "../shared/Modal";
import { useBlockerStore } from "../../store/blockerStore";
import { blocklists } from "../../lib/blocklists";
import { isAndroid } from "../../lib/platform";
import {
  startVpnBlocker,
  startAppBlocker,
  applyBlocklist,
  saveLockExpiryNative,
} from "../../lib/androidBlocker";
import type { BlockCategory } from "../../types";

const DURATION_OPTIONS = [
  { label: "24 hours", hours: 24 },
  { label: "48 hours", hours: 48 },
  { label: "7 days", hours: 24 * 7 },
  { label: "30 days", hours: 24 * 30 },
  { label: "90 days", hours: 24 * 90 },
] as const;

const android = isAndroid();

export function ActivateForm() {
  const {
    isLocked,
    categories,
    setLockStatus,
    toggleCategory,
    blockedApps,
    customDomains,
    setVpnActive,
    setAppBlockerActive,
  } = useBlockerStore();

  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [durationHours, setDurationHours] = useState<number>(
    DURATION_OPTIONS[0].hours,
  );
  const [showConfirm, setShowConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [activating, setActivating] = useState(false);

  // Don't render when already locked
  if (isLocked) return null;

  const unlockedCategories = categories.filter((cat) => !cat.isLocked);

  function handleToggleSelect(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  function handleActivateClick() {
    if (selectedIds.size === 0) return;
    setConfirmText("");
    setShowConfirm(true);
  }

  async function handleConfirmLock() {
    if (confirmText !== "LOCK") return;
    setActivating(true);

    try {
      // Enable selected categories
      for (const id of selectedIds) {
        const cat = categories.find((c) => c.id === id);
        if (cat && !cat.isEnabled) {
          toggleCategory(id);
        }
      }

      // Collect all domains from selected categories + custom domains
      const domains: string[] = [];
      for (const id of selectedIds) {
        const list = blocklists[id];
        if (list) {
          domains.push(...list.domains);
        }
      }
      domains.push(...customDomains);

      // Calculate expiry
      const expiresAt = new Date();
      expiresAt.setHours(expiresAt.getHours() + durationHours);
      const expiryIso = expiresAt.toISOString();

      if (android) {
        // Android: Start VPN DNS blocker
        if (domains.length > 0) {
          await startVpnBlocker(domains);
          setVpnActive(true);
        }

        // Android: Start app blocker (if apps selected)
        if (blockedApps.length > 0) {
          await startAppBlocker(blockedApps);
          setAppBlockerActive(true);
        }

        // Persist lock expiry to native SharedPreferences
        await saveLockExpiryNative(expiryIso);
      } else {
        // Desktop (Windows): Apply hosts file blocker
        if (domains.length > 0) {
          await applyBlocklist(domains);
        }
      }

      // Update frontend state
      setLockStatus(true, expiryIso);
      setShowConfirm(false);
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Failed to activate blocker:", err);
      // Still show error but don't break UI
    } finally {
      setActivating(false);
    }
  }

  return (
    <>
      <Card>
        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <ShieldAlert size={18} className="text-accent" />
          <h3 className="font-display text-sm uppercase tracking-wider text-accent">
            Activate New Block
          </h3>
        </div>

        {/* Category checkboxes */}
        <div className="space-y-2 mb-4">
          {unlockedCategories.map((cat: BlockCategory) => (
            <label
              key={cat.id}
              className={[
                "flex items-center gap-3 h-10 px-3 rounded-md cursor-pointer",
                "transition-colors duration-150",
                selectedIds.has(cat.id)
                  ? "bg-accent/10 border border-accent/30"
                  : "bg-bg-card-hover/50 border border-transparent hover:border-border",
              ].join(" ")}
            >
              <input
                type="checkbox"
                checked={selectedIds.has(cat.id)}
                onChange={() => handleToggleSelect(cat.id)}
                className="w-4 h-4 rounded border-border bg-bg-card accent-accent"
              />
              <span className="font-sans text-sm text-text-primary flex-1">
                {cat.name}
              </span>
              <span className="font-mono text-xs text-text-secondary">
                {cat.domainCount}
              </span>
            </label>
          ))}

          {unlockedCategories.length === 0 && (
            <p className="text-sm text-text-secondary text-center py-3 font-sans">
              No categories available to activate.
            </p>
          )}
        </div>

        {/* Summary for Android */}
        {android && blockedApps.length > 0 && (
          <div className="mb-4 p-3 rounded-md bg-accent/5 border border-accent/20">
            <p className="font-sans text-xs text-text-secondary">
              <span className="text-accent font-medium">{blockedApps.length} app{blockedApps.length === 1 ? "" : "s"}</span> will also be blocked via Accessibility Service
            </p>
          </div>
        )}

        {/* Duration select */}
        <div className="mb-4">
          <label className="block font-display text-xs uppercase tracking-wider text-text-secondary mb-2">
            Duration
          </label>
          <select
            value={durationHours}
            onChange={(e) => setDurationHours(Number(e.target.value))}
            className={[
              "w-full h-10 px-3 rounded-md",
              "bg-bg-card border border-border",
              "font-mono text-sm text-text-primary",
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
              "transition-colors duration-200",
              "appearance-none cursor-pointer",
            ].join(" ")}
          >
            {DURATION_OPTIONS.map((opt) => (
              <option key={opt.hours} value={opt.hours}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Activate button */}
        <Button
          variant="primary"
          fullWidth
          onClick={handleActivateClick}
          disabled={selectedIds.size === 0}
          icon={<ShieldAlert size={16} />}
        >
          ACTIVATE BLOCK
        </Button>
      </Card>

      {/* Confirmation modal */}
      <Modal
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        title="Confirm Activation"
      >
        <div className="space-y-4">
          <p className="font-sans text-sm text-text-secondary">
            You are about to lock{" "}
            <span className="text-text-primary font-medium">
              {selectedIds.size} {selectedIds.size === 1 ? "category" : "categories"}
            </span>{" "}
            for{" "}
            <span className="text-text-primary font-medium">
              {DURATION_OPTIONS.find((o) => o.hours === durationHours)?.label}
            </span>
            . This action cannot be undone until the lock expires.
          </p>

          {android && (
            <p className="font-sans text-xs text-text-secondary bg-bg-card p-2 rounded">
              Android: VPN DNS filtering will activate.
              {blockedApps.length > 0 && ` ${blockedApps.length} app(s) will be blocked.`}
            </p>
          )}

          <p className="font-sans text-sm text-warning">
            Type <span className="font-mono font-bold">LOCK</span> to confirm:
          </p>

          <input
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder="Type LOCK here..."
            className={[
              "w-full h-10 px-3 rounded-md",
              "bg-bg-primary border border-border",
              "font-mono text-sm text-text-primary",
              "focus:outline-none focus:border-danger focus:ring-1 focus:ring-danger/30",
              "transition-colors duration-200",
              "placeholder:text-text-secondary/50",
            ].join(" ")}
            autoFocus
          />

          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => setShowConfirm(false)}
              className="flex-1"
              disabled={activating}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmLock}
              disabled={confirmText !== "LOCK" || activating}
              className="flex-1"
            >
              {activating ? "ACTIVATING..." : "CONFIRM LOCK"}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
