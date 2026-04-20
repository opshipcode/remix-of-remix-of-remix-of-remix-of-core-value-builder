import { Users, DollarSign, AlertTriangle, TrendingUp, Eye } from "lucide-react";

const STATS = [
  { l: "Signups today", v: "42", d: "+8 vs yesterday", icon: Users },
  { l: "Active paid users", v: "1,284", d: "+24 this week", icon: DollarSign },
  { l: "Churn — 30d", v: "2.4%", d: "−0.3%", icon: TrendingUp },
  { l: "Email failures", v: "3", d: "in last 24h", icon: AlertTriangle },
];

const TOP = [
  { slug: "alexrivera", views: 18420 },
  { slug: "miraokafor", views: 9120 },
  { slug: "saraellis", views: 7240 },
  { slug: "lucayama", views: 6840 },
  { slug: "jordanchen", views: 5210 },
];

export default function AdminOverview() {
  return (
    <>
      <div>
        <h1 className="kp-display text-3xl">Admin overview</h1>
        <p className="mt-2 text-sm text-muted-foreground">Real-time platform health and growth.</p>
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-4">
        {STATS.map((s) => (
          <div key={s.l} className="kp-card p-5">
            <div className="flex items-start justify-between">
              <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{s.l}</p>
              <s.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="kp-display mt-2 text-3xl">{s.v}</p>
            <p className="mt-1 text-xs text-muted-foreground">{s.d}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="kp-card p-6">
          <h2 className="text-lg font-semibold">Signups (30d)</h2>
          <div className="mt-6 flex h-44 items-end gap-1">
            {Array.from({ length: 30 }).map((_, i) => {
              const h = 24 + Math.round(Math.cos(i / 3) * 30 + Math.random() * 32);
              return <div key={i} className="flex-1 rounded-t bg-primary/70" style={{ height: `${h + 30}%` }} />;
            })}
          </div>
        </div>
        <div className="kp-card p-6">
          <h2 className="text-lg font-semibold flex items-center gap-2"><Eye className="h-4 w-4" /> Top creator pages (30d)</h2>
          <ul className="mt-4 divide-y divide-border">
            {TOP.map((t) => (
              <li key={t.slug} className="flex items-center justify-between py-3 text-sm">
                <span className="kp-mono text-muted-foreground">/{t.slug}</span>
                <span className="font-medium">{t.views.toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
}
