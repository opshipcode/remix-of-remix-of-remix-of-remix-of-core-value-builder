import { Link } from "react-router-dom";
import { ArrowUpRight, Eye, Inbox, Star, Wand2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { MOCK_ANALYTICS, MOCK_INQUIRIES, formatNumber } from "@/lib/mockData";
import { WorldMap, type CountryData } from "@/components/analytics/WorldMap";
import { AppPage } from "@/components/app/AppPage";

const OVERVIEW_DATA: CountryData[] = [
  { country: "NG", views: 4200, flag: "🇳🇬", name: "Nigeria" },
  { country: "KE", views: 1900, flag: "🇰🇪", name: "Kenya" },
  { country: "EG", views: 1100, flag: "🇪🇬", name: "Egypt" },
  { country: "ZA", views: 980, flag: "🇿🇦", name: "South Africa" },
  { country: "BR", views: 1700, flag: "🇧🇷", name: "Brazil" },
  { country: "AR", views: 600, flag: "🇦🇷", name: "Argentina" },
  { country: "JP", views: 1400, flag: "🇯🇵", name: "Japan" },
  { country: "IN", views: 2300, flag: "🇮🇳", name: "India" },
  { country: "DE", views: 1200, flag: "🇩🇪", name: "Germany" },
  { country: "FR", views: 850, flag: "🇫🇷", name: "France" },
  { country: "US", views: 5200, flag: "🇺🇸", name: "United States" },
  { country: "CA", views: 1800, flag: "🇨🇦", name: "Canada" },
  { country: "AU", views: 720, flag: "🇦🇺", name: "Australia" },
];

export default function AppOverview() {
  const user = useAuthStore((s) => s.user);
  return (
    <AppPage>
      <div className="space-y-8">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Welcome back</p>
            <h1 className="kp-display mt-1 text-3xl sm:text-4xl">{user?.displayName}</h1>
          </div>
          <a
            href={`/${user?.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background hover:opacity-90"
          >
            View my page <ArrowUpRight className="h-4 w-4" />
          </a>
        </header>

        <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-4 sm:gap-4">
          <Stat label="Views (7d)" v={formatNumber(MOCK_ANALYTICS.views7d)} />
          <Stat label="Views (30d)" v={formatNumber(MOCK_ANALYTICS.views30d)} />
          <Stat label="Unique visitors" v={formatNumber(MOCK_ANALYTICS.uniqueVisitors30d)} />
          <Stat label="New inquiries" v={String(MOCK_INQUIRIES.filter((i) => i.status === "new").length)} />
        </div>

        <div className="grid gap-3 md:grid-cols-3 sm:gap-4">
          <QuickAction to="/app/builder" icon={Wand2} title="Edit your page" desc="Builder, content blocks, and theme" />
          <QuickAction to="/app/inquiries" icon={Inbox} title="Inquiries" desc="Reply to brand requests" />
          <QuickAction to="/app/testimonials" icon={Star} title="Request a testimonial" desc="One-tap brand review link" />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="kp-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Recent views</h3>
              <Link to="/app/analytics" className="text-xs text-primary">View all</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {MOCK_ANALYTICS.recentViews.map((v, i) => (
                <li key={i} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                    {v.city}, {v.country}
                  </span>
                  <span className="text-xs text-muted-foreground">{v.at}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="kp-card p-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Latest inquiries</h3>
              <Link to="/app/inquiries" className="text-xs text-primary">View all</Link>
            </div>
            <ul className="mt-4 space-y-3">
              {MOCK_INQUIRIES.slice(0, 3).map((i) => (
                <li key={i.id} className="flex items-center justify-between text-sm">
                  <div className="min-w-0">
                    <p className="truncate font-medium">{i.brandName}</p>
                    <p className="truncate text-xs text-muted-foreground">{i.summary}</p>
                  </div>
                  <span
                    className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${
                      i.status === "new" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"
                    }`}
                  >
                    {i.status}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
        
        {/* Mini world map */}
        <div className="kp-card overflow-hidden p-5 sm:p-6">
          <div className="mb-3 flex items-baseline justify-between">
            <div>
              <h3 className="font-semibold">Page Visitors — Where they're from</h3>
              <p className="text-xs text-muted-foreground">Live snapshot of your global audience.</p>
            </div>
            <Link to="/app/analytics" className="text-xs text-primary hover:underline">
              View full analytics →
            </Link>
          </div>
          <div className="h-[220px] sm:h-[260px]">
            <WorldMap data={OVERVIEW_DATA} compact height="100%" />
          </div>
        </div>

      </div>
    </AppPage>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="kp-card p-5">
      <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="kp-display mt-2 text-3xl">{v}</p>
    </div>
  );
}

function QuickAction({ to, icon: Icon, title, desc }: { to: string; icon: typeof Wand2; title: string; desc: string }) {
  return (
    <Link to={to} className="kp-card kp-card-hover flex items-start gap-4 p-5">
      <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-highlight text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-semibold">{title}</p>
        <p className="text-sm text-muted-foreground">{desc}</p>
      </div>
    </Link>
  );
}
