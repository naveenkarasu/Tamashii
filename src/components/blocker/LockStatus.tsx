import { useState, useEffect, useCallback } from "react";
import { Card } from "../shared/Card";
import { Button } from "../shared/Button";
import { useBlockerStore } from "../../store/blockerStore";

interface TimeRemaining {
  hours: number;
  minutes: number;
  seconds: number;
  expired: boolean;
}

function calcTimeRemaining(expiresAt: string | null): TimeRemaining {
  if (!expiresAt) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  const now = Date.now();
  const target = new Date(expiresAt).getTime();
  const diff = target - now;

  if (diff <= 0) return { hours: 0, minutes: 0, seconds: 0, expired: true };

  const totalSeconds = Math.floor(diff / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    expired: false,
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export function LockStatus() {
  const { isLocked, lockExpiresAt, extendLock } = useBlockerStore();
  const [remaining, setRemaining] = useState<TimeRemaining>(() =>
    calcTimeRemaining(lockExpiresAt),
  );

  const updateTimer = useCallback(() => {
    setRemaining(calcTimeRemaining(lockExpiresAt));
  }, [lockExpiresAt]);

  useEffect(() => {
    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [updateTimer]);

  if (!isLocked) return null;

  // Format the expiry date for display
  const expiryLabel = lockExpiresAt
    ? new Date(lockExpiresAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
      })
    : "Unknown";

  return (
    <Card className="border-danger/50 shadow-[0_0_20px_var(--danger-glow)]">
      {/* Status header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-display text-sm uppercase tracking-wider text-danger">
          STATUS:
        </span>
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-danger opacity-75" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-danger" />
        </span>
        <span className="font-display text-sm uppercase tracking-wider text-danger">
          LOCKED
        </span>
      </div>

      {/* Blocking active until */}
      <p className="font-sans text-sm text-text-secondary mb-4">
        Blocking active until:{" "}
        <span className="text-text-primary">{expiryLabel}</span>
      </p>

      {/* Countdown display */}
      <div className="flex items-center justify-center gap-1 mb-1">
        <span className="font-mono text-3xl text-danger tabular-nums">
          {pad(remaining.hours)}
        </span>
        <span className="font-mono text-3xl text-danger/60">:</span>
        <span className="font-mono text-3xl text-danger tabular-nums">
          {pad(remaining.minutes)}
        </span>
        <span className="font-mono text-3xl text-danger/60">:</span>
        <span className="font-mono text-3xl text-danger tabular-nums">
          {pad(remaining.seconds)}
        </span>
      </div>

      {/* Labels */}
      <div className="flex items-center justify-center gap-6 mb-5">
        <span className="font-mono text-xs text-text-secondary w-[52px] text-center">
          hrs
        </span>
        <span className="font-mono text-xs text-text-secondary w-[52px] text-center">
          min
        </span>
        <span className="font-mono text-xs text-text-secondary w-[52px] text-center">
          sec
        </span>
      </div>

      {/* Extend buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => extendLock(24)}
          className="flex-1"
        >
          +24h
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => extendLock(24 * 7)}
          className="flex-1"
        >
          +7d
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={() => extendLock(24 * 30)}
          className="flex-1"
        >
          +30d
        </Button>
      </div>
    </Card>
  );
}
