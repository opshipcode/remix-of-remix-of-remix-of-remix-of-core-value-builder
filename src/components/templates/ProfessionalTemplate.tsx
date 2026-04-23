import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  Languages,
  Calendar,
  Send,
  Star,
  Verified,
  Play,
  Eye,
  Heart,
  Lock,
  ShieldCheck,
  TrendingUp,
  BarChart3,
} from "lucide-react";
import type { TemplateProps } from "./types";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { AudienceSection } from "@/components/audience/AudienceSection";

function fmt(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export function ProfessionalTemplate({ data }: TemplateProps) {
  const locale = useLocaleStore();
  const visiblePlatforms = data.platforms.filter((p) => p.visible);
  const visibleTestimonials = data.testimonials.filter((t) => t.visible && t.status === "approved");
  const totalFollowers = visiblePlatforms.reduce((s, p) => s + p.followers, 0);
  const avgER =
    visiblePlatforms.length > 0
      ? visiblePlatforms.reduce((s, p) => s + p.engagementRate, 0) / visiblePlatforms.length
      : 0;

  return (
    <div className="min-h-full bg-background text-foreground">
      {/* TOP BAR */}
      <header className="border-b border-border bg-surface/60 px-8 py-3 md:px-16">
        <div className="flex items-center justify-between text-xs">
          <span className="kp-mono uppercase tracking-[0.16em] text-muted-foreground">
            kitpager.pro/{data.slug}
          </span>
          <span className="inline-flex items-center gap-1.5 text-success">
            <ShieldCheck className="h-3.5 w-3.5" /> Verified creator
          </span>
        </div>
      </header>

      {/* HERO — split: identity left, KPI panel right */}
      <section className="border-b border-border px-8 py-12 md:px-16 md:py-16">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="grid gap-10 md:grid-cols-[1.2fr_1fr] md:items-center"
        >
          <div>
            <div className="flex items-center gap-5">
              <div className="h-20 w-20 overflow-hidden rounded-2xl border border-border bg-surface-2">
                <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary to-primary-active text-2xl font-bold text-primary-foreground">
                  {data.displayName.split(" ").map((n) => n[0]).join("")}
                </div>
              </div>
              <div>
                <h1 className="kp-display text-3xl md:text-5xl">{data.displayName}</h1>
                <p className="mt-1 text-sm text-muted-foreground">
                  {data.location} · Creating since {data.creatingSince ?? "—"}
                </p>
              </div>
            </div>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-foreground/85">{data.tagline}</p>
            {data.nicheTags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {data.nicheTags.map((n) => (
                  <span key={n} className="rounded border border-border bg-surface px-2 py-0.5 text-[11px] text-muted-foreground">
                    {n}
                  </span>
                ))}
              </div>
            )}
            <div className="mt-7 flex flex-wrap gap-2">
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 rounded bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
              >
                <Send className="h-4 w-4" /> Submit a brief
              </a>
              <a
                href={`mailto:${data.contactEmail}`}
                className="inline-flex items-center gap-2 rounded border border-border px-5 py-2.5 text-sm hover:bg-surface-2"
              >
                <Mail className="h-4 w-4" /> {data.contactEmail}
              </a>
            </div>
          </div>

          {/* KPI panel */}
          <div className="kp-card divide-y divide-border overflow-hidden">
            <div className="grid grid-cols-2 divide-x divide-border">
              <Kpi icon={TrendingUp} label="Total reach" value={fmt(totalFollowers)} sub="across platforms" />
              <Kpi icon={BarChart3} label="Avg engagement" value={`${avgER.toFixed(1)}%`} sub="rolling 30d" />
            </div>
            <div className="grid grid-cols-2 divide-x divide-border">
              <Kpi label="Languages" value={data.languages.join(", ") || "—"} />
              <Kpi label="Best for" value={data.collabStyle.split(" ").slice(0, 4).join(" ") + "…"} />
            </div>
          </div>
        </motion.div>
      </section>

      {/* PLATFORM TABLE — agency style */}
      {visiblePlatforms.length > 0 && (
        <section className="border-b border-border px-8 py-14 md:px-16">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="kp-display text-2xl md:text-3xl">Audience</h2>
              <p className="mt-1 text-sm text-muted-foreground">Verified by OAuth · refreshed daily</p>
            </div>
          </div>
          <div className="kp-card mt-6 overflow-hidden">
            <div className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] gap-2 border-b border-border bg-surface px-6 py-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
              <span>Platform</span>
              <span>Followers</span>
              <span>Avg views</span>
              <span>Engagement</span>
              <span></span>
            </div>
            {visiblePlatforms.map((p) => (
              <div key={p.id} className="grid grid-cols-[1.2fr_1fr_1fr_1fr_auto] items-center gap-2 border-b border-border px-6 py-4 last:border-b-0">
                <div>
                  <p className="text-sm font-medium capitalize">{p.platform}</p>
                  <p className="kp-mono text-xs text-muted-foreground">{p.handle}</p>
                </div>
                <span className="kp-mono text-sm">{fmt(p.followers)}</span>
                <span className="kp-mono text-sm">{fmt(p.avgViews)}</span>
                <span className="kp-mono text-sm">{p.engagementRate.toFixed(1)}%</span>
                <span className={p.selfReported ? "text-[10px] italic text-muted-foreground" : "inline-flex items-center gap-1 text-[10px] text-success"}>
                  {p.selfReported ? "self-reported" : <><ShieldCheck className="h-3 w-3" /> verified</>}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <AudienceSection audience={data.audience} variant="professional" />

      {/* ABOUT */}
      <section className="border-b border-border px-8 py-14 md:px-16">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <h2 className="kp-display text-2xl md:text-3xl">About</h2>
          <div>
            <p className="text-base leading-relaxed text-foreground/90">{data.bio}</p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              {data.location && <Meta icon={MapPin} label="Location" value={data.location} />}
              {data.languages.length > 0 && <Meta icon={Languages} label="Languages" value={data.languages.join(", ")} />}
              {data.creatingSince && <Meta icon={Calendar} label="Active since" value={String(data.creatingSince)} />}
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      {data.contentGallery.length > 0 && (
        <section className="border-b border-border bg-surface/40 px-8 py-14 md:px-16">
          <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
            <div>
              <h2 className="kp-display text-2xl md:text-3xl">Case studies</h2>
              <p className="mt-1 text-sm text-muted-foreground">Selected recent work with verified performance metrics.</p>
            </div>
            <div className="space-y-5">
              {data.contentGallery.map((c) => (
                <div key={c.id} className="kp-card grid grid-cols-[180px_1fr] overflow-hidden">
                  <div className="relative aspect-video bg-gradient-to-br from-surface-2 to-surface-offset">
                    <div className="absolute inset-0 grid place-items-center">
                      <Play className="h-5 w-5 fill-foreground text-foreground" />
                    </div>
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between">
                      <span className="kp-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                        {c.platform} · {c.niche}
                      </span>
                      {c.featured && <span className="text-[10px] font-bold text-primary">FEATURED</span>}
                    </div>
                    <p className="mt-2 text-sm font-medium">{c.caption}</p>
                    <div className="mt-3 grid grid-cols-3 gap-3 text-xs">
                      <KpiInline icon={Eye} label="Views" v={fmt(c.views)} />
                      <KpiInline icon={Heart} label="Likes" v={fmt(c.likes)} />
                      <KpiInline icon={Star} label="ER" v={`${c.engagementRate.toFixed(1)}%`} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* COLLABS */}
      {data.brandCollabs.length > 0 && (
        <section className="border-b border-border px-8 py-14 md:px-16">
          <h2 className="kp-display text-2xl md:text-3xl">Brand partnerships</h2>
          <div className="mt-8 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Brand</th>
                  <th className="px-5 py-3">Deliverables</th>
                  <th className="px-5 py-3">Results</th>
                </tr>
              </thead>
              <tbody>
                {data.brandCollabs.map((b) => (
                  <tr key={b.id} className="border-t border-border">
                    <td className="px-5 py-4 font-medium">{b.brandName}</td>
                    <td className="px-5 py-4 text-muted-foreground">{b.deliverables}</td>
                    <td className="px-5 py-4 text-success">{b.results}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* TESTIMONIALS */}
      {visibleTestimonials.length > 0 && (
        <section className="border-b border-border bg-surface/40 px-8 py-14 md:px-16">
          <h2 className="kp-display text-2xl md:text-3xl">Client testimonials</h2>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {visibleTestimonials.map((t) => (
              <div key={t.id} className="kp-card p-6">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="h-3.5 w-3.5 fill-current" />
                  ))}
                </div>
                <p className="mt-3 text-sm leading-relaxed">"{t.quote}"</p>
                <div className="mt-5 flex items-center justify-between border-t border-border pt-4 text-xs">
                  <span>
                    <span className="font-medium">{t.reviewerName}</span>
                    <span className="text-muted-foreground"> · {t.brandName}</span>
                  </span>
                  {t.verified && (
                    <span className="inline-flex items-center gap-1 text-success">
                      <Verified className="h-3 w-3" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* RATES */}
      {data.rates.rows.length > 0 && (
        <section className="border-b border-border px-8 py-14 md:px-16">
          <div className="flex items-end justify-between">
            <h2 className="kp-display text-2xl md:text-3xl">Rate card</h2>
            <span className="text-xs text-muted-foreground">All prices net 30 · {data.rates.turnaround}</span>
          </div>
          <div className="mt-6 overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="bg-surface text-left text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3">Deliverable</th>
                  <th className="px-5 py-3">Platform</th>
                  <th className="px-5 py-3">Notes</th>
                  <th className="px-5 py-3 text-right">Rate</th>
                </tr>
              </thead>
              <tbody>
                {data.rates.rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-5 py-4 font-medium">{r.deliverable}</td>
                    <td className="px-5 py-4 capitalize text-muted-foreground">{r.platform}</td>
                    <td className="px-5 py-4 text-muted-foreground">{r.notes}</td>
                    <td className="px-5 py-4 text-right">
                      {data.rates.isPublic ? (
                        <span className="kp-mono font-semibold">{formatPrice(r.priceUSD, locale)}</span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                          <Lock className="h-3 w-3" /> By request
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {data.rates.licensingNotes && (
            <p className="mt-4 text-xs text-muted-foreground">Licensing: {data.rates.licensingNotes}</p>
          )}
        </section>
      )}

      {/* INQUIRY */}
      <section id="inquiry" className="px-8 py-14 md:px-16">
        <div className="kp-card mx-auto max-w-3xl p-8">
          <h2 className="kp-display text-2xl md:text-3xl">Project brief</h2>
          {data.inquirySettings.introMessage && (
            <p className="mt-2 text-sm text-muted-foreground">{data.inquirySettings.introMessage}</p>
          )}
          <form className="mt-6 grid gap-4 md:grid-cols-2">
            <Field label="Brand" />
            <Field label="Contact name" />
            <Field label="Work email" type="email" />
            <Field label="Website" />
            {data.inquirySettings.showBudgetField && (
              <div className="md:col-span-2">
                <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Budget</label>
                <select className="mt-1.5 w-full rounded border border-border bg-background px-4 py-2.5 text-sm">
                  <option>Under $2k</option>
                  <option>$2k – $5k</option>
                  <option>$5k – $15k</option>
                  <option>$15k+</option>
                </select>
              </div>
            )}
            <div className="md:col-span-2">
              <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">Brief</label>
              <textarea rows={4} className="mt-1.5 w-full rounded border border-border bg-background px-4 py-2.5 text-sm" />
            </div>
            <button className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
              <Send className="h-4 w-4" /> Submit brief
            </button>
          </form>
        </div>
      </section>

      <footer className="border-t border-border px-8 py-8 text-center text-[11px] text-muted-foreground md:px-16">
        Built with <span className="kp-brand text-foreground">kitpager</span>
      </footer>
    </div>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon?: typeof TrendingUp;
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="p-5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {Icon && <Icon className="h-3 w-3" />} {label}
      </div>
      <p className="kp-display mt-2 text-2xl">{value}</p>
      {sub && <p className="mt-0.5 text-[11px] text-muted-foreground">{sub}</p>}
    </div>
  );
}

function KpiInline({ icon: Icon, label, v }: { icon: typeof Eye; label: string; v: string }) {
  return (
    <div className="rounded bg-surface-2 p-2 text-center">
      <Icon className="mx-auto h-3 w-3 text-muted-foreground" />
      <p className="kp-mono mt-1 text-xs">{v}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        <Icon className="h-3 w-3" /> {label}
      </div>
      <p className="mt-1 text-sm">{value}</p>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-[10px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">{label}</label>
      <input type={type} className="mt-1.5 w-full rounded border border-border bg-background px-4 py-2.5 text-sm" />
    </div>
  );
}
