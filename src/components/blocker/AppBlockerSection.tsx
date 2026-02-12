import { useEffect, useState, useMemo } from "react";
import { Smartphone, Search } from "lucide-react";
import { Card } from "../shared/Card";
import { useBlockerStore } from "../../store/blockerStore";
import {
  getInstalledApps,
  checkAccessibilityPermission,
} from "../../lib/androidBlocker";
import { PermissionGuide } from "./PermissionGuide";
import type { InstalledApp } from "../../types";

export function AppBlockerSection() {
  const {
    isLocked,
    blockedApps,
    accessibilityEnabled,
    toggleBlockedApp,
    setAccessibilityEnabled,
  } = useBlockerStore();

  const [installedApps, setInstalledApps] = useState<InstalledApp[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch installed apps and accessibility status
  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [apps, accessible] = await Promise.all([
          getInstalledApps(),
          checkAccessibilityPermission(),
        ]);
        if (!active) return;
        setInstalledApps(apps);
        setAccessibilityEnabled(accessible);
      } catch {
        // Ignore on desktop
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => { active = false; };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Re-check accessibility periodically
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const enabled = await checkAccessibilityPermission();
        setAccessibilityEnabled(enabled);
      } catch {}
    }, 3000);
    return () => clearInterval(interval);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filteredApps = useMemo(() => {
    if (!searchQuery) return installedApps;
    const q = searchQuery.toLowerCase();
    return installedApps.filter(
      (app) =>
        app.appName.toLowerCase().includes(q) ||
        app.packageName.toLowerCase().includes(q),
    );
  }, [installedApps, searchQuery]);

  if (loading) {
    return (
      <Card>
        <div className="flex items-center gap-2">
          <Smartphone size={14} className="text-text-secondary animate-pulse" />
          <span className="font-sans text-sm text-text-secondary">
            Loading installed apps...
          </span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {/* Section header */}
      <div className="flex items-center gap-2">
        <Smartphone size={14} className="text-text-secondary" />
        <h2 className="font-display text-xs uppercase tracking-wider text-text-secondary">
          App Blocking
        </h2>
        {blockedApps.length > 0 && (
          <span className="ml-auto font-mono text-xs text-accent">
            {blockedApps.length} blocked
          </span>
        )}
      </div>

      {/* Permission guide */}
      <PermissionGuide accessibilityEnabled={accessibilityEnabled} />

      {/* App list */}
      <Card>
        {/* Search */}
        <div className="relative mb-3">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search apps..."
            className={[
              "w-full h-9 pl-9 pr-3 rounded-md",
              "bg-bg-primary border border-border",
              "font-sans text-sm text-text-primary",
              "placeholder:text-text-secondary/50",
              "focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30",
              "transition-colors duration-200",
            ].join(" ")}
          />
        </div>

        {/* App list (scrollable) */}
        <div className="max-h-72 overflow-y-auto space-y-1 -mx-1 px-1">
          {filteredApps.map((app) => {
            const isBlocked = blockedApps.includes(app.packageName);
            return (
              <label
                key={app.packageName}
                className={[
                  "flex items-center gap-3 h-11 px-3 rounded-md cursor-pointer",
                  "transition-colors duration-150",
                  isBlocked
                    ? "bg-accent/10 border border-accent/30"
                    : "bg-transparent border border-transparent hover:bg-bg-card-hover/50",
                  isLocked ? "opacity-60 pointer-events-none" : "",
                ].join(" ")}
              >
                <input
                  type="checkbox"
                  checked={isBlocked}
                  onChange={() => toggleBlockedApp(app.packageName)}
                  disabled={isLocked}
                  className="w-4 h-4 rounded border-border bg-bg-card accent-accent shrink-0"
                />
                {app.iconBase64 ? (
                  <img
                    src={`data:image/png;base64,${app.iconBase64}`}
                    alt=""
                    className="w-7 h-7 rounded shrink-0"
                  />
                ) : (
                  <div className="w-7 h-7 rounded bg-bg-card-hover shrink-0" />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-sans text-sm text-text-primary truncate">
                    {app.appName}
                  </p>
                </div>
              </label>
            );
          })}

          {filteredApps.length === 0 && (
            <p className="text-sm text-text-secondary text-center py-4 font-sans">
              {searchQuery ? "No apps match your search." : "No apps found."}
            </p>
          )}
        </div>
      </Card>
    </div>
  );
}
