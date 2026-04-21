import { useEffect, useState } from "react";
import { Check, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button, type PlanLockTarget } from "@/components/ui/button";
import { usePlanStore } from "@/store/plan";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { toast } from "@/hooks/use-toast";

interface UpgradeModalProps {
  open: boolean;
  onClose: () => void;
  targetPlan: PlanLockTarget;
  featureName?: string;
}

const PLAN_DETAILS: Record<
  PlanLockTarget,
  { priceUSD: number; tagline: string; features: string[]; accent: string }
> = {
  Creator: {
    priceUSD: 12,
    tagline: "Verified stats, real testimonials, full templates.",
    features: [
      "All 3 page templates",
      "Verified platform stats",
      "Unlimited testimonials",
      "Country restrictions",
      "Up to 3 accounts per platform",
    ],
    accent: "from-primary/15 to-primary/5",
  },
  Pro: {
    priceUSD: 29,
    tagline: "Built for full-time creators and agencies.",
    features: [
      "Everything in Creator",
      "Advanced analytics + 90 day history",
      "Viewed-by alerts",
      "Private password-protected shares",
      "Unlimited platform accounts",
    ],
    accent: "from-primary/30 via-primary/10 to-transparent",
  },
};

export function UpgradeModal({
  open,
  onClose,
  targetPlan,
  featureName,
}: UpgradeModalProps) {
  const setPlan = usePlanStore((s) => s.setPlan);
  const setStatus = usePlanStore((s) => s.setStatus);
  const locale = useLocaleStore();
  const [loading, setLoading] = useState(false);

  const details = PLAN_DETAILS[targetPlan];
  const price = formatPrice(details.priceUSD, locale);

  const handleUpgrade = () => {
    setLoading(true);
    window.setTimeout(() => {
      setPlan(targetPlan);
      setStatus("active");
      setLoading(false);
      toast({ title: "Upgraded", description: `You're now on ${targetPlan}.` });
      onClose();
    }, 1200);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <DialogContent className="max-w-md overflow-hidden p-0">
        <div className={`bg-gradient-to-br ${details.accent} p-6`}>
          <DialogHeader className="space-y-2">
            <div className="inline-flex items-center gap-1.5 self-start rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
              <Sparkles className="h-3 w-3" />
              {targetPlan}
            </div>
            <DialogTitle className="text-2xl">
              Unlock {featureName ?? `${targetPlan} features`}
            </DialogTitle>
            <DialogDescription>{details.tagline}</DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-4 px-6 pb-6">
          <ul className="space-y-2">
            {details.features.map((f) => (
              <li
                key={f}
                className="flex items-start gap-2 text-sm text-foreground"
              >
                <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-primary/15 text-primary">
                  <Check className="h-3 w-3" />
                </span>
                {f}
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-2">
            <Button
              loaderClick
              isLoading={loading}
              onClick={handleUpgrade}
              className="w-full"
              size="lg"
            >
              Upgrade to {targetPlan} — {price}/mo
            </Button>
            <button
              type="button"
              onClick={onClose}
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              Maybe later
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
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
    const handler = (
      e: Event,
    ) => {
      const detail = (e as CustomEvent<{
        targetPlan: PlanLockTarget;
        featureName: string;
      }>).detail;
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
