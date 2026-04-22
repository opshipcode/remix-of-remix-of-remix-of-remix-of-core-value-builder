import { usePlanStore, type SubscriptionStatus } from "@/store/plan";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const SERVICES = [
  { n: "API", p99: "182ms", err: "0.04%", status: "healthy" },
  { n: "Edge functions", p99: "210ms", err: "0.11%", status: "healthy" },
  { n: "Database", p99: "38ms", err: "0.00%", status: "healthy" },
  { n: "Storage", p99: "120ms", err: "0.02%", status: "healthy" },
];

const QUOTAS = [
  { n: "Resend (email)", used: 42, limit: 100, unit: "k / day" },
  { n: "Cloudflare R2 (storage)", used: 312, limit: 1000, unit: "GB" },
  { n: "Maps API", used: 8, limit: 50, unit: "k / day" },
  { n: "YouTube API", used: 6800, limit: 10000, unit: "units / day" },
];

export default function AdminSystem() {
  const { status, jumpToState } = usePlanStore();
  const STATES: SubscriptionStatus[] = [
    "active", "trialing", "trial_expired", "grace_period", "expired", "cancelled",
  ];
  return (
    <>
      <h1 className="kp-display text-3xl">System health</h1>
      <p className="mt-2 text-sm text-muted-foreground">Live service status, error rates, and third-party quotas.</p>

      {/* Subscription state debug panel */}
      <div className="kp-card mt-6 border-warning/30 bg-warning/5 p-5">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-warning">Debug · Subscription state</p>
            <h2 className="kp-display mt-1 text-xl">Jump-to-state</h2>
            <p className="text-xs text-muted-foreground">
              Current: <span className="kp-mono">{status}</span>
            </p>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {STATES.map((s) => (
            <Button
              key={s}
              variant={s === status ? "default" : "outline"}
              size="sm"
              onClick={() => {
                jumpToState(s);
                toast({ title: `Subscription jumped`, description: `Now: ${s}` });
              }}
              className="rounded-full"
            >
              {s}
            </Button>
          ))}
        </div>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {SERVICES.map((s) => (
          <div key={s.n} className="kp-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">{s.n}</p>
              <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success capitalize">{s.status}</span>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">p99</p>
                <p className="kp-mono">{s.p99}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">Errors</p>
                <p className="kp-mono">{s.err}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="kp-card mt-8 p-6">
        <h2 className="text-lg font-semibold">Third-party quotas</h2>
        <div className="mt-5 space-y-5">
          {QUOTAS.map((q) => {
            const pct = Math.round((q.used / q.limit) * 100);
            return (
              <div key={q.n}>
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">{q.n}</p>
                  <p className="kp-mono text-xs text-muted-foreground">{q.used}/{q.limit} {q.unit}</p>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-surface-offset">
                  <div className={`h-full ${pct > 80 ? "bg-warning" : "bg-primary"}`} style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
}
