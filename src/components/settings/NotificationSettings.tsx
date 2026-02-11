import { useAppStore } from "../../store/appStore";
import { Toggle } from "../shared/Toggle";

export function NotificationSettings() {
  const notificationsEnabled = useAppStore((s) => s.notificationsEnabled);
  const toggleNotifications = useAppStore((s) => s.toggleNotifications);
  const notificationTime = useAppStore((s) => s.notificationTime);
  const setNotificationTime = useAppStore((s) => s.setNotificationTime);

  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-display text-xs uppercase tracking-wider text-text-secondary">
        Notifications
      </h2>

      {/* Toggle row */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm text-text-primary">
          Daily motivational quotes
        </span>
        <Toggle checked={notificationsEnabled} onChange={() => toggleNotifications()} />
      </div>

      {/* Time picker row */}
      <div className="flex items-center justify-between">
        <span className="font-sans text-sm text-text-primary">
          Notification time
        </span>
        <input
          type="time"
          value={notificationTime}
          onChange={(e) => setNotificationTime(e.target.value)}
          disabled={!notificationsEnabled}
          className={[
            "bg-bg-card border border-border rounded-md px-3 py-1.5",
            "font-mono text-sm text-text-primary",
            "focus:outline-none focus:ring-2 focus:ring-accent/50",
            "transition-opacity duration-200",
            !notificationsEnabled ? "opacity-50 cursor-not-allowed" : "",
          ].join(" ")}
        />
      </div>
    </section>
  );
}
