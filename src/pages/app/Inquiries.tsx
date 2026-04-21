import { useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { AppPageSkeleton } from "@/components/kit/AppPageSkeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { MOCK_INQUIRIES } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Mail, Reply, CheckCheck, Archive } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type InquiryStatus = "new" | "replied" | "archived";

export default function Inquiries() {
  const { loading } = usePageLoader();
  const [items, setItems] = useState(
    MOCK_INQUIRIES.map((i) => ({ ...i, status: i.status as InquiryStatus })),
  );
  const [activeId, setActiveId] = useState(items[0]?.id ?? "");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sending, setSending] = useState(false);
  const [marking, setMarking] = useState(false);

  if (loading)
    return (
      <AppPage>
        <div className="space-y-3">
          <div className="h-9 w-48 kp-skeleton" />
          <div className="h-4 w-96 kp-skeleton" />
          <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_1.4fr]">
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-20 kp-skeleton" />
              ))}
            </div>
            <div className="h-96 kp-skeleton" />
          </div>
        </div>
      </AppPage>
    );

  const active = items.find((i) => i.id === activeId) ?? items[0];

  const handleSend = () => {
    setSending(true);
    window.setTimeout(() => {
      setItems(items.map((i) => (i.id === active.id ? { ...i, status: "replied" } : i)));
      setSending(false);
      setReplyOpen(false);
      setReplyText("");
      toast({ title: "Reply sent", description: `Email delivered to ${active.email}.` });
    }, 1100);
  };

  const handleMarkReplied = () => {
    setMarking(true);
    window.setTimeout(() => {
      setItems(items.map((i) => (i.id === active.id ? { ...i, status: "replied" } : i)));
      setMarking(false);
      toast({ title: "Marked as replied" });
    }, 700);
  };

  return (
    <AppPage>
      <AppHeader
        title="Inquiries"
        description="Inbound brand inquiries from your kit page. Stored, structured, searchable."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        {/* List */}
        <div className="kp-card overflow-hidden">
          {items.map((i) => {
            const isActive = active.id === i.id;
            return (
              <button
                key={i.id}
                onClick={() => setActiveId(i.id)}
                className={`flex w-full items-start gap-3 border-b border-border p-4 text-left transition ${
                  isActive ? "bg-surface-2" : "hover:bg-surface"
                }`}
              >
                <span
                  className={`mt-1 h-2 w-2 shrink-0 rounded-full ${
                    i.status === "new" ? "bg-primary" : i.status === "replied" ? "bg-success" : "bg-muted"
                  }`}
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">{i.brandName}</p>
                    <span className="kp-mono text-[10px] text-muted-foreground">
                      {new Date(i.receivedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">
                    {i.contactName} · {i.budget}
                  </p>
                  <p className="mt-1 line-clamp-1 text-xs text-foreground/70">{i.summary}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detail */}
        <div className="kp-card flex min-h-[480px] flex-col p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="kp-display text-2xl">{active.brandName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {active.contactName} · <span className="kp-mono">{active.email}</span>
              </p>
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs ${
                active.status === "new"
                  ? "bg-primary-highlight text-primary"
                  : active.status === "replied"
                    ? "bg-success/15 text-success"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {active.status === "new" ? "New" : active.status === "replied" ? "Replied" : "Archived"}
            </span>
          </div>
          <div className="kp-divider my-6" />
          <div className="grid gap-3 text-xs sm:grid-cols-3">
            <DetailRow label="Budget" value={active.budget} />
            <DetailRow label="Received" value={new Date(active.receivedAt).toLocaleString()} />
            <DetailRow label="Source" value={`/${active.brandName.toLowerCase().replace(/\s+/g, "")}`} />
          </div>
          <p className="mt-6 flex-1 text-sm leading-relaxed text-foreground/85 whitespace-pre-wrap">
            {active.summary}
          </p>
          <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-6">
            <Button onClick={() => setReplyOpen(true)} className="rounded-full">
              <Reply className="h-4 w-4" /> Reply
            </Button>
            <Button
              variant="outline"
              loaderClick
              isLoading={marking}
              onClick={handleMarkReplied}
              className="rounded-full"
              disabled={active.status === "replied"}
            >
              <CheckCheck className="h-4 w-4" /> Mark as replied
            </Button>
            <Button variant="outline" className="rounded-full">
              <Archive className="h-4 w-4" /> Archive
            </Button>
            <a
              href={`mailto:${active.email}`}
              className="ml-auto inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
            >
              <Mail className="h-3.5 w-3.5" /> Open in mail client
            </a>
          </div>
        </div>
      </div>

      {/* Reply sheet */}
      <Sheet open={replyOpen} onOpenChange={setReplyOpen}>
        <SheetContent className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Reply to {active.brandName}</SheetTitle>
            <SheetDescription>
              Sent from your verified workspace email. The brand will reply directly to you.
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-3">
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                To
              </label>
              <input
                value={active.email}
                readOnly
                className="kp-mono mt-1 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
              />
            </div>
            <div>
              <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Message
              </label>
              <textarea
                rows={10}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder={`Hi ${active.contactName.split(" ")[0]},\n\nThanks for reaching out about your campaign…`}
                className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>
          <SheetFooter className="mt-6">
            <Button variant="outline" onClick={() => setReplyOpen(false)}>
              Cancel
            </Button>
            <Button loaderClick isLoading={sending} onClick={handleSend} disabled={!replyText.trim()}>
              <Reply className="h-4 w-4" /> Send reply
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </AppPage>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-2 p-3">
      <p className="text-[9px] uppercase tracking-[0.16em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}
