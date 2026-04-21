import { useEffect, useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import { usePlanStore } from "@/store/plan";
import { toast } from "@/hooks/use-toast";

/**
 * Mounted at the app root. Auto-opens the moment status === "expired".
 * Non-dismissable — Escape and overlay click both blocked.
 */
export function GraceExpiredModal() {
  const { status, jumpToState } = usePlanStore();
  const [loading, setLoading] = useState<boolean>(false);

  const open = status === "expired";

  // Hard-block dismiss while expired
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.stopPropagation();
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [open]);

  const handleResubscribe = () => {
    setLoading(true);
    window.setTimeout(() => {
      jumpToState("active");
      setLoading(false);
      toast({
        title: "Welcome back",
        description: "Your Creator plan is active again.",
      });
    }, 1400);
  };

  return (
    <Dialog open={open}>
      <DialogContent
        className="max-w-md [&>button]:hidden"
        onInteractOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center text-center">
          <div className="grid h-14 w-14 place-items-center rounded-full bg-destructive/15 text-destructive">
            <ShieldAlert className="h-7 w-7" />
          </div>
          <h2 className="mt-4 text-xl font-semibold">Your access has ended</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            We weren't able to renew your subscription. Resubscribe to restore
            your page features and analytics.
          </p>
          <Button
            loaderClick
            isLoading={loading}
            onClick={handleResubscribe}
            className="mt-6 w-full"
            size="lg"
          >
            Resubscribe to Creator — $12/mo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/**
 * Listens for status === "trial_expired" and runs the auto-renew toast
 * sequence: 3000ms → "Attempting to process your payment..."
 * 2000ms later → "Payment could not be processed" → grace_period.
 */
export function AutoRenewSimulator() {
  const { status, enterGracePeriod } = usePlanStore();

  useEffect(() => {
    if (status !== "trial_expired") return;
    const t1 = window.setTimeout(() => {
      toast({ title: "Attempting to process your payment..." });
      const t2 = window.setTimeout(() => {
        toast({
          title: "Payment could not be processed",
          description: "We'll keep your access active for 48 hours.",
          variant: "destructive",
        });
        enterGracePeriod(48);
      }, 2000);
      return () => window.clearTimeout(t2);
    }, 3000);
    return () => window.clearTimeout(t1);
  }, [status, enterGracePeriod]);

  return null;
}