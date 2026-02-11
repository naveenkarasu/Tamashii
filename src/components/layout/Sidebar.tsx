import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  Home,
  Shield,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Trophy,
  Settings,
} from "lucide-react";

interface NavItem {
  label: string;
  icon: typeof Home;
  path: string;
}

const topNavItems: NavItem[] = [
  { label: "Home", icon: Home, path: "/" },
  { label: "Blocker", icon: Shield, path: "/blocker" },
  { label: "Emergency", icon: AlertTriangle, path: "/panic" },
  { label: "Statistics", icon: BarChart3, path: "/stats" },
  { label: "Journal", icon: BookOpen, path: "/journal" },
  { label: "Achievements", icon: Trophy, path: "/achievements" },
];

const bottomNavItems: NavItem[] = [
  { label: "Settings", icon: Settings, path: "/settings" },
];

function isActive(currentPath: string, itemPath: string): boolean {
  if (itemPath === "/") {
    return currentPath === "/";
  }
  return currentPath.startsWith(itemPath);
}

export function Sidebar() {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <nav
      className="flex flex-col shrink-0 overflow-hidden transition-all duration-200 border-r"
      style={{
        width: expanded ? 200 : 56,
        backgroundColor: "var(--bg-card)",
        borderColor: "var(--border-color)",
      }}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      {/* Top navigation group */}
      <div className="flex flex-col gap-0.5 pt-2">
        {topNavItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            active={isActive(location.pathname, item.path)}
            expanded={expanded}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>

      {/* Bottom navigation group */}
      <div className="flex flex-col gap-0.5 mt-auto pb-2">
        {bottomNavItems.map((item) => (
          <SidebarItem
            key={item.path}
            item={item}
            active={isActive(location.pathname, item.path)}
            expanded={expanded}
            onClick={() => navigate(item.path)}
          />
        ))}
      </div>
    </nav>
  );
}

function SidebarItem({
  item,
  active,
  expanded,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  expanded: boolean;
  onClick: () => void;
}) {
  const Icon = item.icon;

  return (
    <button
      onClick={onClick}
      title={item.label}
      className="flex items-center gap-3 h-11 px-4 cursor-pointer transition-colors duration-150 relative"
      style={{
        color: active ? "var(--accent)" : "var(--text-secondary)",
        backgroundColor: active ? "var(--accent-glow)" : "transparent",
        borderLeft: active ? "3px solid var(--accent)" : "3px solid transparent",
      }}
    >
      <Icon size={20} className="shrink-0" />
      <span
        className="font-sans text-sm whitespace-nowrap transition-opacity duration-200"
        style={{
          opacity: expanded ? 1 : 0,
        }}
      >
        {item.label}
      </span>
    </button>
  );
}
