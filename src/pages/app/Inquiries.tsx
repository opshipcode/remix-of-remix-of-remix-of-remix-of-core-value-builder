import { useEffect, useMemo, useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { AppPageSkeleton } from "@/components/kit/AppPageSkeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Mail, Phone, ArrowRight, CheckCheck, Download, AlertTriangle, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  loadInquiries,
  saveInquiries,
  inquiriesToCSV,
  type Inquiry,
  type InquiryStatus,
} from "@/lib/inquiryStorage";

type Tab = InquiryStatus;

export default function Inquiries() {
  const { loading } = usePageLoader();
  const [items, setItems] = useState<Inquiry[]>([]);
  const [tab, setTab] = useState<Tab>("unread");
  const [activeId, setActiveId] = useState<string>("");
  const [completeOpen, setCompleteOpen] = useState(false);
  const [amount, setAmount] = useState<string>("");
  const [closing, setClosing] = useState(false);
  const [moving, setMoving] = useState(false);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    setItems(loadInquiries());
  }, []);

  const filtered = useMemo(() => items.filter((i) => i.status === tab), [items, tab]);

  const counts = useMemo(
    () => ({
      unread: items.filter((i) => i.status === "unread").length,
      in_progress: items.filter((i) => i.status === "in_progress").length,
      completed: items.filter((i) => i.status === "completed").length,
    }),
    [items],
  );

  const totalEarnings = useMemo(
    () =>
      items
        .filter((i) => i.status === "completed")
        .reduce((sum, i) => sum + (i.amountPaidUSD ?? 0), 0),
    [items],
  );
  const completedCount = counts.completed;

  // Reminder banners
  const overdueUnread = useMemo(
    () =>
      items.filter(
        (i) =>
          i.status === "unread" &&
          Date.now() - new Date(i.receivedAt).getTime() > 24 * 60 * 60 * 1000,
      ).length,
    [items],
  );
  const stalledInProgress = useMemo(
    () =>
      items.filter(
        (i) =>
          i.status === "in_progress" &&
          i.movedToInProgressAt &&
          Date.now() - new Date(i.movedToInProgressAt).getTime() > 7 * 24 * 60 * 60 * 1000,
      ).length,
    [items],
  );

  const active = filtered.find((i) => i.id === activeId) ?? filtered[0] ?? null;

  if (loading) {
    return (
      <AppPage>
        <AppPageSkeleton cards={3} />
      </AppPage>
    );
  }

  const persist = (next: Inquiry[]) => {
    setItems(next);
    saveInquiries(next);
  };

  const handleMoveToInProgress = (inquiry: Inquiry) => {
    setMoving(true);
    window.setTimeout(() => {
      const next = items.map((i) =>
        i.id === inquiry.id
          ? {
              ...i,
              status: "in_progress" as InquiryStatus,
              movedToInProgressAt: new Date().toISOString(),
            }
          : i,
      );
      persist(next);
      setMoving(false);
      toast({ title: "Moved to In Progress" });
    }, 600);
  };

  const handleConfirmComplete = () => {
    if (!active) return;
    setClosing(true);
    window.setTimeout(() => {
      const paid = amount ? Number(amount) : null;
      const next = items.map((i) =>
        i.id === active.id
          ? {
              ...i,
              status: "completed" as InquiryStatus,
              completedAt: new Date().toISOString(),
              amountPaidUSD: paid,
            }
          : i,
      );
      persist(next);
      setClosing(false);
      setCompleteOpen(false);
      setAmount("");
      toast({ title: "Deal closed", description: "Earnings updated." });
    }, 800);
  };

  const handleExport = () => {
    setExporting(true);
    window.setTimeout(() => {
      const csv = inquiriesToCSV(items.filter((i) => i.status === "completed"));
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `kitpager-inquiries-${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExporting(false);
      toast({ title: "Export ready" });
    }, 600);
  };

  return (
    <AppPage>
      <AppHeader
        title="Inquiries"
        description="From cold inbound to closed deal — every brand conversation tracked in one place."
      />

      {/* Tabs */}
      <div className="kp-card mb-4 flex flex-wrap gap-1 p-1">
        <TabBtn active={tab === "unread"} onClick={() => setTab("unread")} label="Unread" count={counts.unread} />
        <TabBtn active={tab === "in_progress"} onClick={() => setTab("in_progress")} label="In Progress" count={counts.in_progress} />
        <TabBtn active={tab === "completed"} onClick={() => setTab("completed")} label="Completed" count={counts.completed} />
      </div>

      {/* Banners */}
      {tab === "unread" && overdueUnread > 0 && (
        <Banner>
          You have {overdueUnread} {overdueUnread === 1 ? "inquiry" : "inquiries"} waiting over 24 hours. Brands move fast — reply now.
        </Banner>
      )}
      {tab === "in_progress" && stalledInProgress > 0 && (
        <Banner>
          {stalledInProgress} {stalledInProgress === 1 ? "deal" : "deals"} have been open for 7+ days. Nudge them.
        </Banner>
      )}

      {tab === "completed" && (
        <div className="kp-card mb-4 flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.16em] text-muted-foreground">Total tracked earnings</p>
            <p className="kp-display mt-1 text-3xl">${totalEarnings.toLocaleString()}</p>
            <p className="mt-1 text-xs text-muted-foreground">from {completedCount} completed {completedCount === 1 ? "deal" : "deals"}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            loaderClick
            isLoading={exporting}
            onClick={handleExport}
            className="rounded-full"
          >
            <Download className="h-3.5 w-3.5" /> Export as CSV
          </Button>
        </div>
      )}

      {/* List + Detail */}
      <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
        <div className="kp-card overflow-hidden">
          {filtered.length === 0 ? (
            <div className="grid place-items-center p-10 text-center text-sm text-muted-foreground">
              {tab === "unread" && "No new inquiries. Brands will show up here when they reach out."}
              {tab === "in_progress" && "No active conversations yet."}
              {tab === "completed" && "No completed deals yet."}
            </div>
          ) : (
            filtered.map((i) => (
              <button
                key={i.id}
                onClick={() => setActiveId(i.id)}
                className={`flex w-full items-start gap-3 border-b border-border p-4 text-left transition last:border-b-0 ${
                  active?.id === i.id ? "bg-surface-2" : "hover:bg-surface"
                }`}
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-primary/15 text-xs font-semibold text-primary">
                  {i.brandName.charAt(0)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">{i.brandName}</p>
                    {i.status === "unread" && (
                      <span className="rounded-full bg-success/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-success">
                        New
                      </span>
                    )}
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {i.status === "in_progress" && i.movedToInProgressAt
                      ? `Open for ${daysSince(i.movedToInProgressAt)}d · ${i.budget}`
                      : i.status === "completed"
                        ? `Closed ${i.completedAt ? new Date(i.completedAt).toLocaleDateString() : ""}`
                        : `${i.budget} · ${new Date(i.receivedAt).toLocaleDateString()}`}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-foreground/70">{i.summary}</p>
                  {i.status === "completed" && (
                    <p className="mt-1 text-xs">
                      {i.amountPaidUSD != null ? (
                        <span className="font-medium text-success">${i.amountPaidUSD.toLocaleString()}</span>
                      ) : (
                        <span className="italic text-muted-foreground">Amount not recorded</span>
                      )}
                    </p>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* Detail */}
        <div className="kp-card flex min-h-[480px] flex-col p-5 md:p-6">
          {!active ? (
            <div className="my-auto text-center text-sm text-muted-foreground">
              Select an inquiry to see details.
            </div>
          ) : (
            <>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="kp-display text-2xl">{active.brandName}</h2>
                  <p className="mt-1 text-sm text-muted-foreground">{active.contactName}</p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-3 py-1 text-xs ${
                    active.status === "unread"
                      ? "bg-success/15 text-success"
                      : active.status === "in_progress"
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                  }`}
                >
                  {labelFor(active.status)}
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <a
                  href={`mailto:${active.email}`}
                  className="inline-flex items-center gap-1.5 text-primary hover:underline"
                >
                  <Mail className="h-3.5 w-3.5" /> {active.email}
                </a>
                {active.phone && (
                  <a
                    href={`tel:${active.phone}`}
                    className="inline-flex items-center gap-1.5 text-primary hover:underline"
                  >
                    <Phone className="h-3.5 w-3.5" /> {active.phone}
                  </a>
                )}
              </div>

              <div className="kp-divider my-5" />

              <div className="grid gap-3 text-xs sm:grid-cols-2">
                <DetailRow label="Budget" value={active.budget} />
                <DetailRow label="Received" value={new Date(active.receivedAt).toLocaleString()} />
              </div>

              {active.deliverables && active.deliverables.length > 0 && (
                <div className="mt-4">
                  <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                    Deliverables
                  </p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {active.deliverables.map((d) => (
                      <span
                        key={d}
                        className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <p className="mt-5 flex-1 whitespace-pre-wrap text-sm leading-relaxed text-foreground/85">
                {active.summary}
              </p>

              {active.status !== "completed" && (
                <div className="mt-5 flex flex-wrap gap-2 border-t border-border pt-5">
                  <a
                    href={`mailto:${active.email}?subject=Re: your inquiry`}
                    className="inline-flex items-center gap-2 rounded-full bg-foreground px-4 py-2 text-sm text-background hover:opacity-90"
                  >
                    <Mail className="h-4 w-4" /> Reply via email
                  </a>
                  {active.status === "unread" && (
                    <Button
                      variant="outline"
                      loaderClick
                      isLoading={moving}
                      onClick={() => handleMoveToInProgress(active)}
                      className="rounded-full"
                    >
                      <ArrowRight className="h-4 w-4" /> Move to In Progress
                    </Button>
                  )}
                  {active.status === "in_progress" && (
                    <Button
                      variant="outline"
                      onClick={() => setCompleteOpen(true)}
                      className="rounded-full"
                    >
                      <CheckCheck className="h-4 w-4" /> Mark as Completed
                    </Button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Complete confirmation dialog */}
      <Dialog open={completeOpen} onOpenChange={setCompleteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Close this deal?</DialogTitle>
            <DialogDescription>
              How much were you paid? This is optional but helps track your earnings.
            </DialogDescription>
          </DialogHeader>
          <div>
            <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Amount paid (USD)
            </label>
            <input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleteOpen(false)}>
              Not yet
            </Button>
            <Button loaderClick isLoading={closing} onClick={handleConfirmComplete}>
              Confirm & close deal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AppPage>
  );
}

function TabBtn({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm transition sm:flex-none sm:px-5 ${
        active ? "bg-foreground text-background" : "text-muted-foreground hover:bg-surface-2"
      }`}
    >
      {label}
      <span
        className={`rounded-full px-1.5 py-0.5 text-[10px] font-medium ${
          active ? "bg-background/20 text-background" : "bg-surface-2 text-muted-foreground"
        }`}
      >
        {count}
      </span>
    </button>
  );
}

function Banner({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-3 rounded-xl border border-warning/40 bg-warning/10 p-4 text-sm">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
      <p className="flex-1 text-foreground/90">{children}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}

function labelFor(s: InquiryStatus): string {
  if (s === "unread") return "New";
  if (s === "in_progress") return "In Progress";
  return "Completed";
}

function daysSince(iso: string): number {
  return Math.max(1, Math.floor((Date.now() - new Date(iso).getTime()) / (1000 * 60 * 60 * 24)));
}
