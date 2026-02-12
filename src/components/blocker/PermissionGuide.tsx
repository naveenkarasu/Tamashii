import { AlertTriangle, Settings, Wifi } from "lucide-react";
import { Card } from "../shared/Card";
import { Button } from "../shared/Button";
import { openAccessibilitySettings } from "../../lib/androidBlocker";

interface PermissionGuideProps {
  accessibilityEnabled: boolean;
}

export function PermissionGuide({ accessibilityEnabled }: PermissionGuideProps) {
  async function handleOpenSettings() {
    try {
      await openAccessibilitySettings();
    } catch {
      // Ignore errors
    }
  }

  return (
    <Card>
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle size={16} className="text-warning" />
        <h3 className="font-display text-xs uppercase tracking-wider text-warning">
          Setup Required
        </h3>
      </div>

      <div className="space-y-3">
        {/* VPN permission */}
        <div className="flex items-start gap-3">
          <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-500/20 text-green-500 shrink-0 mt-0.5">
            <Wifi size={12} />
          </div>
          <div>
            <p className="font-sans text-sm text-text-primary">VPN Permission</p>
            <p className="font-sans text-xs text-text-secondary">
              Automatic system dialog on first lock. One tap to allow.
            </p>
          </div>
        </div>

        {/* Accessibility */}
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex items-center justify-center h-6 w-6 rounded-full shrink-0 mt-0.5",
              accessibilityEnabled
                ? "bg-green-500/20 text-green-500"
                : "bg-warning/20 text-warning",
            ].join(" ")}
          >
            <Settings size={12} />
          </div>
          <div className="flex-1">
            <p className="font-sans text-sm text-text-primary">
              Accessibility Service
              {accessibilityEnabled && (
                <span className="ml-2 text-xs text-green-500 font-mono">ENABLED</span>
              )}
            </p>
            <p className="font-sans text-xs text-text-secondary">
              {accessibilityEnabled
                ? "Tamashii can detect and block apps."
                : "Required for app blocking. Must be enabled manually in Settings."}
            </p>
            {!accessibilityEnabled && (
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenSettings}
                className="mt-2"
                icon={<Settings size={12} />}
              >
                Open Accessibility Settings
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
