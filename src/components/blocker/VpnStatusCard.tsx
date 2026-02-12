import { useEffect, useState } from "react";
import { Wifi } from "lucide-react";
import { Card } from "../shared/Card";
import { getVpnStatus } from "../../lib/androidBlocker";
import type { VpnStatus } from "../../types";

export function VpnStatusCard() {
  const [status, setStatus] = useState<VpnStatus | null>(null);

  useEffect(() => {
    let active = true;

    async function poll() {
      try {
        const s = await getVpnStatus();
        if (active) setStatus(s);
      } catch {
        // VPN status not available
      }
    }

    poll();
    const interval = setInterval(poll, 5000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  if (!status) return null;

  return (
    <Card
      className={
        status.isRunning
          ? "border-success/50 shadow-[0_0_16px_var(--success-glow,rgba(34,197,94,0.15))]"
          : "border-border"
      }
    >
      <div className="flex items-center gap-3">
        <div className="relative">
          <Wifi size={18} className={status.isRunning ? "text-green-500" : "text-text-secondary"} />
          {status.isRunning && (
            <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          )}
        </div>
        <div className="flex-1">
          <p className="font-display text-xs uppercase tracking-wider text-text-primary">
            {status.isRunning ? "DNS Filtering Active" : "DNS Filter Inactive"}
          </p>
          {status.isRunning && (
            <p className="font-mono text-xs text-text-secondary mt-0.5">
              {status.domainsLoaded} domains loaded &middot; {status.blockedCount} blocked
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
