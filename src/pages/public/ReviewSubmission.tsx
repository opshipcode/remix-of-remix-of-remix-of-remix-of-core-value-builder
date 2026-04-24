import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Star, Upload, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Logo } from "@/components/kit/Logo";

export default function ReviewSubmission() {
  const { token } = useParams();
  const [rating, setRating] = useState(5);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="kp-container flex h-16 items-center justify-between">
          <Link to="/"><Logo /></Link>
          <span className="kp-mono text-xs text-muted-foreground">{token?.slice(0, 8)}…</span>
        </div>
      </header>

      <main className="kp-container max-w-2xl py-0">
        {submitted ? (
          <div className="kp-card p-10 mt-20 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
              <CheckCircle2 className="h-6 w-6" />
            </span>
            <h1 className="kp-display mt-5 text-3xl">Thank you</h1>
            <p className="mt-2 text-sm text-muted-foreground">Your testimonial has been submitted. Thank you!</p>
          </div>
        ) : (
          <div className="mt-[-15px]">
            <p className="kp-eyebrow inline-flex">testimonial</p>
            <h1 className="kp-display mt-5 text-4xl">Share your experience working with Alex Rivera</h1>
            <p className="mt-3 text-muted-foreground">
              Your testimonial will appear on the creator's KitPager page after they approve it. Verified via secure token.
            </p>

            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
              className="kp-card mt-8 space-y-5 p-6 md:p-8"
            >
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Your name" required />
                <Field label="Brand / company" required />
              </div>
              <Field label="Your role" placeholder="Brand Manager" />

              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Rating</label>
                <div className="mt-2 flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className="p-1"
                      aria-label={`${n} stars`}
                    >
                      <Star className={`h-7 w-7 transition ${n <= rating ? "fill-primary text-primary" : "text-muted-foreground"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Your testimonial</label>
                <textarea
                  required
                  rows={5}
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="What was it like working with this creator?"
                />
              </div>

              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Brand logo (optional)</label>
                <button type="button" className="mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-surface px-4 py-6 text-sm text-muted-foreground hover:bg-surface-2">
                  <Upload className="h-4 w-4" /> Upload SVG or PNG
                </button>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-xl bg-surface-2 p-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Protected by Cloudflare Turnstile
                </span>
                <span className="kp-mono">verified</span>
              </div>

              <button className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                Submit testimonial
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}

function Field({ label, placeholder, required }: { label: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        required={required}
        placeholder={placeholder}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
