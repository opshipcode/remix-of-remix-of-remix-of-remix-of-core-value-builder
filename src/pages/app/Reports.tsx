import { useEffect, useMemo, useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { useEffectivePlan } from "@/store/plan";
import {
  type CampaignReport,
  detectPlatformFromUrl,
  ensureSeedReports,
  formatTimeAgo,
  genPeriod,
  genReportId,
  hoursSince,
  isExpired,
  loadReports,
  saveReports,
} from "@/lib/reports";
import { toast } from "@/hooks/use-toast";
import {
  Plus,
  Copy,
  Trash2,
  ExternalLink,
  Music2,
  Instagram,
  Youtube,
  Lock,
  Globe,
  LayoutGrid,
  List,
} from "lucide-react";
import type { PlatformId } from "@/store/kitPage";

const PLATFORM_ICON: Record<PlatformId, typeof Instagram> = {
  tiktok: Music2,
  instagram: Instagram,
  youtube: Youtube,
};

function useIsMobile() {
  const [m, setM] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const upd = () => setM(mq.matches);
    upd();
    mq.addEventListener("change", upd);
    return () => mq.removeEventListener("change", upd);
  }, []);
  return m;
}

export default function Reports() {
  const plan = useEffectivePlan();
  const [reports, setReports] = useState<CampaignReport[]>([]);
  const [open, setOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const isMobile = useIsMobile();

  useEffect(() => {
    setReports(ensureSeedReports());
  }, []);

  const activeCount = useMemo(
    () => reports.filter((r) => !isExpired(r)).length,
    [reports],
  );
  const freeLocked = plan === "Free" && activeCount >= 1;

  const refreshRateBadge =
    plan === "Pro" ? "Updates every 1h" : plan === "Creator" ? "Every 6h" : "Every 24h";

  const refresh = () => setReports(loadReports());

  const handleDelete = (r: CampaignReport) => {
    const next = reports.filter((x) => x.id !== r.id);
    setReports(next);
    saveReports(next);
    toast({ title: "Report deleted", description: r.campaignLabel });
  };

  const handleNew = () => {
    if (freeLocked) {
      window.dispatchEvent(
        new CustomEvent<{ targetPlan: "Creator"; featureName: string }>(
          "kp:upgrade",
          { detail: { targetPlan: "Creator", featureName: "Unlimited reports" } },
        ),
      );
      return;
    }
    setOpen(true);
  };

  const newButton = (
    <Button onClick={handleNew} className="rounded-full">
      <Plus className="h-4 w-4" />
      New report
      {freeLocked ? <Lock className="h-3 w-3" /> : null}
    </Button>
  );

  // Moved viewToggle inside the component scope as a JSX element, not a function
  const viewToggle = (
    <div className="flex items-center gap-1 rounded-full border border-border bg-surface p-1">
      <button
        onClick={() => setViewMode("grid")}
        className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
          viewMode === "grid" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="Grid view"
      >
        <LayoutGrid className="h-4 w-4" />
      </button>
      <button
        onClick={() => setViewMode("list")}
        className={`grid h-8 w-8 place-items-center rounded-full transition-colors ${
          viewMode === "list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
        }`}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </button>
    </div>
  );

  const headerActions = (
    <div className="flex items-center gap-3">
      {viewToggle}
      {newButton}
    </div>
  );

  return (
    <AppPage>
      <AppHeader
        title="Reports"
        description="Share live campaign performance with brands. Stats update automatically."
        actions={headerActions}
      />

      {reports.length === 0 ? (
        <div className="kp-card grid place-items-center p-12 text-center">
          <p className="text-sm text-muted-foreground">No reports yet.</p>
          <Button onClick={handleNew} className="mt-4 rounded-full">
            <Plus className="h-4 w-4" /> Create your first
          </Button>
        </div>
      ) : (
        <div className={`gap-4 ${
          viewMode === "grid" 
            ? "grid grid-cols-1 sm:grid-cols-2" 
            : "flex flex-col"
        }`}>
          {reports.map((r) => (
            <ReportCard
              key={r.id}
              report={r}
              refreshRateBadge={refreshRateBadge}
              onDelete={() => handleDelete(r)}
            />
          ))}
        </div>
      )}

      {isMobile ? (
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetContent side="bottom" className="max-h-[90vh] overflow-y-auto">
            <SheetHeader>
              <SheetTitle>New report</SheetTitle>
              <SheetDescription>
                Add up to 3 content URLs. Stats refresh automatically.
              </SheetDescription>
            </SheetHeader>
            <NewReportForm
              onCreate={(r) => {
                const next = [r, ...reports];
                setReports(next);
                saveReports(next);
                setOpen(false);
              }}
            />
            <SheetFooter />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>New report</DialogTitle>
              <DialogDescription>
                Add up to 3 content URLs. Stats refresh automatically.
              </DialogDescription>
            </DialogHeader>
            <NewReportForm
              onCreate={(r) => {
                const next = [r, ...reports];
                setReports(next);
                saveReports(next);
                setOpen(false);
              }}
            />
            <DialogFooter />
          </DialogContent>
        </Dialog>
      )}
      <span className="hidden">{refresh.length}</span>
    </AppPage>
  );
}

// Rest of the code (ReportCard, NewReportForm) remains exactly the same
function ReportCard({
  report,
  refreshRateBadge,
  onDelete,
}: {
  report: CampaignReport;
  refreshRateBadge: string;
  onDelete: () => void;
}) {
  const expired = isExpired(report);
  const url = `kitpager.co/watch/${report.period}/${report.id}`;
  const ageHours = hoursSince(report.createdAt);
  const deletionLocked = ageHours < 24;
  const hoursToWait = Math.ceil(24 - ageHours);

  const copyLink = () => {
    navigator.clipboard.writeText(`https://${url}`);
    toast({ title: "Link copied" });
  };

  return (
    <div className="kp-card flex flex-col gap-3 p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="text-base font-semibold leading-tight">{report.campaignLabel}</h3>
          <p className="kp-mono mt-1 truncate text-xs text-muted-foreground">{url}</p>
        </div>
        <div className="flex flex-wrap justify-end gap-1">
          {report.passwordProtected ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] text-warning">
              <Lock className="h-2.5 w-2.5" />
              Protected
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] text-success">
              <Globe className="h-2.5 w-2.5" /> Public
            </span>
          )}
          <span
            className={`rounded-full px-2 py-0.5 text-[10px] ${
              expired ? "bg-muted text-muted-foreground" : "bg-success/15 text-success"
            }`}
          >
            {expired ? "Expired" : "Active"}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {report.contents.map((c, i) => {
          if (!c.platform) return null;
          const Icon = PLATFORM_ICON[c.platform];
          return (
            <span
              key={`${c.url}-${i}`}
              className="grid h-7 w-7 place-items-center rounded-full bg-surface-2"
            >
              <Icon className="h-3.5 w-3.5" />
            </span>
          );
        })}
        <span className="ml-auto text-xs text-muted-foreground">
          {report.views.toLocaleString()} views
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 text-[10px] uppercase tracking-[0.1em] text-muted-foreground">
        <span>Created {formatTimeAgo(report.createdAt)}</span>
        <span>·</span>
        <span>{refreshRateBadge}</span>
      </div>

      <div className="flex flex-wrap gap-2 border-t border-border pt-3">
        <Button size="sm" variant="outline" className="flex-1" onClick={copyLink}>
          <Copy className="h-3.5 w-3.5" /> Copy link
        </Button>
        <Button asChild size="sm" variant="outline" className="flex-1">
          <a href={`/watch/${report.period}/${report.id}`} target="_blank" rel="noreferrer">
            <ExternalLink className="h-3.5 w-3.5" /> Open
          </a>
        </Button>
        {deletionLocked ? (
          <TooltipProvider delayDuration={150}>
            <Tooltip>
              <TooltipTrigger asChild>
                <span
                  className="inline-flex h-9 cursor-not-allowed items-center gap-1.5 rounded-md border border-border px-3 text-xs text-muted-foreground opacity-60"
                  aria-disabled
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </span>
              </TooltipTrigger>
              <TooltipContent>
                This report was shared recently. Deletable in {hoursToWait}h.
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ) : (
          <Button
            size="sm"
            variant="outline"
            className="border-destructive/40 text-destructive hover:bg-destructive/10"
            onClick={onDelete}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        )}
      </div>
    </div>
  );
}

