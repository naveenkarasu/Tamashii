import { Moon, Sun, Sparkles, Minus, X } from "lucide-react";
import { useAppStore } from "../../store/appStore";
import type { Theme } from "../../types";

const themeOptions: { theme: Theme; icon: typeof Moon; label: string }[] = [
  { theme: "dark", icon: Moon, label: "Dark" },
  { theme: "light", icon: Sun, label: "Light" },
  { theme: "anime", icon: Sparkles, label: "Anime" },
];

const themeLogo: Record<Theme, string> = {
  dark: "/logo-dark.png",
  light: "/logo-light.png",
  anime: "/logo-anime.png",
};

async function minimizeWindow() {
  try {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    await getCurrentWindow().minimize();
  } catch {
    // Dev mode - Tauri API not available
  }
}

async function closeWindow() {
  try {
    const { getCurrentWindow } = await import("@tauri-apps/api/window");
    await getCurrentWindow().close();
  } catch {
    // Dev mode - Tauri API not available
  }
}

export function TopBar() {
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);

  return (
    <header
      className="h-12 flex items-center shrink-0 border-b"
      style={{
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
    >
      {/* Left: Logo */}
      <div className="flex items-center px-4 no-drag">
        <img
          src={themeLogo[theme]}
          alt=""
          className="h-7 w-7 mr-2 object-contain"
          style={{ filter: "drop-shadow(0 0 4px var(--accent-glow))" }}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
        <span
          className="font-display font-bold text-base tracking-widest select-none"
          style={{ color: "var(--accent)" }}
        >
          TAMASHII
        </span>
      </div>

      {/* Center: Draggable region for window movement */}
      <div className="flex-1 h-full drag-region" />

      {/* Right: Theme toggle + Window controls */}
      <div className="flex items-center gap-1 px-3 no-drag">
        {/* Theme toggle buttons */}
        <div className="flex items-center gap-1 mr-2">
          {themeOptions.map(({ theme: t, icon: Icon, label }) => {
            const isActive = theme === t;
            return (
              <button
                key={t}
                onClick={() => setTheme(t)}
                aria-label={`Switch to ${label} theme`}
                title={label}
                className="flex items-center justify-center rounded-full transition-all duration-150 cursor-pointer"
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: isActive
                    ? "var(--accent)"
                    : "var(--bg-card)",
                  border: isActive
                    ? "1px solid var(--accent)"
                    : "1px solid var(--border-color)",
                  boxShadow: isActive
                    ? "0 0 12px var(--accent-glow)"
                    : "none",
                  color: isActive
                    ? "var(--bg-primary)"
                    : "var(--text-secondary)",
                }}
              >
                <Icon size={14} />
              </button>
            );
          })}
        </div>

        {/* Window controls */}
        <button
          onClick={minimizeWindow}
          aria-label="Minimize window"
          className="flex items-center justify-center rounded transition-colors duration-150 cursor-pointer hover:opacity-80"
          style={{
            width: 32,
            height: 32,
            color: "var(--text-secondary)",
          }}
        >
          <Minus size={16} />
        </button>
        <button
          onClick={closeWindow}
          aria-label="Close window"
          className="flex items-center justify-center rounded transition-colors duration-150 cursor-pointer hover:opacity-80"
          style={{
            width: 32,
            height: 32,
            color: "var(--text-secondary)",
          }}
        >
          <X size={16} />
        </button>
      </div>
    </header>
  );
}
