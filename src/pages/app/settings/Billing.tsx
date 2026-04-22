import { useState } from "react";
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
import { usePageLoader } from "@/hooks/usePageLoader";
import { toast } from "@/hooks/use-toast";
import { MockPaddleSheet } from "@/components/kit/MockPaddleSheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Cadence = "monthly" | "annual";

interface HistoryRow {
  id: string;
  date: string;
  desc: string;
  amountUSD: number;
  status: "Paid" | "Refunded";
}

const HISTORY: HistoryRow[] = [
  { id: "i1", date: "Apr 1, 2026", desc: "Creator (Annual)", amountUSD: 99, status: "Paid" },
  { id: "i2", date: "Mar 1, 2026", desc: "Creator (Monthly)", amountUSD: 12, status: "Paid" },
  { id: "i3", date: "Feb 1, 2026", desc: "Creator (Monthly)", amountUSD: 12, status: "Paid" },
];

export default function Billing() {
  const { loading } = usePageLoader(700);
  const navigate = useNavigate();
  const userPlan = useAuthStore((s) => s.user?.plan ?? "free");
  const locale = useLocaleStore();
  const { status, plan, setPlan, setStatus, jumpToState } = usePlanStore();
  const countdown = useTrialCountdown();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [cadence, setCadence] = useState<Cadence>("annual");
  const [paddleOpen, setPaddleOpen] = useState(false);
  const [retrying, setRetrying] = useState(false);
  const [updatingPm, setUpdatingPm] = useState(false);

  const handleDownload = (id: string) => {
    setDownloadingId(id);
    window.setTimeout(() => {
      setDownloadingId(null);
      toast({ title: "Invoice downloaded", description: `Saved invoice ${id} as PDF.` });
    }, 900);
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

  const handleSubscribeSuccess = () => {
    setPaddleOpen(false);
    setPlan("Creator");
    setStatus("active");
    toast({ title: "Welcome aboard", description: "Your Creator subscription is active." });
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
          onSubscribe={() => setPaddleOpen(true)}
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
          onResubscribe={() => {
            jumpToState("trialing");
            setPaddleOpen(true);
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
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead className="bg-surface text-left text-xs uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Description</th>
                <th className="px-5 py-3">Amount</th>
                <th className="px-5 py-3">Currency</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {HISTORY.map((h) => (
                <tr key={h.id} className="border-t border-border">
                  <td className="px-5 py-3 text-muted-foreground">{h.date}</td>
                  <td className="px-5 py-3">{h.desc}</td>
                  <td className="px-5 py-3 kp-mono">
                    <TooltipProvider delayDuration={150}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <span className="cursor-help underline decoration-dotted">
                            {formatPrice(h.amountUSD, locale)}
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>Originally charged in USD ({h.amountUSD.toFixed(2)})</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </td>
                  <td className="px-5 py-3 kp-mono text-muted-foreground">{locale.currencyCode}</td>
                  <td className="px-5 py-3">
                    <span className="rounded-full bg-success/15 px-2.5 py-0.5 text-xs text-success">{h.status}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      loaderClick
                      isLoading={downloadingId === h.id}
                      onClick={() => handleDownload(h.id)}
                    >
                      <Download className="h-3.5 w-3.5" /> PDF
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <MockPaddleSheet
        open={paddleOpen}
        onClose={() => setPaddleOpen(false)}
        onSuccess={handleSubscribeSuccess}
        planLabel="Creator"
        priceUSD={cadence === "annual" ? 99 : 12}
      />
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
  const monthly = plan === "Pro" ? 29 : 12;
  const annual = plan === "Pro" ? 239 : 99;
  const annualMonthly = plan === "Pro" ? 19.92 : 8.25;
  const annualSavings = plan === "Pro" ? 348 - 239 : 144 - 99;
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
                ? `${formatPrice(annual, locale)} /yr · Renews Apr 22, 2027 (equivalent to ${formatPrice(annualMonthly, locale)}/mo)`
                : `${formatPrice(monthly, locale)} /mo · Renews May 22, 2026`}
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
          <div key={s.l} className="p-4">
            <p className="text-xs text-muted-foreground">{s.l}</p>
            <p className="kp-mono mt-1 text-sm font-medium">{s.v}</p>
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
    <div className="kp-card p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Current plan</p>
      <h2 className="kp-display mt-2 text-3xl">Creator Trial</h2>
      <p className="mt-1 text-sm text-muted-foreground">{countdownLabel}</p>
      <div className="mt-4">
        <Progress value={pct} className="h-2" />
      </div>

      <div className="mt-6 space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">Choose your plan</p>
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

      <Button
        size="lg"
        className="mt-6 w-full rounded-full"
        loaderClick
        onClick={onSubscribe}
      >
        Subscribe & keep access
      </Button>
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
      <span className="flex items-center gap-2 text-sm">
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
    <div className="kp-card border-destructive/40 p-6 md:p-8">
      <div className="flex items-start gap-3">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-destructive/15 text-destructive">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div className="flex-1">
          <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">Current plan</p>
          <h2 className="kp-display mt-1 text-2xl">Creator — Payment Issue</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            We couldn't process your last payment. Access continues for{" "}
            <span className="kp-mono text-destructive">{countdownLabel.replace(/.*for /, "")}</span>.
          </p>
        </div>
      </div>
      <div className="mt-6 flex flex-wrap gap-2">
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
  onResubscribe: () => void;
}
function ExpiredCard({ onResubscribe }: ExpiredProps) {
  const locale = useLocaleStore();
  const [pick, setPick] = useState<"cm" | "ca" | "pm" | "pa">("ca");
  const opts: { id: typeof pick; label: string; price: string; strike?: string }[] = [
    { id: "cm", label: "Creator Monthly", price: `${formatPrice(12, locale)}/mo` },
    { id: "ca", label: "Creator Annual", price: `${formatPrice(99, locale)}/yr`, strike: formatPrice(144, locale) },
    { id: "pm", label: "Pro Monthly", price: `${formatPrice(29, locale)}/mo` },
    { id: "pa", label: "Pro Annual", price: `${formatPrice(239, locale)}/yr`, strike: formatPrice(348, locale) },
  ];
  return (
    <div className="kp-card p-6 md:p-8">
      <p className="text-xs uppercase tracking-[0.14em] text-destructive">Plan expired</p>
      <h2 className="kp-display mt-2 text-3xl">Pick a plan to continue</h2>
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
      <Button size="lg" loaderClick onClick={onResubscribe} className="mt-6 w-full rounded-full">
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
