import { useNavigate } from "react-router";
import { Trophy, Shield, BookOpen } from "lucide-react";
import { useStreakStore } from "../../store/streakStore";
import { useBlockerStore } from "../../store/blockerStore";
import { Card } from "../shared/Card";
import type { ComponentType, SVGProps } from "react";

interface StatItem {
  label: string;
  value: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number | string }>;
  route: string;
}

export function QuickStats() {
  const navigate = useNavigate();
  const bestStreakDays = useStreakStore((s) => s.bestStreakDays);
  const categories = useBlockerStore((s) => s.categories);

  const totalDomains = categories.reduce(
    (sum, cat) => sum + cat.domainCount,
    0,
  );

  const stats: StatItem[] = [
    {
      label: "Best Streak",
      value: `${bestStreakDays} days`,
      Icon: Trophy,
      route: "/stats",
    },
    {
      label: "Blocked",
      value: `${totalDomains} domains`,
      Icon: Shield,
      route: "/blocker",
    },
    {
      label: "Journal",
      value: "12 entries",
      Icon: BookOpen,
      route: "/journal",
    },
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          hoverable
          onClick={() => navigate(stat.route)}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <span className="font-display text-[10px] uppercase text-text-secondary tracking-wider">
              {stat.label}
            </span>
            <stat.Icon size={16} className="text-accent" />
          </div>
          <span className="font-sans text-2xl font-bold text-text-primary">
            {stat.value}
          </span>
        </Card>
      ))}
    </div>
  );
}
