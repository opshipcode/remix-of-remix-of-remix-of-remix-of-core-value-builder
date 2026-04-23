import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, Sparkles } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import type { MockCheckoutDetail } from "@/lib/providers/mockCheckout";
import type { CheckoutConfig } from "@/lib/payment-config";

/**
 * Listens for window "kp:mock-checkout" events and renders a
 * mock provider sheet. Decoupled from the actual checkout caller
 * so providers stay UI-free.
 */
export function MockCheckoutHost() {
  const locale = useLocaleStore();
  const [open, setOpen] = useState(false);
  const [detail, setDetail] = useState<MockCheckoutDetail | null>(null);
  const [card, setCard] = useState("4242 4242 4242 4242");
  const [exp, setExp] = useState("12/29");
  const [cvc, setCvc] = useState("123");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      const ce = e as CustomEvent<MockCheckoutDetail>;
      setDetail(ce.detail);
      setOpen(true);
    };
    window.addEventListener("kp:mock-checkout", handler);
    return () => window.removeEventListener("kp:mock-checkout", handler);
  }, []);

  const close = (fireOnClose: boolean) => {
    if (fireOnClose && detail) detail.config.onClose();
    setOpen(false);
  };

  const handlePay = () => {
    if (!detail) return;
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      detail.config.onSuccess({ status: "successful", mock: true });
      setOpen(false);
    }, 1500);
  };

  if (!detail) return null;

  const config: CheckoutConfig = detail.config;
  const isFounding = config.plan === "founding_creator";
  const cadence = config.plan.endsWith("annual") ? "/yr" : "/mo";

  return (
    <Sheet open={open} onOpenChange={(v) => (!v ? close(true) : undefined)}>
      <SheetContent
        side="right"
        className="w-full max-w-md overflow-y-auto"
      >
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Secure checkout
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              via {detail.providerLabel} (mock)
            </span>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          <div
            className={`rounded-2xl p-4 ${
              isFounding
                ? "border border-amber-400/40 bg-amber-400/5"
                : "bg-surface-2"
            }`}
          >
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">
              {isFounding ? "Founding Creator" : config.plan.replace("_", " ")}
            </p>
            <p className="mt-1 text-2xl font-semibold">
              {formatPrice(config.amount, locale)}
              <span className="text-sm text-muted-foreground">
                {isFounding ? " once" : cadence}
              </span>
            </p>
            <p className="mt-2 text-xs text-muted-foreground">
              {isFounding ? (
                <>
                  <Sparkles className="mr-1 inline h-3 w-3 text-amber-500" />
                  5 years of Pro access · never renews
                </>
              ) : (
                "Cancel anytime"
              )}
            </p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                Card number
              </label>
              <div className="mt-1.5 flex items-center rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="kp-mono flex-1 bg-transparent outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  Expiry
                </label>
                <input
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="kp-mono mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
                  CVC
                </label>
                <input
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="kp-mono mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <Button
            loaderClick
            isLoading={loading}
            onClick={handlePay}
            size="lg"
            className="w-full"
          >
            Pay {formatPrice(config.amount, locale)}
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Mock checkout · no real charge
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}
