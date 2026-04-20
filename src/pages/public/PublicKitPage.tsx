import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";
import { MOCK_CREATOR, MOCK_PLATFORMS, MOCK_CONTENT_ITEMS, MOCK_TESTIMONIALS, MOCK_RATES, formatNumber, formatPercent } from "@/lib/mockData";
import { Link } from "react-router-dom";
import { Mail, Star, Verified, Lock } from "lucide-react";

/**
 * Public /:slug page rendered with the Minimal template by default.
 * In Phase 2, this will hydrate from page_publications.publication_json (cached).
 * For now, this renders mock data with full polish.
 */
export default function PublicKitPage() {
  const c = MOCK_CREATOR;
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section className="bg-hero">
        <div className="kp-container py-16 md:py-24">
          <div className="grid gap-10 md:grid-cols-[auto_1fr] md:items-center">
            <div className="grid h-32 w-32 place-items-center overflow-hidden rounded-full bg-surface-2">
              <ImagePlaceholder
                aspect="square"
                title={`${c.displayName} avatar`}
                dimensions="512x512"
                orientation="square"
                description="Square portrait avatar of the creator. Faces ALLOWED here only because it's a creator-uploaded asset."
                background="any"
                facesAllowed={true}
                usage="Public kit hero avatar"
                format="png/jpg"
                className="rounded-full"
              />
            </div>
            <div>
              <p className="kp-mono text-xs text-muted-foreground">kitpager.pro/{c.slug}</p>
              <h1 className="kp-display mt-2 text-5xl text-foreground md:text-6xl">{c.displayName}</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{c.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.niches.map((n) => (
                  <span key={n} className="rounded-full border border-border bg-surface px-3 py-1 text-xs text-foreground/80">{n}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <a href={`mailto:${c.contactEmail}`} className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition hover:opacity-90">
                  <Mail className="h-4 w-4" /> Email me
                </a>
                <a href="#inquiry" className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition hover:bg-surface-2">
                  Send a brand inquiry
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="kp-container py-16">
        <h2 className="kp-display text-3xl">Audience</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {MOCK_PLATFORMS.map((p) => (
            <div key={p.platform} className="kp-card p-6">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold capitalize">{p.platform}</p>
                {p.verified && <Verified className="h-4 w-4 text-primary" />}
              </div>
              <p className="kp-mono mt-1 text-xs text-muted-foreground">{p.handle}</p>
              <p className="kp-display mt-4 text-4xl">{formatNumber(p.followers)}</p>
              <p className="text-xs text-muted-foreground">followers</p>
              <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground">Avg views</p>
                  <p className="font-medium">{formatNumber(p.avgViews)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Engagement</p>
                  <p className="font-medium">{formatPercent(p.engagementRate)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Live Proof */}
      <section className="border-t border-border bg-surface py-16">
        <div className="kp-container">
          <h2 className="kp-display text-3xl">Recent work</h2>
          <p className="mt-1 text-sm text-muted-foreground">Live metrics, refreshed every 24 hours.</p>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {MOCK_CONTENT_ITEMS.map((item) => (
              <div key={item.id} className="kp-card overflow-hidden">
                <div className="aspect-video bg-surface-2" />
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.platform}</span>
                    {item.metricSource === "manual" && (
                      <span className="text-xs text-muted-foreground">(self-reported)</span>
                    )}
                  </div>
                  <p className="mt-2 font-medium">{item.title}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-sm">
                    <Stat label="Views" v={formatNumber(item.viewCount)} />
                    <Stat label="Likes" v={formatNumber(item.likeCount)} />
                    <Stat label="ER" v={formatPercent(item.engagementRate)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="kp-container py-16">
        <h2 className="kp-display text-3xl">Brand testimonials</h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {MOCK_TESTIMONIALS.map((t) => (
            <div key={t.id} className="kp-card p-6">
              <div className="flex items-center gap-1 text-primary">
                {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
              </div>
              <p className="mt-4 text-sm text-foreground/80">"{t.text}"</p>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-medium">{t.brandContactName}, {t.brandName}</span>
                {t.isVerified && <Verified className="h-3.5 w-3.5 text-primary" />}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Rates */}
      <section className="border-t border-border bg-surface py-16">
        <div className="kp-container">
          <h2 className="kp-display text-3xl">Rates</h2>
          <div className="kp-card mt-6 overflow-hidden">
            {MOCK_RATES.map((r, i) => (
              <div key={r.id} className={`flex items-center justify-between p-5 ${i > 0 ? "border-t border-border" : ""}`}>
                <div>
                  <p className="font-medium">{r.deliverable}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{r.notes}</p>
                </div>
                {r.isPrivate ? (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs text-muted-foreground">
                    <Lock className="h-3 w-3" /> Request via inquiry
                  </span>
                ) : (
                  <span className="kp-display text-2xl">{r.priceLabel}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inquiry */}
      <section id="inquiry" className="kp-container py-16">
        <div className="kp-card mx-auto max-w-2xl p-8 md:p-10">
          <h2 className="kp-display text-3xl">Work together</h2>
          <p className="mt-1 text-sm text-muted-foreground">I reply within 48 hours.</p>
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <Input label="Your name" />
            <Input label="Work email" type="email" />
            <Input label="Brand / company" />
            <Input label="Company website" />
            <Input label="Budget range" />
            <Input label="Campaign timeline" />
            <div className="md:col-span-2">
              <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Brief</label>
              <textarea rows={4} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
            </div>
            <button className="md:col-span-2 inline-flex items-center justify-center rounded-full bg-foreground px-5 py-3 text-sm font-medium text-background hover:opacity-90">Send inquiry</button>
          </form>
          <p className="mt-3 text-center text-xs text-muted-foreground">Protected by Cloudflare Turnstile</p>
        </div>
      </section>

      <footer className="border-t border-border py-8 text-center text-xs text-muted-foreground">
        <p>
          Built with{" "}
          <Link to="/" className="text-foreground hover:text-primary">KitPager</Link>
        </p>
      </footer>
    </div>
  );
}

function Stat({ label, v }: { label: string; v: string }) {
  return (
    <div className="rounded-lg bg-surface-2 p-2 text-center">
      <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
      <p className="kp-mono text-sm font-medium">{v}</p>
    </div>
  );
}

function Input({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input type={type} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
