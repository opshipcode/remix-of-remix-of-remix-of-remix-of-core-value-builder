import { useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { MOCK_TESTIMONIALS } from "@/lib/mockData";
import { Copy, Star, Verified, Check } from "lucide-react";

export default function Testimonials() {
  const [copied, setCopied] = useState(false);
  const link = "https://kitpager.pro/review/k7s2-9f3a-bb1c";

  function copy() {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 1600);
  }

  return (
    <AppPage>
      <AppHeader
        title="Testimonials"
        description="Collect social proof from past brand collaborators with a single secure link."
      />

      <div className="kp-card mb-8 p-6">
        <h2 className="text-lg font-semibold">Request a testimonial</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Send this link to a brand. They submit their testimonial via a Turnstile-protected form — no account required.
        </p>
        <div className="mt-5 flex flex-col gap-3 md:flex-row">
          <input
            value={link}
            readOnly
            className="kp-mono w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
          />
          <button
            onClick={copy}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
          >
            {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
      </div>

      <h2 className="kp-display mb-4 text-2xl">Approved</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {MOCK_TESTIMONIALS.map((t) => (
          <div key={t.id} className="kp-card p-5">
            <div className="flex items-center gap-1 text-primary">
              {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </div>
            <p className="mt-3 text-sm">{t.text}</p>
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <span>{t.brandContactName} · {t.brandName}</span>
              {t.isVerified && <Verified className="h-3.5 w-3.5 text-primary" />}
            </div>
            <div className="mt-4 flex gap-2 border-t border-border pt-4">
              <button className="flex-1 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-surface-2">Hide</button>
              <button className="flex-1 rounded-full border border-destructive/40 px-3 py-1.5 text-xs text-destructive hover:bg-destructive/10">Delete</button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="kp-display mb-4 mt-12 text-2xl">Pending approval</h2>
      <div className="kp-card divide-y divide-border">
        {[1, 2].map((i) => (
          <div key={i} className="flex flex-col items-start gap-3 p-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-medium">Linear · Jamie Foster</p>
              <p className="mt-1 text-sm text-muted-foreground">"Easiest creator we worked with all quarter…"</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-full bg-primary px-4 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-hover">Approve</button>
              <button className="rounded-full border border-border px-4 py-1.5 text-xs hover:bg-surface-2">Reject</button>
            </div>
          </div>
        ))}
      </div>
    </AppPage>
  );
}
