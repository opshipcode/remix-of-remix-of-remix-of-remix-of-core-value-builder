import { motion } from "framer-motion";
import { Mail, MapPin, Languages, Calendar, Send, Star, Verified, Play, Eye, Heart, Lock } from "lucide-react";
import type { TemplateProps } from "./types";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { AudienceSection } from "@/components/audience/AudienceSection";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function MinimalTemplate({ data }: TemplateProps) {
  const locale = useLocaleStore();
  const visiblePlatforms = data.platforms.filter((p) => p.visible);
  const visibleTestimonials = data.testimonials.filter((t) => t.visible && t.status === "approved");

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* HERO — generous whitespace, single column */}
      <section className="px-8 pt-16 pb-12 md:px-16 md:pt-24 md:pb-20">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
          className="mx-auto max-w-3xl text-center"
        >
          <div className="mx-auto h-24 w-24 overflow-hidden rounded-full border border-border bg-surface-2 md:h-28 md:w-28">
            <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary to-primary-active text-2xl font-bold text-primary-foreground">
              {data.displayName.split(" ").map((n) => n[0]).join("")}
            </div>
          </div>
          <p className="kp-mono mt-6 text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            kitpager.pro/{data.slug}
          </p>
          <h1 className="kp-display mt-3 text-4xl md:text-6xl">{data.displayName}</h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground md:text-lg">{data.tagline}</p>
          {data.nicheTags.length > 0 && (
            <div className="mt-6 flex flex-wrap justify-center gap-1.5">
              {data.nicheTags.map((n) => (
                <span key={n} className="rounded-full border border-border px-2.5 py-0.5 text-[11px] text-muted-foreground">
                  {n}
                </span>
              ))}
            </div>
          )}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <a
              href="#inquiry"
              className="inline-flex items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Send inquiry
            </a>
            <a
              href={`mailto:${data.contactEmail}`}
              className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm hover:bg-surface-2"
            >
              <Mail className="h-4 w-4" /> {data.contactEmail}
            </a>
          </div>
        </motion.div>
      </section>

      {/* PLATFORMS — minimal row of stats */}
      {visiblePlatforms.length > 0 && (
        <section className="border-y border-border bg-surface/40 px-8 py-10 md:px-16">
          <div className="mx-auto grid max-w-3xl gap-6 sm:grid-cols-3">
            {visiblePlatforms.slice(0, 3).map((p) => (
              <div key={p.id} className="text-center">
                <p className="kp-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  {p.platform}
                </p>
                <p className="kp-display mt-2 text-3xl">{fmt(p.followers)}</p>
                <p className="mt-1 text-xs text-muted-foreground">{p.handle}</p>
                {p.selfReported && (
                  <p className="mt-1 text-[10px] italic text-muted-foreground">(self-reported)</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <AudienceSection audience={data.audience} variant="minimal" />

      {/* ABOUT */}
      <section className="px-8 py-16 md:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="kp-display text-2xl">About</h2>
          <p className="mt-4 text-base leading-relaxed text-foreground/85">{data.bio}</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {data.location && <Meta icon={MapPin} label="Location" value={data.location} />}
            {data.languages.length > 0 && <Meta icon={Languages} label="Languages" value={data.languages.join(", ")} />}
            {data.creatingSince && <Meta icon={Calendar} label="Creating since" value={String(data.creatingSince)} />}
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {data.contentGallery.length > 0 && (
        <section className="border-t border-border px-8 py-16 md:px-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="kp-display text-2xl">Recent work</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {data.contentGallery.map((c) => (
                <div key={c.id} className="group">
                  <div className="relative aspect-video overflow-hidden rounded-2xl border border-border bg-surface-2">
                    <div className="absolute inset-0 grid place-items-center">
                      <span className="grid h-12 w-12 place-items-center rounded-full bg-background/80 backdrop-blur">
                        <Play className="h-4 w-4 fill-foreground text-foreground" />
                      </span>
                    </div>
                    {c.featured && (
                      <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-foreground px-2 py-0.5 text-[10px] text-background">
                        <Star className="h-2.5 w-2.5 fill-current" /> Featured
                      </span>
                    )}
                  </div>
                  <p className="mt-3 line-clamp-2 text-sm">{c.caption}</p>
                  <div className="mt-2 flex items-center gap-4 text-[11px] text-muted-foreground">
                    <span className="inline-flex items-center gap-1"><Eye className="h-3 w-3" />{fmt(c.views)}</span>
                    <span className="inline-flex items-center gap-1"><Heart className="h-3 w-3" />{fmt(c.likes)}</span>
                    <span>{c.engagementRate.toFixed(1)}% ER</span>
                    {c.selfReported && <span className="italic">self-reported</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COLLABS */}
      {data.brandCollabs.length > 0 && (
        <section className="border-t border-border bg-surface/40 px-8 py-16 md:px-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="kp-display text-2xl">Brand collaborations</h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {data.brandCollabs.map((b) => (
                <div key={b.id} className="border-l-2 border-foreground/20 pl-4">
                  <p className="kp-display text-lg">{b.brandName}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{b.deliverables}</p>
                  <p className="mt-1 text-xs text-foreground">{b.results}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {visibleTestimonials.length > 0 && (
        <section className="border-t border-border px-8 py-16 md:px-16">
          <div className="mx-auto max-w-4xl">
            <h2 className="kp-display text-2xl">What brands say</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2">
              {visibleTestimonials.map((t) => (
                <figure key={t.id}>
                  <div className="flex items-center gap-1 text-foreground">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-current" />
                    ))}
                  </div>
                  <blockquote className="mt-3 text-base italic text-foreground/85">
                    "{t.quote}"
                  </blockquote>
                  <figcaption className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    {t.reviewerName}, {t.brandName}
                    {t.verified && <Verified className="h-3.5 w-3.5 text-foreground" />}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* RATES */}
      {data.rates.rows.length > 0 && (
        <section className="border-t border-border bg-surface/40 px-8 py-16 md:px-16">
          <div className="mx-auto max-w-3xl">
            <h2 className="kp-display text-2xl">Rates</h2>
            <div className="mt-6 divide-y divide-border">
              {data.rates.rows.map((r) => (
                <div key={r.id} className="flex items-center justify-between py-4">
                  <div>
                    <p className="text-sm font-medium">{r.deliverable}</p>
                    {r.notes && <p className="mt-0.5 text-xs text-muted-foreground">{r.notes}</p>}
                  </div>
                  {data.rates.isPublic ? (
                    <span className="kp-display text-xl">{formatPrice(r.priceUSD, locale)}</span>
                  ) : (
                    <a href="#inquiry" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground">
                      <Lock className="h-3 w-3" /> By inquiry
                    </a>
                  )}
                </div>
              ))}
            </div>
            {(data.rates.turnaround || data.rates.licensingNotes) && (
              <p className="mt-6 text-xs text-muted-foreground">
                {data.rates.turnaround && <>Turnaround: {data.rates.turnaround}. </>}
                {data.rates.licensingNotes}
              </p>
            )}
          </div>
        </section>
      )}

      {/* INQUIRY */}
      <section id="inquiry" className="border-t border-border px-8 py-16 md:px-16">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="kp-display text-3xl">Work together</h2>
          {data.inquirySettings.introMessage && (
            <p className="mt-3 text-sm text-muted-foreground">{data.inquirySettings.introMessage}</p>
          )}
          <a
            href={`mailto:${data.contactEmail}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background hover:opacity-90"
          >
            <Mail className="h-4 w-4" /> {data.contactEmail}
          </a>
        </div>
      </section>

      <footer className="border-t border-border px-8 py-8 text-center text-[11px] text-muted-foreground md:px-16">
        Built with <span className="kp-brand text-foreground">kitpager</span>
      </footer>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="text-center">
      <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
      <p className="mt-2 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm">{value}</p>
    </div>
  );
}
