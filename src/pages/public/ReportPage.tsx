import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  ensureSeedReports,
  formatTimeAgo,
  type CampaignReport,
  type ReportContent,
} from "@/lib/reports";
import { useKitPageStore, type PlatformId } from "@/store/kitPage";
import { useEffectivePlan } from "@/store/plan";
import {
  Music2,
  Instagram,
  Youtube,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  ShieldCheck,
  Lock,
} from "lucide-react";

const PLATFORM_ICON: Record<PlatformId, typeof Instagram> = {
  tiktok: Music2,
  instagram: Instagram,
  youtube: Youtube,
};

const PLATFORM_LABEL: Record<PlatformId, string> = {
  tiktok: "TikTok",
  instagram: "Instagram",
  youtube: "YouTube",
};

export default function ReportPage() {
  const { period, id } = useParams<{ period: string; id: string }>();
  const data = useKitPageStore((s) => s.data);
  const plan = useEffectivePlan();
  const [report, setReport] = useState<CampaignReport | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [pwInput, setPwInput] = useState("");
  const [shake, setShake] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const all = ensureSeedReports();
    const found = all.find((r) => r.period === period && r.id === id) ?? null;
    setReport(found);
  }, [period, id]);

  const totals = useMemo(() => {
    if (!report) return { views: 0, engagement: 0, er: 0 };
    let views = 0;
    let likes = 0;
    let comments = 0;
    let shares = 0;
    for (const c of report.contents) {
      views += c.views;
      likes += c.likes;
      comments += c.comments;
      shares += c.shares;
    }
    const engagement = likes + comments + shares;
    const er = views > 0 ? (engagement / views) * 100 : 0;
    return { views, engagement, er };
  }, [report]);

  if (!report) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background p-6 text-center">
        <div>
          <Logo size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">Report not found.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  if (report.passwordProtected && !unlocked) {
    const submit = () => {
      if (pwInput.trim() === report.passphrase) {
        setUnlocked(true);
        setError("");
      } else {
        setError("Wrong passphrase. Try again.");
        setShake(true);
        window.setTimeout(() => setShake(false), 500);
      }
    };
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background p-6">
        <div className="w-full max-w-sm text-center">
          <div className="grid place-items-center">
            <Logo size="lg" />
          </div>
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-warning/15 px-2.5 py-1 text-[11px] font-semibold text-warning">
            <Lock className="h-3 w-3" /> Protected report
          </div>
          <h1 className="kp-display mt-6 text-2xl">Enter passphrase</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This campaign report is password protected.
          </p>
          <input
            value={pwInput}
            onChange={(e) => setPwInput(e.target.value)}
            type="password"
            placeholder="Passphrase"
            onKeyDown={(e) => e.key === "Enter" && submit()}
            className={`mt-6 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${shake ? "animate-[shake_0.4s_ease-in-out]" : ""}`}
            style={shake ? { animation: "kpshake 0.4s ease-in-out" } : undefined}
          />
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <Button onClick={submit} className="mt-4 w-full" size="lg">
            Unlock report
          </Button>
          <style>{`@keyframes kpshake { 0%,100%{transform:translateX(0)} 25%{transform:translateX(-6px)} 50%{transform:translateX(6px)} 75%{transform:translateX(-3px)} }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
        <Logo size="md" />
        <div className="flex items-center gap-3">
          <span className="hidden text-xs uppercase tracking-[0.14em] text-muted-foreground sm:inline">
            Campaign Report
          </span>
          <ThemeToggle />
        </div>
      </header>

      <div className="border-b border-border px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-active text-base font-bold text-primary-foreground">
            {data.displayName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold">{data.displayName}</p>
            <p className="kp-mono truncate text-xs text-muted-foreground">
              {data.platforms.map((p) => p.handle).join(" · ")}
            </p>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <div>
          <h1 className="kp-display text-3xl md:text-5xl">{report.campaignLabel}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Generated {formatTimeAgo(report.createdAt)} · Stats last updated {formatTimeAgo(report.statsUpdatedAt)}
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <SummaryStat label="Total views" value={totals.views.toLocaleString()} />
          <SummaryStat label="Total engagement" value={totals.engagement.toLocaleString()} />
          <SummaryStat label="Engagement rate" value={`${totals.er.toFixed(2)}%`} />
          <SummaryStat label="Platforms" value={String(new Set(report.contents.map((c) => c.platform)).size)} />
        </div>

        <h2 className="kp-display mt-10 mb-4 text-xl">Content performance</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {report.contents.map((c, i) => (
            <ContentCard key={`${c.url}-${i}`} content={c} />
          ))}
        </div>

        {plan === "Free" && (
          <p className="mt-12 text-center text-xs text-muted-foreground">
            Powered by <Logo size="sm" /> — kitpager.co
          </p>
        )}
      </main>
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="kp-card p-5">
      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="kp-display mt-2 text-2xl">{value}</p>
    </div>
  );
}

function ContentCard({ content }: { content: ReportContent }) {
  const Icon = content.platform ? PLATFORM_ICON[content.platform] : null;
  const label = content.platform ? PLATFORM_LABEL[content.platform] : "Web";
  const er = content.views > 0
    ? (((content.likes + content.comments + content.shares) / content.views) * 100).toFixed(2)
    : "0.00";
  return (
    <div className="kp-card overflow-hidden">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          {Icon ? <Icon className="h-4 w-4" /> : null}
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
          <ShieldCheck className="h-2.5 w-2.5" /> Verified via {label}
        </span>
      </div>
      <div className="aspect-video w-full bg-surface-2 grid place-items-center text-xs text-muted-foreground">
        thumbnail
      </div>
      <div className="grid grid-cols-4 gap-2 p-4">
        <Mini icon={Eye} label="Views" value={fmt(content.views)} />
        <Mini icon={Heart} label="Likes" value={fmt(content.likes)} />
        <Mini icon={MessageCircle} label="Comm." value={fmt(content.comments)} />
        <Mini icon={Share2} label="Shares" value={fmt(content.shares)} />
      </div>
      <div className="flex items-center justify-between border-t border-border px-4 py-3 text-xs text-muted-foreground">
        <span>ER {er}%</span>
        <span>Posted {formatTimeAgo(content.postedAt)}</span>
      </div>
    </div>
  );
}

function Mini({ icon: Icon, label, value }: { icon: typeof Eye; label: string; value: string }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <p className="kp-mono mt-1 text-sm font-semibold">{value}</p>
      <p className="text-[9px] uppercase tracking-[0.1em] text-muted-foreground">{label}</p>
    </div>
  );
}

function fmt(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}
