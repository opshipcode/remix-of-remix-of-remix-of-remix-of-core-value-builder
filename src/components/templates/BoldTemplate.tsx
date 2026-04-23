import { motion } from "framer-motion";
import { Mail, Send, Star, Verified, Play, Eye, Heart, Lock, ArrowRight, Sparkles } from "lucide-react";
import type { TemplateProps } from "./types";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { AudienceSection } from "@/components/audience/AudienceSection";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function BoldTemplate({ data }: TemplateProps) {
  const locale = useLocaleStore();
  const visiblePlatforms = data.platforms.filter((p) => p.visible);
  const visibleTestimonials = data.testimonials.filter((t) => t.visible && t.status === "approved");

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* HERO — full bleed gradient + huge type */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: "var(--gradient-primary)" }} />
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage:
            "radial-gradient(circle at 15% 20%, hsl(0 0% 100% / 0.25), transparent 45%), radial-gradient(circle at 85% 80%, hsl(280 100% 70% / 0.5), transparent 45%)",
        }} />
        <div className="relative px-8 pb-32 pt-16 md:px-16 md:pb-44 md:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-primary-foreground backdrop-blur">
              <Sparkles className="h-3 w-3" /> Available for collabs
            </span>
            <h1 className="kp-display mt-6 text-6xl leading-[0.92] text-primary-foreground md:text-[120px]">
              {data.displayName}
            </h1>
            <p className="mt-6 max-w-2xl text-lg text-primary-foreground/90 md:text-2xl">
              {data.tagline}
            </p>
            {data.nicheTags.length > 0 && (
              <div className="mt-7 flex flex-wrap gap-2">
                {data.nicheTags.map((n) => (
                  <span key={n} className="rounded-full bg-background/20 px-3 py-1 text-xs text-primary-foreground backdrop-blur">
                    {n}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-9 flex flex-wrap gap-3">
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90"
              >
                <Send className="h-4 w-4" /> Pitch a collab
              </a>
              <a
                href={`mailto:${data.contactEmail}`}
                className="inline-flex items-center gap-2 rounded-full border border-background/40 bg-background/10 px-6 py-3 text-sm text-primary-foreground hover:bg-background/20"
              >
                <Mail className="h-4 w-4" /> {data.contactEmail}
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* PLATFORM BENTO STATS — overlapping the hero */}
      {visiblePlatforms.length > 0 && (
        <section className="px-8 md:px-16">
          <div className="-mt-20 grid gap-3 sm:grid-cols-3 md:-mt-24">
            {visiblePlatforms.slice(0, 3).map((p) => (
              <div key={p.id} className="kp-card p-6 shadow-lg">
                <p className="kp-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                  {p.platform}
                </p>
                <p className="kp-display mt-2 text-4xl">{fmt(p.followers)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.handle}</p>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-3">
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">Avg views</p>
                    <p className="kp-mono text-sm">{fmt(p.avgViews)}</p>
                  </div>
                  <div>
                    <p className="text-[9px] uppercase tracking-[0.14em] text-muted-foreground">ER</p>
                    <p className="kp-mono text-sm">{p.engagementRate.toFixed(1)}%</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <AudienceSection audience={data.audience} variant="bold" />

      {/* ABOUT — large quote-style */}
      <section className="px-8 py-20 md:px-16">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="kp-display text-4xl text-primary md:text-5xl">About me</h2>
          <p className="text-lg leading-relaxed text-foreground/90 md:text-xl">{data.bio}</p>
        </div>
      </section>

      {/* CONTENT — bento masonry feel */}
      {data.contentGallery.length > 0 && (
        <section className="bg-surface/60 px-8 py-20 md:px-16">
          <div className="mb-10 flex items-end justify-between">
            <h2 className="kp-display text-4xl md:text-5xl">Recent drops</h2>
            <span className="text-xs text-muted-foreground">Live metrics · 24h refresh</span>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {data.contentGallery.map((c, i) => (
              <div
                key={c.id}
                className={`kp-card kp-card-hover overflow-hidden ${i === 0 ? "md:col-span-2 md:row-span-1" : ""}`}
              >
                <div className={`relative bg-gradient-to-br from-primary/30 to-primary-active/30 ${i === 0 ? "aspect-[16/8]" : "aspect-video"}`}>
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-background/80 backdrop-blur">
                      <Play className="h-5 w-5 fill-foreground text-foreground" />
                    </span>
                  </div>
                  {c.featured && (
                    <span className="absolute left-4 top-4 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </span>
                  )}
                  <span className="absolute right-4 top-4 rounded-full bg-background/80 px-2.5 py-1 text-[10px] capitalize backdrop-blur">
                    {c.platform}
                  </span>
                </div>
                <div className="p-5">
                  <p className="font-medium">{c.caption}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                    <Stat icon={Eye} label="Views" v={fmt(c.views)} />
                    <Stat icon={Heart} label="Likes" v={fmt(c.likes)} />
                    <Stat icon={Star} label="ER" v={`${c.engagementRate.toFixed(1)}%`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* COLLABS */}
      {data.brandCollabs.length > 0 && (
        <section className="px-8 py-20 md:px-16">
          <h2 className="kp-display text-4xl md:text-5xl">Brands that trust me</h2>
          <div className="mt-10 grid gap-3 md:grid-cols-4">
            {data.brandCollabs.map((b) => (
              <div key={b.id} className="kp-card grid place-items-center p-8 text-center">
                <p className="kp-display text-2xl">{b.brandName}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {data.brandCollabs.slice(0, 2).map((b) => (
              <div key={b.id} className="kp-card p-6">
                <p className="kp-display text-2xl text-primary">{b.brandName}</p>
                <p className="mt-3 text-sm text-muted-foreground">{b.deliverables}</p>
                <p className="mt-2 text-base font-medium text-success">{b.results}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {visibleTestimonials.length > 0 && (
        <section className="bg-surface/60 px-8 py-20 md:px-16">
          <h2 className="kp-display text-4xl md:text-5xl">Receipts</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {visibleTestimonials.map((t) => (
              <div key={t.id} className="kp-card p-6">
                <div className="flex items-center gap-0.5 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <p className="mt-4 text-base leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="font-medium">{t.reviewerName} · {t.brandName}</span>
                  {t.verified && <Verified className="h-3.5 w-3.5 text-primary" />}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RATES */}
      {data.rates.rows.length > 0 && (
        <section className="px-8 py-20 md:px-16">
          <h2 className="kp-display text-4xl md:text-5xl">Rates</h2>
          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {data.rates.rows.map((r) => (
              <div key={r.id} className="kp-card p-6">
                <p className="text-xs uppercase tracking-[0.14em] text-muted-foreground">{r.platform}</p>
                <p className="mt-2 text-lg font-semibold">{r.deliverable}</p>
                {r.notes && <p className="mt-1 text-sm text-muted-foreground">{r.notes}</p>}
                <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                  {data.rates.isPublic ? (
                    <span className="kp-display text-3xl text-primary">{formatPrice(r.priceUSD, locale)}</span>
                  ) : (
                    <a href="#inquiry" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                      <Lock className="h-4 w-4" /> Request via inquiry
                    </a>
                  )}
                  <a href="#inquiry" className="inline-flex items-center gap-1 text-xs text-primary hover:underline">
                    Book <ArrowRight className="h-3 w-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* INQUIRY */}
      <section id="inquiry" className="px-8 py-20 md:px-16">
        <div className="kp-card mx-auto max-w-2xl overflow-hidden p-10 text-center" style={{ background: "var(--gradient-primary)" }}>
          <h2 className="kp-display text-4xl text-primary-foreground md:text-5xl">Let's build something loud.</h2>
          {data.inquirySettings.introMessage && (
            <p className="mx-auto mt-4 max-w-lg text-base text-primary-foreground/90">
              {data.inquirySettings.introMessage}
            </p>
          )}
          <a
            href={`mailto:${data.contactEmail}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-background px-6 py-3 text-sm font-semibold text-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Pitch your brief
          </a>
        </div>
      </section>

      <footer className="px-8 py-10 text-center text-xs text-muted-foreground md:px-16">
        Built with <span className="kp-brand text-foreground">kitpager</span>
      </footer>
    </div>
  );
}

function Stat({ icon: Icon, label, v }: { icon: typeof Eye; label: string; v: string }) {
  return (
    <div className="rounded-lg bg-surface-2 p-2">
      <Icon className="mx-auto h-3 w-3 text-muted-foreground" />
      <p className="kp-mono mt-1 text-xs">{v}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}
