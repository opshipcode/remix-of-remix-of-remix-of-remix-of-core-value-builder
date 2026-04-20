import { Link } from "react-router-dom";
import { ArrowUpRight, Eye, Inbox, Star, Wand2 } from "lucide-react";
import { useAuthStore } from "@/store/auth";
import { MOCK_ANALYTICS, MOCK_INQUIRIES, formatNumber } from "@/lib/mockData";

export default function AppOverview() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <h1 className="kp-display mt-1 text-4xl">{user?.displayName}</h1>
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

      <div className="grid gap-4 md:grid-cols-4">
        <Stat label="Views (7d)" v={formatNumber(MOCK_ANALYTICS.views7d)} />
        <Stat label="Views (30d)" v={formatNumber(MOCK_ANALYTICS.views30d)} />
        <Stat label="Unique visitors" v={formatNumber(MOCK_ANALYTICS.uniqueVisitors30d)} />
        <Stat label="New inquiries" v={String(MOCK_INQUIRIES.filter(i => i.status === "new").length)} />
      </div>

      <div className="grid gap-4 md:grid-cols-3">
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
                <span className={`ml-3 shrink-0 rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.12em] ${i.status === "new" ? "bg-primary text-primary-foreground" : "bg-surface-2 text-muted-foreground"}`}>
                  {i.status}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
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
