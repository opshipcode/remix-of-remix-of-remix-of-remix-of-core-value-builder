import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { Logo } from "@/components/kit/Logo";
import { ThemeToggle } from "@/components/kit/ThemeToggle";
import { Button } from "@/components/ui/button";
import { useKitPageStore } from "@/store/kitPage";
import { Star, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FingerprintRecord {
  fp: string;
  at: number;
}

const LOCK_HOURS = 12;

export default function CreatorReviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const data = useKitPageStore((s) => s.data);

  const matchesCreator = !!slug && data.slug.toLowerCase() === slug.toLowerCase();

  const [fp, setFp] = useState<string | null>(null);
  const [lockedUntil, setLockedUntil] = useState<number | null>(null);

  const [fullName, setFullName] = useState("");
  const [brand, setBrand] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const visibleTestimonials = useMemo(
    () =>
      data.testimonials
        .filter((t) => t.visible && t.status === "approved")
        .slice(0, 6),
    [data.testimonials],
  );

  const avg = useMemo(() => {
    if (data.testimonials.length === 0) return 0;
    const sum = data.testimonials.reduce((acc, t) => acc + t.rating, 0);
    return sum / data.testimonials.length;
  }, [data.testimonials]);

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      const agent = await FingerprintJS.load();
      const result = await agent.get();
      if (cancelled) return;
      setFp(result.visitorId);

      try {
        const raw = window.localStorage.getItem(`kp_review_${slug ?? ""}`);
        if (raw) {
          const rec = JSON.parse(raw) as FingerprintRecord;
          if (rec.fp === result.visitorId) {
            const lockTs = rec.at + LOCK_HOURS * 60 * 60 * 1000;
            if (lockTs > Date.now()) {
              setLockedUntil(lockTs);
            }
          }
        }
      } catch {
        // ignore
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (!matchesCreator) {
    return (
      <div className="grid min-h-[100dvh] place-items-center bg-background p-6 text-center">
        <div>
          <Logo size="lg" />
          <p className="mt-4 text-sm text-muted-foreground">Creator not found.</p>
          <Link to="/" className="mt-4 inline-block text-sm text-primary hover:underline">
            Go home
          </Link>
        </div>
      </div>
    );
  }

  const submit = () => {
    if (lockedUntil) return;
    if (!fullName.trim() || !brand.trim()) {
      toast({ title: "Fill in your name and brand", variant: "destructive" });
      return;
    }
    if (rating === 0) {
      toast({ title: "Pick a star rating", variant: "destructive" });
      return;
    }
    if (review.trim().length < 20) {
      toast({ title: "Review must be at least 20 characters", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      if (fp) {
        const rec: FingerprintRecord = { fp, at: Date.now() };
        window.localStorage.setItem(`kp_review_${slug ?? ""}`, JSON.stringify(rec));
      }
      setSubmitted(true);
      setSubmitting(false);
    }, 1200);
  };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground">
      <header className="flex items-center justify-between border-b border-border px-4 py-3 md:px-8">
        <Logo size="md" />
        <ThemeToggle />
      </header>

      <main className="mx-auto max-w-2xl px-4 py-10 md:px-6 md:py-16">
        <div className="text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-primary to-primary-active text-2xl font-bold text-primary-foreground">
            {data.displayName.split(" ").map((s) => s[0]).join("").slice(0, 2)}
          </div>
          <h1 className="kp-display mt-5 text-3xl md:text-4xl">{data.displayName}</h1>
          <p className="mt-2 text-sm text-muted-foreground">{data.tagline}</p>
          <p className="kp-mono mt-2 text-xs text-muted-foreground">
            {data.platforms.map((p) => p.handle).join(" · ")}
          </p>

          <div className="mt-8 inline-flex flex-col items-center">
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-6 w-6 ${
                    n <= Math.round(avg) ? "fill-primary text-primary" : "text-muted-foreground/30"
                  }`}
                />
              ))}
              <span className="kp-display ml-2 text-2xl">{avg.toFixed(1)}</span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              {data.testimonials.length} reviews
            </p>
          </div>
        </div>

        {visibleTestimonials.length > 0 && (
          <section className="mt-12 grid gap-3 md:grid-cols-2">
            {visibleTestimonials.map((t) => (
              <div key={t.id} className="kp-card p-5">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-2 text-sm">"{t.quote}"</p>
                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <span>
                    {t.reviewerName} · {t.brandName}
                  </span>
                  {t.verified && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <ShieldCheck className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </section>
        )}

        <section className="mt-14">
          <h2 className="kp-display text-2xl">Leave a review</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Share your experience working with {data.displayName.split(" ")[0]}.
          </p>

          {submitted ? (
            <div className="kp-card mt-6 p-8 text-center">
              <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <p className="mt-3 text-sm font-medium">
                Your review has been submitted for approval. Thank you.
              </p>
            </div>
          ) : lockedUntil ? (
            <div className="kp-card mt-6 p-6 text-center">
              <p className="text-sm text-muted-foreground">
                You've already submitted a review recently. Please try again after 12 hours.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              <FormField label="Full name" value={fullName} onChange={setFullName} />
              <FormField label="Company / brand" value={brand} onChange={setBrand} />

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Rating
                </label>
                <div
                  className="mt-2 flex items-center gap-1"
                  onMouseLeave={() => setHoverRating(0)}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      onMouseEnter={() => setHoverRating(n)}
                      aria-label={`Rate ${n} stars`}
                    >
                      <Star
                        className={`h-7 w-7 transition ${
                          n <= (hoverRating || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/30"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Review
                </label>
                <textarea
                  value={review}
                  onChange={(e) => setReview(e.target.value.slice(0, 500))}
                  rows={5}
                  placeholder="What was it like working together?"
                  className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1 text-right text-[10px] text-muted-foreground">
                  {review.length}/500 (min 20)
                </p>
              </div>

              <div className="rounded-xl border border-dashed border-border bg-surface px-4 py-3 text-center text-xs text-muted-foreground">
                Cloudflare Turnstile widget will load here.
              </div>

              <Button
                size="lg"
                className="w-full"
                loaderClick
                isLoading={submitting}
                onClick={submit}
              >
                Submit review
              </Button>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

function FormField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}
