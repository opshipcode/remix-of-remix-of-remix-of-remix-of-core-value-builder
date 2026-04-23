import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/auth";
import { usePlanStore } from "@/store/plan";
import { useLocaleStore } from "@/store/locale";
import { useTrialCountdown } from "@/hooks/useTrialCountdown";
import { formatPrice } from "@/lib/formatPrice";
import { Sparkles, Download, AlertTriangle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { usePageLoader } from "@/hooks/usePageLoader";
import { toast } from "@/hooks/use-toast";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getBillingHistory,
  type BillingEntry,
} from "@/lib/billingHistory";
import { openCheckout } from "@/lib/payment";
import { PLAN_PRICES_USD, type PlanId } from "@/lib/payment-config";

type Cadence = "monthly" | "annual";

export default function Billing() {
  const { loading } = usePageLoader(700);
  const userPlan = useAuthStore((s) => s.user?.plan ?? "free");
  void userPlan;
  const navigate = useNavigate();
  void navigate;
  const user = useAuthStore((s) => s.user);
  const locale = useLocaleStore();
  const { status, plan, setStatus, jumpToState, activatePlan } = usePlanStore();
  const countdown = useTrialCountdown();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [cadence, setCadence] = useState<Cadence>("annual");
  const [retrying, setRetrying] = useState(false);
  const [updatingPm, setUpdatingPm] = useState(false);
  const [history, setHistory] = useState<BillingEntry[]>([]);

  useEffect(() => {
    setHistory(getBillingHistory());
  }, [status, plan]);

  const handleDownload = (entry: BillingEntry) => {
    setDownloadingId(entry.id);
    window.setTimeout(() => {
      try {
        const lines = [
          `KitPager — Receipt ${entry.id}`,
          `Date: ${entry.date}`,
          `Description: ${entry.description}`,
          `Amount: ${entry.amount.toFixed(2)} ${entry.currency}`,
          `Status: ${entry.status}`,
          entry.purchasedAt ? `Purchased: ${entry.purchasedAt}` : null,
          entry.expiresAt ? `Expires: ${entry.expiresAt}` : null,
        ]
          .filter(Boolean)
          .join("\n");
        const blob = new Blob([lines], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `kitpager-invoice-${entry.id}.txt`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch {
        /* ignore */
      }
      setDownloadingId(null);
      toast({ title: "Invoice downloaded" });
    }, 800);
  };

  const handleRetry = () => {
    setRetrying(true);
    window.setTimeout(() => {
      setRetrying(false);
      setStatus("active");
      toast({ title: "Payment successful", description: "Your subscription is back to active." });
    }, 1200);
  };

  const handleUpdatePm = () => {
    setUpdatingPm(true);
    window.setTimeout(() => {
      setUpdatingPm(false);
      toast({ title: "Payment method updated", description: "We'll retry your renewal shortly." });
    }, 1100);
  };

  const startSubscribe = (planId: PlanId) => {
    const usd = PLAN_PRICES_USD[planId];
    const amountUSD = planId === "creator_annual"
      ? PLAN_PRICES_USD.creator_annual * 12
      : planId === "pro_annual"
        ? PLAN_PRICES_USD.pro_annual * 12
        : usd;
    openCheckout({
      amount: Math.round(amountUSD * locale.exchangeRate * 100) / 100,
      currency: locale.currencyCode,
      email: user?.email ?? "",
      name: user?.displayName ?? "",
      plan: planId,
      onSuccess: () => {
        activatePlan(planId);
        toast({
          title: "Plan activated",
          description: `You're now on ${planId.replace("_", " ")}.`,
        });
        setHistory(getBillingHistory());
      },
      onClose: () => undefined,
    });
  };

  if (loading) return <BillingSkeleton />;

  return (
    <div className="space-y-6">
      {/* PRIMARY PLAN CARD — varies by status */}
      {status === "trialing" && (
        <TrialingCard
          cadence={cadence}
          setCadence={setCadence}
          countdownLabel={countdown.label}
          msLeft={countdown.msLeft}
          onSubscribe={() =>
            startSubscribe(cadence === "annual" ? "creator_annual" : "creator_monthly")
          }
        />
      )}
      {status === "grace_period" && (
        <GraceCard
          countdownLabel={countdown.label}
          onUpdate={handleUpdatePm}
          onRetry={handleRetry}
          updating={updatingPm}
          retrying={retrying}
        />
      )}
      {(status === "expired" || status === "trial_expired" || status === "cancelled") && (
        <ExpiredCard
          cadence={cadence}
          setCadence={setCadence}
          onResubscribe={(p) => {
            jumpToState("trialing");
            startSubscribe(p);
          }}
        />
      )}
      {status === "active" && (
        <ActiveCard
          plan={plan === "Creator" || plan === "Pro" ? plan : "Creator"}
          cadence={cadence}
          setCadence={setCadence}
        />
      )}

      {/* History */}
      <div className="kp-card overflow-hidden">
        <div className="border-b border-border p-5">
          <h2 className="text-lg font-semibold">Billing history</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Invoices and one-time receipts are kept here.
          </p>
        </div>
        {history.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No invoices yet.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-surface text-xs uppercase tracking-[0.12em] text-muted-foreground">
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="text-right">Receipt</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {history.map((h) => (
                <TableRow key={h.id} className="text-foreground">
                  <TableCell className="text-muted-foreground">{h.date}</TableCell>
                  <TableCell className="font-medium">
                    {h.type === "founding_creator_receipt" ? (
                      <span className="inline-flex items-center gap-1.5">
                        <Sparkles className="h-3.5 w-3.5 text-amber-500" />
                        Founding Creator — 5-Year Pro Access
                      </span>
                    ) : (
                      h.description
                    )}
                  </TableCell>
                  <TableCell className="kp-mono">
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help underline decoration-dotted">
                            {formatPrice(h.amount, locale)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          Originally charged in {h.currency} ({h.amount.toFixed(2)})
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs capitalize ${
                        h.status === "paid"
                          ? "bg-success/15 text-success"
                          : h.status === "refunded"
                            ? "bg-muted text-muted-foreground"
                            : "bg-destructive/15 text-destructive"
                      }`}
                    >
                      {h.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      loaderClick
                      isLoading={downloadingId === h.id}
                      onClick={() => handleDownload(h)}
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
}

interface ActiveProps {
  plan: "Creator" | "Pro";
  cadence: Cadence;
  setCadence: (c: Cadence) => void;
}
function ActiveCard({ plan, cadence }: ActiveProps) {
  const locale = useLocaleStore();
  const monthly = plan === "Pro" ? 19 : 12;
  const annual = plan === "Pro" ? 179.04 : 99;
  const annualMonthly = plan === "Pro" ? 14.92 : 8.25;
  const annualSavings = plan === "Pro" ? 19 * 12 - 179.04 : 144 - 99;
  return (
    <div className="kp-card overflow-hidden">
      <div className="p-6 md:p-8" style={{ background: "var(--gradient-primary)" }}>
        <p className="text-xs uppercase tracking-[0.14em] text-primary-foreground/80">Current plan</p>
        <div className="mt-2 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="kp-display text-3xl text-primary-foreground sm:text-4xl">
              {plan} · {cadence === "annual" ? "Annual" : "Monthly"}
            </p>
            <p className="mt-1 text-sm text-primary-foreground/80">
              {cadence === "annual"
                ? `${formatPrice(annual, locale)} /yr · Renews next year (≈${formatPrice(annualMonthly, locale)}/mo)`
                : `${formatPrice(monthly, locale)} /mo · Renews next month`}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {cadence === "monthly" && (
              <Button variant="secondary" className="rounded-full">
                Switch to annual — save {formatPrice(annualSavings, locale)}/yr
              </Button>
            )}
            {plan === "Creator" && (
              <Button planLock="Pro" variant="secondary" className="rounded-full">
                <Sparkles className="h-4 w-4" /> Upgrade to Pro
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border bg-card text-center">
        {[
          { l: "Trial ends", v: "—" },
          { l: "Used this month", v: "1.2K views" },
          { l: "Plan limit", v: "Unlimited" },
        ].map((s) => (
          <div key={s.l} className="p-3 sm:p-4">
            <p className="text-[10px] uppercase tracking-wide text-muted-foreground sm:text-xs">{s.l}</p>
            <p className="kp-mono mt-1 text-xs font-medium sm:text-sm">{s.v}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

interface TrialingProps {
  cadence: Cadence;
  setCadence: (c: Cadence) => void;
  countdownLabel: string;
  msLeft: number | null;
  onSubscribe: () => void;
}
function TrialingCard({ cadence, setCadence, countdownLabel, msLeft, onSubscribe }: TrialingProps) {
  const locale = useLocaleStore();
  const totalMs = 7 * 24 * 60 * 60 * 1000;
  const pct = msLeft !== null ? Math.max(0, Math.min(100, (msLeft / totalMs) * 100)) : 100;
  return (
    <div className="kp-card p-5 sm:p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Current plan</p>
      <h2 className="kp-display mt-2 text-2xl sm:text-3xl">Creator Trial</h2>
      <p className="mt-1 text-sm text-muted-foreground">{countdownLabel}</p>
      <div className="mt-4">
        <Progress value={pct} className="h-2" />
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          Choose your plan
        </p>

        <div className="flex flex-col gap-2 sm:flex-row">
          <CadenceRadio
            value="monthly"
            selected={cadence === "monthly"}
            onChange={() => setCadence("monthly")}
            title="Monthly"
            price={`${formatPrice(12, locale)}/mo`}
          />
          <CadenceRadio
            value="annual"
            selected={cadence === "annual"}
            onChange={() => setCadence("annual")}
            title="Annual"
            price={`${formatPrice(99, locale)}/yr`}
            strike={formatPrice(144, locale)}
            savings={`Save ${formatPrice(45, locale)}`}
          />
        </div>
      </div>
      <div className="mt-6 flex justify-end">
        <Button
          size="lg"
          className="w-full rounded-full sm:w-auto"
          loaderClick
          onClick={onSubscribe}
        >
          Subscribe & keep access
        </Button>
      </div>
    </div>
  );
}

interface CadenceRadioProps {
  value: string;
  selected: boolean;
  onChange: () => void;
  title: string;
  price: string;
  strike?: string;
  savings?: string;
}
function CadenceRadio({ selected, onChange, title, price, strike, savings }: CadenceRadioProps) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left transition ${
        selected ? "border-primary bg-primary/5" : "border-border hover:bg-surface-2"
      }`}
    >
      <span className="flex items-center gap-3">
        <span
          className={`grid h-4 w-4 place-items-center rounded-full border ${
            selected ? "border-primary" : "border-border"
          }`}
        >
          {selected && <span className="h-2 w-2 rounded-full bg-primary" />}
        </span>
        <span className="text-sm font-medium">{title}</span>
      </span>
      <span className="flex flex-wrap items-center gap-2 text-sm">
        <span className="kp-mono">{price}</span>
        {strike && <span className="text-muted-foreground/60 line-through kp-mono text-xs">{strike}</span>}
        {savings && <span className="rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold text-success">{savings}</span>}
      </span>
    </button>
  );
}

interface GraceProps {
  countdownLabel: string;
  onUpdate: () => void;
  onRetry: () => void;
  updating: boolean;
  retrying: boolean;
}
function GraceCard({ countdownLabel, onUpdate, onRetry, updating, retrying }: GraceProps) {
  return (
    <div className="kp-card border-destructive/40 p-5 sm:p-6 md:p-8">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Current plan</p>
          <h2 className="kp-display mt-1 text-xl sm:text-2xl">Creator — Payment Issue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't process your last payment. Access continues for{" "}
            <span className="kp-mono text-destructive">{countdownLabel.replace(/.*for /, "")}</span>.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        <Button onClick={onUpdate} loaderClick isLoading={updating} className="rounded-full">
          <CreditCard className="h-4 w-4" /> Update payment method
        </Button>
        <Button variant="outline" onClick={onRetry} loaderClick isLoading={retrying} className="rounded-full">
          Retry payment
        </Button>
      </div>
    </div>
  );
}

interface ExpiredProps {
  cadence: Cadence;
  setCadence: (c: Cadence) => void;
  onResubscribe: (planId: PlanId) => void;
}
function ExpiredCard({ onResubscribe }: ExpiredProps) {
  const locale = useLocaleStore();
  const [pick, setPick] = useState<PlanId>("creator_annual");
  const opts: { id: PlanId; label: string; price: string; strike?: string }[] = [
    { id: "creator_monthly", label: "Creator Monthly", price: `${formatPrice(12, locale)}/mo` },
    { id: "creator_annual", label: "Creator Annual", price: `${formatPrice(99, locale)}/yr`, strike: formatPrice(144, locale) },
    { id: "pro_monthly", label: "Pro Monthly", price: `${formatPrice(19, locale)}/mo` },
    { id: "pro_annual", label: "Pro Annual", price: `${formatPrice(179.04, locale)}/yr`, strike: formatPrice(228, locale) },
  ];
  return (
    <div className="kp-card p-5 sm:p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-destructive">Plan expired</p>
      <h2 className="kp-display mt-2 text-2xl sm:text-3xl">Pick a plan to continue</h2>
      <p className="mt-1 text-sm text-muted-foreground">Your Creator subscription has ended.</p>
      <div className="mt-6 grid gap-2 sm:grid-cols-2">
        {opts.map((o) => (
          <button
            key={o.id}
            type="button"
            onClick={() => setPick(o.id)}
            className={`flex items-center justify-between gap-2 rounded-xl border px-4 py-3 text-left text-sm transition ${
              pick === o.id ? "border-primary bg-primary/5" : "border-border hover:bg-surface-2"
            }`}
          >
            <span className="font-medium">{o.label}</span>
            <span className="flex items-center gap-1.5 kp-mono">
              {o.strike && <span className="text-muted-foreground/60 line-through text-xs">{o.strike}</span>}
              {o.price}
            </span>
          </button>
        ))}
      </div>
      <Button size="lg" loaderClick onClick={() => onResubscribe(pick)} className="mt-6 w-full rounded-full">
        Resubscribe
      </Button>
    </div>
  );
}

function BillingSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-44" />
      <Skeleton className="h-64" />
    </div>
  );
}
