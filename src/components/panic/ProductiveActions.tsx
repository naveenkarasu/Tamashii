import { Briefcase, Code, Footprints, BookOpen } from "lucide-react";
import { Card } from "../shared/Card";
import type { ReactNode } from "react";

interface ActionItem {
  label: string;
  icon: ReactNode;
  url?: string;
  fallbackText?: string;
}

const ACTIONS: ActionItem[] = [
  {
    label: "Job Search",
    icon: <Briefcase size={24} />,
    url: "https://www.indeed.com",
  },
  {
    label: "Code Practice",
    icon: <Code size={24} />,
    url: "https://leetcode.com",
  },
  {
    label: "Take a Walk",
    icon: <Footprints size={24} />,
    fallbackText: "Step away from the screen",
  },
  {
    label: "Read a Book",
    icon: <BookOpen size={24} />,
    url: "https://www.gutenberg.org",
  },
];

/**
 * Open a URL using Tauri shell if available, otherwise window.open.
 */
function openUrl(url: string) {
  window.open(url, "_blank", "noopener,noreferrer");
}

/**
 * ProductiveActions - Grid of redirect cards for productive activities.
 */
export function ProductiveActions() {
  const handleClick = (action: ActionItem) => {
    if (action.url) {
      openUrl(action.url);
    }
    // For items without a URL (e.g. "Take a Walk") we just display fallbackText.
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <h3 className="font-display text-base uppercase tracking-wider text-text-primary">
        Do Something Productive
      </h3>

      {/* 2x2 grid */}
      <div className="grid grid-cols-2 gap-3">
        {ACTIONS.map((action) => (
          <Card
            key={action.label}
            hoverable
            onClick={() => handleClick(action)}
            className="flex flex-col items-center gap-2 p-4"
          >
            {/* Icon */}
            <span className="text-accent">{action.icon}</span>

            {/* Label */}
            <span className="font-sans text-sm font-medium text-text-primary">
              {action.label}
            </span>

            {/* Fallback text for non-URL items */}
            {action.fallbackText && (
              <span className="font-sans text-xs text-text-secondary text-center leading-tight">
                {action.fallbackText}
              </span>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
