import { useEffect, useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useTheme } from "@/store/theme";

type RangeId = "24h" | "7d" | "30d" | "90d" | "custom";

interface DataPoint {
  label: string;
  views: number;
}

const RANGES: { id: RangeId; label: string }[] = [
  { id: "24h", label: "24h" },
  { id: "7d", label: "7d" },
  { id: "30d", label: "30d" },
  { id: "90d", label: "90d" },
  { id: "custom", label: "Custom" },
];

function dayLabel(d: Date): string {
  return d.toLocaleDateString("en-US", { weekday: "short" });
}
function monthDay(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function pseudoSeed(i: number, seed: number): number {
  // deterministic pseudo-random so the chart doesn't reshuffle each render
  const x = Math.sin(i * 12.9898 + seed * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

function generateData(
  range: RangeId,
  customFrom: string,
  customTo: string,
): DataPoint[] {
  const out: DataPoint[] = [];
  const base = 80;
  if (range === "24h") {
    for (let h = 0; h < 24; h++) {
      out.push({
        label: h % 4 === 0 ? `${String(h).padStart(2, "0")}:00` : "",
        views: Math.round(base * 0.4 + pseudoSeed(h, 1) * base * 1.4),
      });
    }
    return out;
  }
  if (range === "7d") {
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      out.push({
        label: dayLabel(d),
        views: Math.round(base * 1.5 + pseudoSeed(i, 2) * base * 2),
      });
    }
    return out;
  }
  if (range === "30d") {
    const now = new Date();
    for (let i = 29; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      out.push({
        label: i % 5 === 0 ? monthDay(d) : "",
        views: Math.round(base * 1.2 + pseudoSeed(i, 3) * base * 2.2),
      });
    }
    return out;
  }
  if (range === "90d") {
    const now = new Date();
    for (let w = 12; w >= 0; w--) {
      const d = new Date(now);
      d.setDate(d.getDate() - w * 7);
      out.push({
        label: monthDay(d),
        views: Math.round(base * 6 + pseudoSeed(w, 4) * base * 8),
      });
    }
    return out;
  }
  // custom
  const from = new Date(customFrom);
  const to = new Date(customTo);
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || to < from) {
    return out;
  }
  const days = Math.max(
    1,
    Math.round((to.getTime() - from.getTime()) / (24 * 3600_000)) + 1,
  );
  if (days > 60) {
    const weeks = Math.ceil(days / 7);
    for (let w = 0; w < weeks; w++) {
      const d = new Date(from);
      d.setDate(d.getDate() + w * 7);
      out.push({
        label: monthDay(d),
        views: Math.round(base * 6 + pseudoSeed(w, 5) * base * 8),
      });
    }
    return out;
  }
  for (let i = 0; i < days; i++) {
    const d = new Date(from);
    d.setDate(d.getDate() + i);
    const showLabel = days <= 14 ? true : i % Math.ceil(days / 8) === 0;
    out.push({
      label: showLabel ? monthDay(d) : "",
      views: Math.round(base * 1.2 + pseudoSeed(i, 6) * base * 2.2),
    });
  }
  return out;
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}
function isoDaysAgo(n: number): string {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString().slice(0, 10);
}

interface TooltipPayloadItem {
  value: number;
  payload: DataPoint;
}

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const d = payload[0];
  return (
    <div className="kp-glass rounded-lg border border-border px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-foreground">{label || "—"}</p>
      <p className="kp-mono mt-0.5 text-muted-foreground">
        {d.value.toLocaleString()} views
      </p>
    </div>
  );
}

export function VisitorTimelineChart() {
  const theme = useTheme();
  const [range, setRange] = useState<RangeId>("7d");
  const [from, setFrom] = useState<string>(isoDaysAgo(14));
  const [to, setTo] = useState<string>(todayISO());
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((k) => k + 1);
  }, [range, from, to]);

  const data = useMemo(
    () => generateData(range, from, to),
    [range, from, to],
  );

  const isDark = theme === "dark";
  const gridStroke = isDark ? "rgba(148,163,184,0.12)" : "rgba(15,23,42,0.08)";
  const axisColor = isDark ? "rgba(148,163,184,0.7)" : "rgba(15,23,42,0.55)";

  return (
    <div className="kp-card p-5 sm:p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline sm:justify-between">
        <div>
          <h2 className="text-lg font-semibold">Visitor timeline</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Choose a range to see views over time.
          </p>
        </div>

        {/* Range pills */}
        <div className="-mx-1 flex flex-wrap items-center gap-1 sm:flex-nowrap">
          {RANGES.map((r) => {
            const active = range === r.id;
            return (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                  active
                    ? "bg-foreground text-background"
                    : "border border-border bg-surface text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.label}
              </button>
            );
          })}
        </div>
      </div>

      {range === "custom" && (
        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center">
          <label className="flex flex-1 items-center gap-2 text-xs text-muted-foreground">
            <span>From</span>
            <input
              type="date"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            />
          </label>
          <label className="flex flex-1 items-center gap-2 text-xs text-muted-foreground">
            <span>To</span>
            <input
              type="date"
              value={to}
              min={from}
              max={todayISO()}
              onChange={(e) => setTo(e.target.value)}
              className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-xs text-foreground outline-none focus:border-primary"
            />
          </label>
        </div>
      )}

      <div className="mt-4" key={animKey}>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart
            data={data}
            margin={{ top: 8, right: 4, left: -12, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke={gridStroke}
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              interval={0}
            />
            <YAxis
              tick={{ fill: axisColor, fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ fill: "hsl(var(--primary) / 0.08)" }}
            />
            <Bar
              dataKey="views"
              fill="hsl(var(--primary))"
              fillOpacity={0.8}
              radius={[4, 4, 0, 0]}
              isAnimationActive
              animationDuration={200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