function NewReportForm({ onCreate }: { onCreate: (r: CampaignReport) => void }) {
  const plan = useEffectivePlan();
  const [label, setLabel] = useState("");
  const [urls, setUrls] = useState<string[]>([""]);
  const [protectedToggle, setProtectedToggle] = useState(false);
  const [passphrase, setPassphrase] = useState("");
  const [loading, setLoading] = useState(false);

  const setUrl = (i: number, v: string) => {
    setUrls((arr) => arr.map((x, idx) => (idx === i ? v : x)));
  };
  const addUrl = () => {
    if (urls.length >= 3) return;
    setUrls((arr) => [...arr, ""]);
  };

  const submit = () => {
    if (!label.trim()) {
      toast({ title: "Add a campaign label", variant: "destructive" });
      return;
    }
    const validUrls = urls.map((u) => u.trim()).filter(Boolean);
    if (validUrls.length === 0) {
      toast({ title: "Add at least one content URL", variant: "destructive" });
      return;
    }

    setLoading(true);
    window.setTimeout(() => {
      const id = genReportId();
      const period = genPeriod();
      const expiresAt =
        plan === "Free"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
          : null;
      const report: CampaignReport = {
        id,
        period,
        campaignLabel: label.trim(),
        contents: validUrls.map((u) => ({
          url: u,
          platform: detectPlatformFromUrl(u),
          views: Math.floor(20000 + Math.random() * 800000),
          likes: Math.floor(2000 + Math.random() * 60000),
          comments: Math.floor(50 + Math.random() * 4000),
          shares: Math.floor(20 + Math.random() * 1500),
          postedAt: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString(),
          thumbnailUrl: null,
        })),
        passwordProtected: protectedToggle,
        passphrase: protectedToggle ? passphrase : "",
        views: 0,
        createdAt: new Date().toISOString(),
        expiresAt,
        statsUpdatedAt: new Date().toISOString(),
      };
      onCreate(report);
      const url = `kitpager.co/watch/${period}/${id}`;
      toast({
        title: "Report created",
        description: url,
      });
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="mt-4 space-y-4">
      <div>
        <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Campaign label
        </label>
        <input
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="Glossier Spring 2026"
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Content URLs
        </label>
        <div className="mt-1.5 space-y-2">
          {urls.map((u, i) => {
            const platform = detectPlatformFromUrl(u);
            const Icon = platform ? PLATFORM_ICON[platform] : null;
            return (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={u}
                  onChange={(e) => setUrl(i, e.target.value)}
                  placeholder="https://www.tiktok.com/@you/video/..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                {Icon ? (
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-surface-2">
                    <Icon className="h-4 w-4" />
                  </span>
                ) : null}
              </div>
            );
          })}
        </div>
        {urls.length < 3 && (
          <button
            type="button"
            onClick={addUrl}
            className="mt-2 text-xs text-primary hover:underline"
          >
            + Add URL ({urls.length}/3)
          </button>
        )}
      </div>

      <div className="flex items-center justify-between rounded-xl border border-border bg-surface px-4 py-3">
        <div>
          <p className="text-sm font-medium">Password protected</p>
          <p className="text-xs text-muted-foreground">Require a passphrase to view</p>
        </div>
        <Switch checked={protectedToggle} onCheckedChange={setProtectedToggle} />
      </div>

      {protectedToggle && (
        <input
          value={passphrase}
          onChange={(e) => setPassphrase(e.target.value)}
          placeholder="Passphrase"
          className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      )}

      <Button
        loaderClick
        isLoading={loading}
        onClick={submit}
        className="w-full"
        size="lg"
      >
        Generate report
      </Button>
    </div>
  );
}