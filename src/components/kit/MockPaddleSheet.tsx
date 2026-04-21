import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";

interface MockPaddleSheetProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  planLabel: "Creator" | "Pro";
  priceUSD: number;
}

export function MockPaddleSheet({ open, onClose, onSuccess, planLabel, priceUSD }: MockPaddleSheetProps) {
  const locale = useLocaleStore();
  const [card, setCard] = useState<string>("4242 4242 4242 4242");
  const [exp, setExp] = useState<string>("12/29");
  const [cvc, setCvc] = useState<string>("123");
  const [loading, setLoading] = useState<boolean>(false);

  const handlePay = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <Sheet open={open} onOpenChange={(v) => (!v ? onClose() : undefined)}>
      <SheetContent side="right" className="w-full max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Lock className="h-4 w-4" /> Secure checkout
          </SheetTitle>
        </SheetHeader>
        <div className="mt-6 space-y-5">
          <div className="rounded-2xl bg-surface-2 p-4">
            <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{planLabel} plan</p>
            <p className="mt-1 text-2xl font-semibold">{formatPrice(priceUSD, locale)}<span className="text-sm text-muted-foreground"> /mo</span></p>
            <p className="mt-2 text-xs text-muted-foreground">7-day free trial · cancel anytime</p>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Card number</label>
              <div className="mt-1.5 flex items-center rounded-xl border border-border bg-background px-4 py-3 text-sm">
                <CreditCard className="mr-2 h-4 w-4 text-muted-foreground" />
                <input
                  value={card}
                  onChange={(e) => setCard(e.target.value)}
                  className="flex-1 bg-transparent kp-mono outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Expiry</label>
                <input
                  value={exp}
                  onChange={(e) => setExp(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm kp-mono outline-none focus:border-primary"
                />
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">CVC</label>
                <input
                  value={cvc}
                  onChange={(e) => setCvc(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm kp-mono outline-none focus:border-primary"
                />
              </div>
            </div>
          </div>

          <Button loaderClick isLoading={loading} onClick={handlePay} size="lg" className="w-full">
            Start trial — {formatPrice(priceUSD, locale)}/mo after 7 days
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Powered by mock Paddle · No real charge
          </p>
        </div>
      </SheetContent>
    </Sheet>
  );
}