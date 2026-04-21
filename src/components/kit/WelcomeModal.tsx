import { useEffect, useState } from "react";
import { Copy, Check, ExternalLink, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth";

const WELCOMED_KEY = "kp_welcomed";

export function WelcomeModal() {
  const user = useAuthStore((s) => s.user);
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!user) return;
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(WELCOMED_KEY) === "true") return;
    setOpen(true);
  }, [user]);

  const handleClose = () => {
    window.localStorage.setItem(WELCOMED_KEY, "true");
    setOpen(false);
  };

  const url = `kitpager.co/${user?.slug ?? "you"}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(`https://${url}`).catch(() => undefined);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => (!v ? handleClose() : undefined)}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mb-1 inline-flex items-center gap-1.5 self-start rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
            <Sparkles className="h-3 w-3" />
            You're in
          </div>
          <DialogTitle className="text-2xl">
            Your page is live
          </DialogTitle>
          <DialogDescription>
            Brands can find you at the link below. Keep building to make it shine.
          </DialogDescription>
        </DialogHeader>

        <button
          type="button"
          onClick={handleCopy}
          className="flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-surface-2 px-3 py-2.5 text-sm transition-colors hover:bg-surface-offset"
        >
          <span className="kp-mono truncate text-foreground">{url}</span>
          {copied ? (
            <span className="inline-flex items-center gap-1 text-success">
              <Check className="h-4 w-4" />
              Copied
            </span>
          ) : (
            <Copy className="h-4 w-4 text-muted-foreground" />
          )}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            asChild
            onClick={handleClose}
          >
            <a
              href={`/${user?.slug ?? ""}`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open my page
            </a>
          </Button>
          <Button onClick={handleClose}>Start building</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
