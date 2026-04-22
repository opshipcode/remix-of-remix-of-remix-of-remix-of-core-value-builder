import { useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { AppPageSkeleton } from "@/components/kit/AppPageSkeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useKitPageStore, type Testimonial } from "@/store/kitPage";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Copy, Star, Verified, Check, Eye, EyeOff, Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type ConfirmKind = "approve" | "reject" | "hide" | "show" | "delete";

interface ConfirmState {
  kind: ConfirmKind;
  testimonial: Testimonial;
}

const PENDING_MOCK: Testimonial[] = [
  {
    id: "p1",
    quote: "Easiest creator we worked with all quarter. Brief landed perfectly first try.",
    reviewerName: "Jamie Foster",
    brandName: "Linear",
    rating: 5,
    verified: true,
    visible: false,
    status: "pending",
    brandLogoUrl: null,
  },
  {
    id: "p2",
    quote: "Conversion lift on the launch was 28% above benchmark. Will rebook.",
    reviewerName: "Priya Shah",
    brandName: "Arc",
    rating: 5,
    verified: false,
    visible: false,
    status: "pending",
    brandLogoUrl: null,
  },
];

export default function Testimonials() {
  const { loading } = usePageLoader();
  const data = useKitPageStore((s) => s.data);
  const setData = useKitPageStore((s) => s.setData);

  const [pending, setPending] = useState(PENDING_MOCK);
  const [copied, setCopied] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);
  const [busy, setBusy] = useState(false);

  const link = `https://kitpager.co/${data.slug}/review`;

  if (loading) return <AppPage><AppPageSkeleton cards={3} /></AppPage>;

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  function commitConfirm() {
    if (!confirm) return;
    setBusy(true);
    window.setTimeout(() => {
      const t = confirm.testimonial;
      switch (confirm.kind) {
        case "approve": {
          setPending(pending.filter((p) => p.id !== t.id));
          setData({
            testimonials: [...data.testimonials, { ...t, status: "approved", visible: true }],
          });
          toast({ title: "Approved", description: `Testimonial from ${t.brandName} is live.` });
          break;
        }
        case "reject": {
          setPending(pending.filter((p) => p.id !== t.id));
          toast({ title: "Rejected", description: `Removed from inbox.` });
          break;
        }
        case "hide":
        case "show": {
          setData({
            testimonials: data.testimonials.map((x) =>
              x.id === t.id ? { ...x, visible: confirm.kind === "show" } : x,
            ),
          });
          toast({ title: confirm.kind === "show" ? "Now visible" : "Hidden" });
          break;
        }
        case "delete": {
          setData({ testimonials: data.testimonials.filter((x) => x.id !== t.id) });
          toast({ title: "Deleted", description: `Testimonial removed.` });
          break;
        }
      }
      setBusy(false);
      setConfirm(null);
    }, 800);
  }

  return (
    <AppPage>
      <AppHeader
        title="Testimonials"
        description="Collect social proof from past brand collaborators with a single secure link."
      />

      <div className="kp-card mb-8 p-6">
        <h2 className="text-lg font-semibold">Public review link</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Share this public link with past brand partners to collect verified reviews. Anyone with the link can leave a review — protected by Turnstile and per-visitor rate limiting.
        </p>
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={link}
            readOnly
            className="kp-mono w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
          />
          <Button onClick={copy} className="rounded-xl">
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          Need to invite one specific brand contact privately? Send them a single-use invite link from the inquiry thread instead.
        </p>
      </div>

      <h2 className="kp-display mb-4 text-2xl">Pending approval ({pending.length})</h2>
      <div className="kp-card mb-12 divide-y divide-border">
        {pending.length === 0 && (
          <p className="p-6 text-sm text-muted-foreground">No pending testimonials.</p>
        )}
        {pending.map((t) => (
          <div key={t.id} className="flex flex-col items-start gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="text-sm font-medium">
                {t.brandName} · {t.reviewerName}
                {t.verified && <Verified className="ml-1 inline h-3.5 w-3.5 text-primary" />}
              </p>
              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">"{t.quote}"</p>
            </div>
            <div className="flex shrink-0 gap-2">
              <Button size="sm" onClick={() => setConfirm({ kind: "approve", testimonial: t })}>
                Approve
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setConfirm({ kind: "reject", testimonial: t })}
              >
                Reject
              </Button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="kp-display mb-4 text-2xl">Approved ({data.testimonials.length})</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {data.testimonials.map((t) => (
          <div key={t.id} className="kp-card p-5">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: t.rating }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-3 text-sm">"{t.quote}"</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.reviewerName} · {t.brandName}</span>
              {t.verified && <Verified className="h-3.5 w-3.5 text-primary" />}
            </div>
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirm({ kind: t.visible ? "hide" : "show", testimonial: t })}
                className="flex-1"
              >
                {t.visible ? <><EyeOff className="h-3.5 w-3.5" /> Hide</> : <><Eye className="h-3.5 w-3.5" /> Show</>}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setConfirm({ kind: "delete", testimonial: t })}
                className="flex-1 border-destructive/40 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </Button>
            </div>
          </div>
        ))}
      </div>

      <AlertDialog open={!!confirm} onOpenChange={(v) => !v && setConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{titleFor(confirm?.kind)}</AlertDialogTitle>
            <AlertDialogDescription>{descriptionFor(confirm)}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <Button
                loaderClick
                isLoading={busy}
                onClick={commitConfirm}
                variant={confirm?.kind === "delete" || confirm?.kind === "reject" ? "destructive" : "default"}
              >
                {actionLabel(confirm?.kind)}
              </Button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppPage>
  );
}

function titleFor(k?: ConfirmKind) {
  switch (k) {
    case "approve": return "Approve and publish?";
    case "reject": return "Reject testimonial?";
    case "hide": return "Hide from kit page?";
    case "show": return "Show on kit page?";
    case "delete": return "Delete testimonial?";
    default: return "Confirm";
  }
}
function descriptionFor(c: ConfirmState | null) {
  if (!c) return "";
  switch (c.kind) {
    case "approve":
      return `"${c.testimonial.quote.slice(0, 80)}…" will appear on your public kit page.`;
    case "reject":
      return `Permanently remove this testimonial from your inbox. The brand will not be notified.`;
    case "hide":
      return `Visitors won't see this testimonial. You can show it again later.`;
    case "show":
      return `Make this testimonial visible on your public kit page.`;
    case "delete":
      return `Permanently delete this testimonial. This cannot be undone.`;
  }
}
function actionLabel(k?: ConfirmKind) {
  if (k === "approve") return "Approve";
  if (k === "delete") return "Delete";
  if (k === "reject") return "Reject";
  if (k === "show") return "Show";
  if (k === "hide") return "Hide";
  return "Confirm";
}
