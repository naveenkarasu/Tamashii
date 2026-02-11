import { useMemo } from "react";

interface DayData {
  date: Date;
  dateStr: string;
  type: "streak" | "reset" | "none";
  intensity: number; // 0.3, 0.6, or 1.0
}

/** Generate 6 months of mock heatmap data. */
function generateMockData(): DayData[] {
  const today = new Date();
  const data: DayData[] = [];

  // Go back ~26 weeks (182 days)
  const start = new Date(today);
  start.setDate(start.getDate() - 181);

  // Simulate streak/reset patterns
  let inStreak = false;
  let streakLen = 0;

  for (let i = 0; i < 182; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);

    // Simple pseudo-random based on date
    const seed = d.getDate() * 13 + d.getMonth() * 7;

    if (!inStreak) {
      // 30% chance to start a streak each day
      if (seed % 10 < 3) {
        inStreak = true;
        streakLen = 1;
      }
    }

    let type: DayData["type"] = "none";
    let intensity = 0.3;

    if (inStreak) {
      type = "streak";
      intensity = streakLen <= 3 ? 0.3 : streakLen <= 10 ? 0.6 : 1.0;
      streakLen++;

      // End streak randomly
      const endSeed = (d.getDate() + i) * 17;
      if (endSeed % 20 < 2 && streakLen > 2) {
        inStreak = false;
        streakLen = 0;
        // Mark next day as reset (handled next iteration)
      }
    } else if (i > 0 && data[i - 1]?.type === "streak") {
      type = "reset";
    }

    data.push({
      date: d,
      dateStr: d.toISOString().slice(0, 10),
      type,
      intensity,
    });
  }

  return data;
}

const MONTH_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

const DAY_LABELS = ["Mon", "", "Wed", "", "Fri", "", "Sun"];

export function CalendarHeatmap() {
  const { grid, monthLabels } = useMemo(() => {
    const data = generateMockData();

    // Build a 7-row x 26-column grid
    // First, find the Monday on or before the start date
    const firstDate = data[0].date;
    const dayOfWeek = firstDate.getDay(); // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
    const gridStart = new Date(firstDate);
    gridStart.setDate(gridStart.getDate() - mondayOffset);

    // Build lookup map
    const lookup = new Map<string, DayData>();
    for (const d of data) {
      lookup.set(d.dateStr, d);
    }

    // Fill grid: columns (weeks) x rows (days Mon-Sun)
    const cols = 26;
    const cells: (DayData | null)[][] = [];
    const months: { label: string; col: number }[] = [];
    let lastMonth = -1;

    for (let col = 0; col < cols; col++) {
      const column: (DayData | null)[] = [];
      for (let row = 0; row < 7; row++) {
        const cellDate = new Date(gridStart);
        cellDate.setDate(cellDate.getDate() + col * 7 + row);
        const key = cellDate.toISOString().slice(0, 10);
        const entry = lookup.get(key) ?? null;

        // Track month labels (first occurrence of each month)
        if (cellDate.getMonth() !== lastMonth && row === 0) {
          months.push({ label: MONTH_NAMES[cellDate.getMonth()], col });
          lastMonth = cellDate.getMonth();
        }

        column.push(
          entry ?? {
            date: cellDate,
            dateStr: key,
            type: "none" as const,
            intensity: 0,
          },
        );
      }
      cells.push(column);
    }

    return { grid: cells, monthLabels: months };
  }, []);

  function getCellClasses(cell: DayData | null): string {
    if (!cell) return "bg-border/30";

    switch (cell.type) {
      case "streak":
        return `bg-success`;
      case "reset":
        return "bg-danger";
      default:
        return "bg-border/40";
    }
  }

  function getCellOpacity(cell: DayData | null): number {
    if (!cell || cell.type !== "streak") return 1;
    return cell.intensity;
  }

  return (
    <div>
      <h3 className="font-display text-xs uppercase tracking-wider text-accent mb-4">
        Activity
      </h3>

      <div className="overflow-x-auto">
        {/* Month labels */}
        <div className="flex ml-8 mb-1">
          {monthLabels.map((m, i) => (
            <span
              key={i}
              className="font-mono text-[10px] text-text-secondary"
              style={{
                position: "relative",
                left: `${m.col * 16}px`,
                marginRight: "-12px",
              }}
            >
              {m.label}
            </span>
          ))}
        </div>

        <div className="flex gap-0.5">
          {/* Day labels column */}
          <div className="flex flex-col gap-0.5 mr-1 shrink-0">
            {DAY_LABELS.map((label, i) => (
              <div
                key={i}
                className="h-[14px] w-6 flex items-center justify-end"
              >
                {label && (
                  <span className="font-mono text-[10px] text-text-secondary leading-none">
                    {label}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Grid columns (weeks) */}
          {grid.map((col, colIdx) => (
            <div key={colIdx} className="flex flex-col gap-0.5">
              {col.map((cell, rowIdx) => (
                <div
                  key={rowIdx}
                  className={[
                    "w-[14px] h-[14px] rounded-sm transition-colors duration-150",
                    getCellClasses(cell),
                  ].join(" ")}
                  style={{ opacity: getCellOpacity(cell) }}
                  title={cell?.dateStr ?? ""}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-3 mt-3 ml-8">
        <span className="font-mono text-[10px] text-text-secondary">Less</span>
        <div className="flex gap-0.5">
          <div className="w-[10px] h-[10px] rounded-sm bg-border/40" />
          <div className="w-[10px] h-[10px] rounded-sm bg-success opacity-30" />
          <div className="w-[10px] h-[10px] rounded-sm bg-success opacity-60" />
          <div className="w-[10px] h-[10px] rounded-sm bg-success" />
        </div>
        <span className="font-mono text-[10px] text-text-secondary">More</span>
        <div className="w-[10px] h-[10px] rounded-sm bg-danger ml-2" />
        <span className="font-mono text-[10px] text-text-secondary">Reset</span>
      </div>
    </div>
  );
}
