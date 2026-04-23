import { useEffect, useState } from "react";
import { Sparkles, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  FOUNDING_PRICE_USD,
  FOUNDING_TOTAL_SPOTS,
  decrementFoundingSpots,
  getFoundingSpotsRemaining,
} from "@/lib/foundingMember";
import { MockPaddleSheet } from "@/components/kit/MockPaddleSheet";
import { usePlanStore } from "@/store/plan";
import { toast } from "@/hooks/use-toast";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";

interface FoundingMemberCardProps {
  variant?: "default" | "compact";
  onSuccess?: () => void;
}

export function FoundingMemberCard({
  variant = "default",
  onSuccess,
}: FoundingMemberCardProps) {
  const [spots, setSpots] = useState<number>(() => getFoundingSpotsRemaining());
  const [paddleOpen, setPaddleOpen] = useState(false);
  const setPlan = usePlanStore((s) => s.setPlan);
  const setStatus = usePlanStore((s) => s.setStatus);
  const locale = useLocaleStore();

  useEffect(() => {
    setSpots(getFoundingSpotsRemaining());
  }, []);

  const handleClick = () => {
    setPaddleOpen(true);
  };

  const handleSuccess = () => {
    const remaining = decrementFoundingSpots();
    setSpots(remaining);
    setPlan("Creator");
    setStatus("active");
    setPaddleOpen(false);
    toast({
      title: "Welcome, founding member",
      description: "You have lifetime Creator access.",
    });
    onSuccess?.();
  };

  if (variant === "compact") {
    return (
      <>
        <button
          type="button"
          onClick={handleClick}
          className="flex w-full items-center justify-between rounded-xl border border-amber-400/40 bg-amber-400/5 px-4 py-3 text-left text-sm transition hover:bg-amber-400/10"
        >
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-foreground">
              Founding Member —{" "}
              <span className="kp-mono font-semibold">{formatPrice(FOUNDING_PRICE_USD, locale)}</span>{" "}
              once, Creator forever
            </span>
          </span>
          <span className="text-xs text-amber-500">→</span>
        </button>
        <MockPaddleSheet
          open={paddleOpen}
          onClose={() => setPaddleOpen(false)}
          onSuccess={handleSuccess}
          planLabel="Creator"
          priceUSD={FOUNDING_PRICE_USD}
        />
      </>
    );
  }

  return (
    <>
      <div
        id="founding-member-card"
        className="rounded-3xl border border-amber-400/50 bg-amber-400/5 p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-600 dark:text-amber-400">
              Founding Member
            </p>
            <h3 className="kp-display mt-2 text-2xl sm:text-3xl">
              One payment. Creator access. Forever.
            </h3>
          </div>
          <span className="rounded-full bg-amber-400/20 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-amber-700 dark:text-amber-300">
            Limited: {FOUNDING_TOTAL_SPOTS} spots
          </span>
        </div>

        <p className="mt-3 text-sm text-muted-foreground">
          Worth <span className="line-through">$720</span> at monthly pricing · Worth{" "}
          <span className="line-through">$495</span> at annual pricing · You save at least
          $96 over 5 years.
        </p>

        <div className="mt-6 grid gap-2 sm:grid-cols-2">
          {[
            "Everything in Creator plan",
            "Direct access to founder",
            "Free forever as long as KitPager exists",
            "Lock in today's price forever",
          ].map((f) => (
            <div key={f} className="flex items-start gap-2 text-sm">
              <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
              <span>{f}</span>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="kp-display text-3xl">
              {formatPrice(FOUNDING_PRICE_USD, locale)}{" "}
              <span className="text-sm font-normal text-muted-foreground">once</span>
            </p>
            <p className="text-xs text-muted-foreground">
              No subscription, no renewals · {spots} of {FOUNDING_TOTAL_SPOTS} spots
              remaining
            </p>
          </div>
          <Button
            loaderClick
            onClick={handleClick}
            size="lg"
            className="rounded-full bg-amber-500 text-background hover:bg-amber-600"
          >
            Become a founding member →
          </Button>
        </div>
      </div>

      <MockPaddleSheet
        open={paddleOpen}
        onClose={() => setPaddleOpen(false)}
        onSuccess={handleSuccess}
        planLabel="Creator"
        priceUSD={FOUNDING_PRICE_USD}
      />
    </>
  );
}

export function FoundingMemberPopup() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem("kp_lto_popup_dismissed")) {
      setDismissed(true);
      return;
    }
    const t = window.setTimeout(() => setShow(true), 30_000);
    return () => window.clearTimeout(t);
  }, []);

  const dismiss = () => {
    try {
      window.sessionStorage.setItem("kp_lto_popup_dismissed", "1");
    } catch {
      /* ignore */
    }
    setShow(false);
    setDismissed(true);
  };

  const scrollToOffer = () => {
    const el = document.getElementById("founding-member-card");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
    dismiss();
  };

  if (dismissed || !show) return null;

  return (
    <div className="fixed inset-x-0 bottom-4 z-[150] mx-auto flex w-fit max-w-[92vw] items-center gap-3 rounded-full border border-amber-400/50 bg-card/95 px-4 py-2.5 text-sm shadow-2xl backdrop-blur sm:bottom-6">
      <span className="flex items-center gap-2">
        <Sparkles className="h-4 w-4 text-amber-500" />
        <span className="hidden sm:inline">
          Founding Member offer — ${FOUNDING_PRICE_USD} once, Creator access forever
        </span>
        <span className="sm:hidden">${FOUNDING_PRICE_USD} lifetime offer</span>
      </span>
      <button
        type="button"
        onClick={scrollToOffer}
        className="rounded-full bg-amber-500 px-3 py-1 text-xs font-medium text-background hover:bg-amber-600"
      >
        Learn more
      </button>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Dismiss"
        className="text-muted-foreground hover:text-foreground"
      >
        ✕
      </button>
    </div>
  );
}
