import { AppHeader, AppPage } from "@/components/app/AppPage";
import { MOCK_PLATFORMS, formatNumber, formatPercent } from "@/lib/mockData";
import { Music2, Instagram, Youtube, Plus, Unlink, RefreshCw } from "lucide-react";

const ICONS: Record<string, typeof Instagram> = {
  tiktok: Music2,
  instagram: Instagram,
  youtube: Youtube,
};

export default function Platforms() {
  return (
    <AppPage>
      <AppHeader
        title="Platforms"
        description="Connect your platforms so KitPager can verify follower counts, engagement, and recent uploads automatically."
        actions={
          <button className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
            <Plus className="h-4 w-4" /> Add platform
          </button>
        }
      />

      <div className="grid gap-4 md:grid-cols-3">
        {MOCK_PLATFORMS.map((p) => {
          const Icon = ICONS[p.platform] ?? Instagram;
          return (
            <div key={p.platform} className="kp-card p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold capitalize">{p.platform}</p>
                    <p className="kp-mono text-xs text-muted-foreground">{p.handle}</p>
                  </div>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">Connected</span>
              </div>
              <div className="mt-6 grid grid-cols-3 gap-3 text-sm">
                <Stat l="Followers" v={formatNumber(p.followers)} />
                <Stat l="Avg views" v={formatNumber(p.avgViews)} />
                <Stat l="ER" v={formatPercent(p.engagementRate)} />
              </div>
              <div className="mt-5 flex gap-2">
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-border px-3 py-2 text-xs hover:bg-surface-2">
                  <RefreshCw className="h-3.5 w-3.5" /> Refresh
                </button>
                <button className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-destructive/40 px-3 py-2 text-xs text-destructive hover:bg-destructive/10">
                  <Unlink className="h-3.5 w-3.5" /> Disconnect
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="kp-card mt-8 p-6">
        <h2 className="text-lg font-semibold">Manual entry fallback</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          OAuth disabled or platform unsupported? Enter handle and follower count manually — flagged as self-reported on your kit page.
        </p>
        <form className="mt-5 grid gap-4 md:grid-cols-[200px_1fr_1fr_auto]">
          <Field label="Platform" placeholder="TikTok" />
          <Field label="Handle" placeholder="@yourhandle" />
          <Field label="Followers" placeholder="120000" />
          <button className="self-end rounded-xl bg-foreground px-4 py-2.5 text-sm font-medium text-background">Add</button>
        </form>
      </div>
    </AppPage>
  );
}

function Stat({ l, v }: { l: string; v: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3 text-center">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{l}</p>
      <p className="kp-mono text-sm font-medium">{v}</p>
    </div>
  );
}

function Field({ label, placeholder }: { label: string; placeholder?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
