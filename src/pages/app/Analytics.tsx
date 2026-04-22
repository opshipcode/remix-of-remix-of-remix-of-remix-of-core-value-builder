import { AppHeader, AppPage } from "@/components/app/AppPage";
import { MOCK_ANALYTICS, formatNumber } from "@/lib/mockData";
import { useAuthStore } from "@/store/auth";
import { Lock, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { WorldMap, CountriesList, type CountryData } from "@/components/analytics/WorldMap";

const COUNTRY_DATA: CountryData[] = [
  { country: "US", views: 12400, flag: "🇺🇸", name: "United States" },
  { country: "NG", views: 8200, flag: "🇳🇬", name: "Nigeria" },
  { country: "GB", views: 4100, flag: "🇬🇧", name: "United Kingdom" },
  { country: "CA", views: 3800, flag: "🇨🇦", name: "Canada" },
  { country: "GH", views: 2900, flag: "🇬🇭", name: "Ghana" },
  { country: "IN", views: 2400, flag: "🇮🇳", name: "India" },
  { country: "AU", views: 1900, flag: "🇦🇺", name: "Australia" },
  { country: "DE", views: 1600, flag: "🇩🇪", name: "Germany" },
  { country: "BR", views: 1400, flag: "🇧🇷", name: "Brazil" },
  { country: "ZA", views: 1100, flag: "🇿🇦", name: "South Africa" },
  { country: "FR", views: 900, flag: "🇫🇷", name: "France" },
  { country: "KE", views: 780, flag: "🇰🇪", name: "Kenya" },
  { country: "JP", views: 640, flag: "🇯🇵", name: "Japan" },
  { country: "MX", views: 520, flag: "🇲🇽", name: "Mexico" },
  { country: "SG", views: 380, flag: "🇸🇬", name: "Singapore" },
];

export default function Analytics() {
  const isPro = useAuthStore((s) => s.user?.plan === "pro" || s.user?.plan === "creator");

  return (
    <AppPage>
      <AppHeader
        title="Analytics"
        description="Visitor activity for your KitPager page — refreshed every minute."
      />

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
        <Stat label="Views — 7d" value={formatNumber(MOCK_ANALYTICS.views7d)} delta="+12%" />
        <Stat label="Views — 30d" value={formatNumber(MOCK_ANALYTICS.views30d)} delta="+34%" />
        <Stat label="Unique visitors" value={formatNumber(MOCK_ANALYTICS.uniqueVisitors30d)} delta="+18%" />
        <Stat label="Avg time on page" value="2m 14s" delta="+0:09" />
      </div>

      {/* Map + countries list — fixed heights, internal scroll on countries */}
      <div className="mt-6 grid gap-4 lg:h-[420px] lg:grid-cols-[1.6fr_1fr]">
        <div className="kp-card relative flex h-[280px] flex-col overflow-hidden p-4 sm:p-6 lg:h-full">
          <div className="mb-4 flex items-baseline justify-between">
            <h2 className="text-lg font-semibold">Visitors by country</h2>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </div>
          <div className="relative min-h-0 flex-1">
            <WorldMap data={COUNTRY_DATA} height="100%" />
          </div>
          {!isPro && <BlurGate />}
        </div>
        <div className="h-[320px] overflow-hidden lg:h-full">
          <div className="h-full overflow-y-auto">
            <CountriesList data={COUNTRY_DATA} />
          </div>
        </div>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.4fr_1fr]">
        <div className="kp-card relative p-6">
          <h2 className="text-lg font-semibold">Visitor timeline</h2>
          <p className="mt-1 text-sm text-muted-foreground">Last 30 days</p>
          <div className="mt-6 flex h-44 items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = 24 + Math.round(Math.sin(i / 2) * 28 + Math.random() * 30);
              return <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${h + 30}%` }} />;
            })}
          </div>
          {!isPro && <BlurGate />}
        </div>

        <div className="kp-card relative p-6">
          <h2 className="text-lg font-semibold">Top referrers</h2>
          <ul className="mt-4 divide-y divide-border">
            {MOCK_ANALYTICS.topReferrers.map((r) => (
              <li key={r.source} className="flex items-center justify-between py-2.5 text-sm">
                <span className="kp-mono text-muted-foreground">{r.source}</span>
                <span className="font-medium">{r.count.toLocaleString()}</span>
              </li>
            ))}
          </ul>
          {!isPro && <BlurGate />}
        </div>
      </div>

      <div className="mt-6 kp-card relative p-6">
        <h2 className="text-lg font-semibold">Recent visits</h2>
        <ul className="mt-4 grid gap-2.5 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_ANALYTICS.recentViews.map((v, i) => (
            <li key={i} className="flex items-center justify-between rounded-xl bg-surface-2 px-3 py-2">
              <span className="truncate">{v.city}, {v.country}</span>
              <span className="ml-2 text-xs text-muted-foreground">{v.at}</span>
            </li>
          ))}
        </ul>
        {!isPro && <BlurGate />}
      </div>
    </AppPage>
  );
}

function Stat({ label, value, delta }: { label: string; value: string; delta: string }) {
  return (
    <div className="kp-card p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="kp-display mt-2 text-3xl">{value}</p>
      <p className="mt-1 text-xs text-success">{delta}</p>
    </div>
  );
}

function BlurGate() {
  return (
    <div className="absolute inset-0 grid place-items-center rounded-2xl backdrop-blur-md bg-background/40">
      <div className="text-center">
        <span className="grid mx-auto h-10 w-10 place-items-center rounded-full bg-primary text-primary-foreground">
          <Lock className="h-4 w-4" />
        </span>
        <p className="mt-3 text-sm font-medium">Upgrade to Pro</p>
        <p className="mt-1 text-xs text-muted-foreground">See full analytics, country breakdown, referrers.</p>
        <Link to="/pricing" className="mt-4 inline-flex items-center gap-1 rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-hover">
          <Sparkles className="h-3.5 w-3.5" /> Upgrade
        </Link>
      </div>
    </div>
  );
}
