import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Check, Sparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button, type PlanLockTarget } from "@/components/ui/button";
import { usePlanStore } from "@/store/plan";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { toast } from "@/hooks/use-toast";
import { MockPaddleSheet } from "@/components/kit/MockPaddleSheet";
import { FoundingMemberCard } from "@/components/kit/FoundingMemberCard";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  targetPlan: PlanLockTarget;
  featureName?: string;
}

type Cadence = "monthly" | "annual";

interface PlanCard {
  id: "Creator" | "Pro";
  monthly: number;
  annualMonthly: number;
  annual: number;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
}

const PLANS: PlanCard[] = [
  {
    id: "Creator",
    monthly: 12,
    annualMonthly: 8.25,
    annual: 99,
    highlight: true,
    badge: "Most popular",
    cta: "Start 7-day free trial",
    features: [
      "All page templates",
      "Verified platform stats",
      "Unlimited testimonials",
      "Audience demographics",
      "Remove KitPager branding",
    ],
  },
  {
    id: "Pro",
    monthly: 29,
    annualMonthly: 19.92,
    annual: 239,
    cta: "Upgrade to Pro",
    features: [
      "Everything in Creator",
      "Real-time view notifications",
      "Reports refresh every hour",
      "UTM named pitch tracking",
      "White-label reports",
      "Analytics export",
    ],
  },
];

export function UpgradeModal({ open, onClose, targetPlan, featureName }: UpgradeModalProps) {
  const navigate = useNavigate();
  const setPlan = usePlanStore((s) => s.setPlan);
  const setStatus = usePlanStore((s) => s.setStatus);
  const startCreatorTrial = usePlanStore((s) => s.startCreatorTrial);
  const locale = useLocaleStore();

  const [cadence, setCadence] = useState<Cadence>("monthly");
  const [paddleOpen, setPaddleOpen] = useState(false);
  const [paddlePlan, setPaddlePlan] = useState<PlanCard>(PLANS[0]);
  const [loadingId, setLoadingId] = useState<"Creator" | "Pro" | null>(null);

  // Reset cadence when modal opens
  useEffect(() => {
    if (open) setCadence("monthly");
  }, [open]);

  const handleSelect = (plan: PlanCard) => {
    setLoadingId(plan.id);
    setPaddlePlan(plan);
    window.setTimeout(() => {
      setLoadingId(null);
      setPaddleOpen(true);
    }, 1200);
  };

  const handlePaddleSuccess = () => {
    if (paddlePlan.id === "Creator") {
      startCreatorTrial(7);
    } else {
      setPlan("Pro");
      setStatus("active");
    }
    setPaddleOpen(false);
    onClose();
    toast({
      title: paddlePlan.id === "Creator" ? "Trial started" : "Welcome to Pro",
      description:
        paddlePlan.id === "Creator"
          ? "Your 7-day Creator trial is active."
          : "You're now on Pro.",
    });
    navigate("/app");
  };

  const isAnnual = cadence === "annual";

  return (
    <>
      <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
        <DialogContent className="max-w-3xl overflow-hidden p-0">
          {/* Header */}
          <div className="flex items-start justify-between gap-3 border-b border-border bg-gradient-to-br from-primary/10 to-transparent px-6 py-5">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                Unlock KitPager
              </div>
              <h2 className="kp-display mt-2 text-2xl">
                {featureName ? `Unlock ${featureName}` : `Pick a plan to continue`}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Trigger came from{" "}
                <span className="font-medium text-foreground">{targetPlan}</span>-tier
                features.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-full p-1 text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="max-h-[75vh] overflow-y-auto px-5 py-5 sm:px-6 sm:py-6">
            {/* Cadence toggle */}
            <div className="mx-auto inline-flex w-full items-center justify-center">
              <div className="inline-flex rounded-full border border-border bg-surface p-1 text-xs">
                <button
                  type="button"
                  onClick={() => setCadence("monthly")}
                  className={`rounded-full px-4 py-1.5 font-medium transition ${
                    !isAnnual
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Monthly
                </button>
                <button
                  type="button"
                  onClick={() => setCadence("annual")}
                  className={`flex items-center gap-2 rounded-full px-4 py-1.5 font-medium transition ${
                    isAnnual
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Annual
                  <span className="rounded-full bg-success/20 px-1.5 py-0.5 text-[9px] font-semibold text-success">
                    Save 2 mo
                  </span>
                </button>
              </div>
            </div>

            {/* Plan cards */}
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {PLANS.map((p) => {
                const price = isAnnual ? p.annualMonthly : p.monthly;
                return (
                  <div
                    key={p.id}
                    className={`relative flex flex-col rounded-2xl border p-5 ${
                      p.highlight
                        ? "border-primary/50 bg-primary/5 shadow-glow"
                        : "border-border bg-surface"
                    }`}
                  >
                    {p.badge && (
                      <span className="absolute -top-2.5 left-4 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-primary-foreground">
                        {p.badge}
                      </span>
                    )}
                    <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      {p.id}
                    </p>
                    <div
                      key={`${cadence}-${locale.currencyCode}`}
                      className="mt-2 animate-in fade-in duration-200"
                    >
                      <p className="kp-display flex items-baseline gap-1.5 text-3xl">
                        {formatPrice(price, locale)}
                        <span className="text-xs font-normal text-muted-foreground">
                          /mo
                        </span>
                      </p>
                      {isAnnual && (
                        <p className="mt-0.5 text-[11px] text-muted-foreground">
                          billed {formatPrice(p.annual, locale)}/yr
                        </p>
                      )}
                    </div>
                    <ul className="mt-4 space-y-1.5 text-sm">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-start gap-2">
                          <Check className="mt-0.5 h-3.5 w-3.5 shrink-0 text-primary" />
                          <span className="text-foreground/85">{f}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      onClick={() => handleSelect(p)}
                      loaderClick
                      isLoading={loadingId === p.id}
                      className="mt-5 w-full rounded-full"
                      variant={p.highlight ? "default" : "outline"}
                    >
                      {p.cta}
                    </Button>
                  </div>
                );
              })}
            </div>

            {/* Founding Member compact row */}
            <div className="mt-4">
              <FoundingMemberCard variant="compact" onSuccess={onClose} />
            </div>

            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-muted-foreground transition hover:text-foreground"
              >
                Maybe later
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <MockPaddleSheet
        open={paddleOpen}
        onClose={() => setPaddleOpen(false)}
        onSuccess={handlePaddleSuccess}
        planLabel={paddlePlan.id}
        priceUSD={isAnnual ? paddlePlan.annualMonthly : paddlePlan.monthly}
      />
    </>
  );
}

/**
 * Mount this once at the app root. It listens for global "kp:upgrade" events
 * dispatched by Button(planLock) and PlanLock components, then renders the modal.
 */
export function UpgradeModalHost() {
  const [state, setState] = useState<{
    open: boolean;
    targetPlan: PlanLockTarget;
    featureName: string;
  }>({ open: false, targetPlan: "Creator", featureName: "" });

  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (
        e as CustomEvent<{
          targetPlan: PlanLockTarget;
          featureName: string;
        }>
      ).detail;
      setState({
        open: true,
        targetPlan: detail.targetPlan,
        featureName: detail.featureName,
      });
    };
    window.addEventListener("kp:upgrade", handler);
    return () => window.removeEventListener("kp:upgrade", handler);
  }, []);

  return (
    <UpgradeModal
      open={state.open}
      onClose={() => setState((s) => ({ ...s, open: false }))}
      targetPlan={state.targetPlan}
      featureName={state.featureName}
    />
  );
}
