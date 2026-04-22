import { AtlasKit } from "@justphemi/atlas-kit";
import { useThemeStore } from "@/store/theme";

export interface CountryData {
  country: string;
  views: number;
  flag: string;
  name: string;
}

interface WorldMapProps {
  data: CountryData[];
  height?: number | string;
  /** When true, omits legend + tooltip — used for the small Overview map */
  compact?: boolean;
}

export function WorldMap({ data, height = 360, compact = false }: WorldMapProps): JSX.Element {
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === "dark";

  const allViews = data.map((d) => d.views);
  const sorted = [...allViews].sort((a, b) => b - a);
  const top20Threshold = sorted[Math.floor(sorted.length * 0.2)] ?? 0;
  const mid70Threshold = sorted[Math.floor(sorted.length * 0.7)] ?? 0;

  function getMarkerColor(views: number): string {
    if (views >= top20Threshold) return "#22c55e";
    if (views >= mid70Threshold) return "#eab308";
    return "#94a3b8";
  }

  const markers = data.map((d) => ({
    country: d.country,
    color: compact ? "#a5b4fc" : getMarkerColor(d.views),
    pulse: compact ? true : d.views >= top20Threshold,
    size: compact ? 4 : d.views >= top20Threshold ? 6 : 4,
    data: { views: d.views, name: d.name, flag: d.flag },
  }));

  const mapFill = isDark ? "#1f2937" : "#e2e8f0";
  const mapStroke = isDark ? "#374151" : "#cbd5e1";

  return (
    <div className="relative h-full w-full">
      <AtlasKit
        markers={markers}
        mapStyle={{ fill: mapFill, stroke: mapStroke, strokeWidth: 0.5 }}
        defaultDotColor="#a5b4fc"
        defaultDotSize={4}
        showTooltip={!compact}
        tooltip={{
          enabled: !compact,
          position: "auto",
          renderContent: (marker, countryName) => {
            const data = marker.data as { views?: number; name?: string; flag?: string } | undefined;
            return (
              <div className="rounded-lg border border-border bg-popover px-3 py-2 text-xs shadow-lg">
                <p className="font-semibold text-popover-foreground">
                  {data?.flag} {data?.name ?? countryName}
                </p>
                <p className="kp-mono text-muted-foreground">
                  {(data?.views ?? 0).toLocaleString()} views
                </p>
              </div>
            );
          },
        }}
        theme={{
          preset: isDark ? "dark" : "light",
          mapFill,
          tooltipBackground: "transparent",
        }}
        defaultAnimation={{ type: "pulse", duration: 1800, enabled: true }}
        style={{ width: "100%", height: typeof height === "number" ? `${height}px` : height, minHeight: "260px" }}
      />
      {!compact && (
        <div className="absolute bottom-2 left-2 flex items-center gap-3 rounded-full bg-background/80 px-3 py-1.5 text-[10px] font-medium backdrop-blur">
          <Legend color="#22c55e" label="High" />
          <Legend color="#eab308" label="Mid" />
          <Legend color="#94a3b8" label="Low" />
        </div>
      )}
    </div>
  );
}

function Legend({ color, label }: { color: string; label: string }): JSX.Element {
  return (
    <span className="flex items-center gap-1.5">
      <span className="h-2 w-2 rounded-full" style={{ background: color }} />
      <span className="text-muted-foreground">{label}</span>
    </span>
  );
}

/** Sorted countries list panel — used beside or below the map */
export function CountriesList({ data }: { data: CountryData[] }): JSX.Element {
  const sorted = [...data].sort((a, b) => b.views - a.views);
  const max = sorted[0]?.views ?? 1;
  return (
    <div className="kp-card flex h-full flex-col overflow-hidden">
      <div className="border-b border-border px-5 py-3">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Top Countries
        </p>
      </div>
      <ul className="flex-1 divide-y divide-border overflow-y-auto">
        {sorted.map((c) => {
          const pct = Math.round((c.views / max) * 100);
          return (
            <li key={c.country} className="flex items-center justify-between gap-3 px-5 py-3 text-sm">
              <span className="flex min-w-0 items-center gap-2">
                <span className="text-base">{c.flag}</span>
                <span className="truncate">{c.name}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="kp-mono text-xs text-muted-foreground">{c.views.toLocaleString()}</span>
                <span className="hidden h-1.5 w-16 overflow-hidden rounded-full bg-surface-2 sm:block">
                  <span
                    className="block h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}