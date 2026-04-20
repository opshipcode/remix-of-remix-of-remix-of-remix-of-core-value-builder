import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Star, Verified, Lock, Play, MapPin, Languages, Calendar, Heart, Eye, Send, ShieldCheck } from "lucide-react";
import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";
import { Logo } from "@/components/kit/Logo";
import { MOCK_CREATOR, MOCK_PLATFORMS, MOCK_CONTENT_ITEMS, MOCK_TESTIMONIALS, MOCK_RATES, formatNumber, formatPercent } from "@/lib/mockData";

const BRAND_COLLABS = [
  { name: "Notion", deliverables: "1 YouTube integration, 2 Reels", results: "+38% landing CTR" },
  { name: "Glossier", deliverables: "3 TikTok videos", results: "2.1M views, 4.8% ER" },
  { name: "Bose", deliverables: "Long-form review", results: "612K views, +9k waitlist" },
  { name: "Linear", deliverables: "Founder-led narrative", results: "Top brand reel of Q1" },
];

const KNOWN_SLUGS = ["alexrivera", "miraokafor", "jordanchen", "saraellis", "devonwright", "lucayama"];

export default function PublicKitPage() {
  const { slug } = useParams();
  const c = MOCK_CREATOR;
  const isActive = true; // mock
  const found = !slug || KNOWN_SLUGS.includes(slug);

  if (!found) return <NotFoundKit slug={slug ?? ""} />;
  if (!isActive) return <InactiveKit name={c.displayName} />;

  return (
    <div className="min-h-screen bg-background">
      {/* HERO with banner + circular avatar overlapping */}
      <section className="relative">
        <div className="relative h-[280px] overflow-hidden md:h-[420px]">
          <div className="absolute inset-0" style={{ background: "var(--gradient-primary)" }} />
          <div className="absolute inset-0 opacity-30" style={{ backgroundImage: "radial-gradient(circle at 20% 20%, hsl(0 0% 100% / 0.25), transparent 40%), radial-gradient(circle at 80% 60%, hsl(280 100% 70% / 0.4), transparent 40%)" }} />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="kp-container -mt-24 pb-10 md:-mt-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.2, 0.8, 0.2, 1] }}
            className="flex flex-col items-start gap-6 md:flex-row md:items-end"
          >
            <div className="h-32 w-32 overflow-hidden rounded-full border-4 border-background bg-surface-2 shadow-lg md:h-40 md:w-40">
              <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary to-primary-active text-4xl font-bold text-primary-foreground">
                {c.displayName.split(" ").map(n => n[0]).join("")}
              </div>
            </div>
            <div className="flex-1">
              <p className="kp-mono text-xs text-muted-foreground">kitpager.pro/{c.slug}</p>
              <h1 className="kp-brand mt-2 text-5xl text-foreground md:text-7xl">{c.displayName}</h1>
              <p className="mt-3 max-w-2xl text-lg text-muted-foreground">{c.headline}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {c.niches.map((n) => (
                  <span key={n} className="rounded-full border border-border bg-surface px-3 py-1 text-xs">{n}</span>
                ))}
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href="#inquiry" className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                <Send className="h-4 w-4" /> Send inquiry
              </a>
              <a href={`mailto:${c.contactEmail}`} className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm hover:bg-surface-2">
                <Mail className="h-4 w-4" /> Email
              </a>
            </div>
          </motion.div>

          {/* Platform badges */}
          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {MOCK_PLATFORMS.map((p) => (
              <div key={p.platform} className="kp-card flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-surface-2 capitalize text-xs font-bold">
                    {p.platform.slice(0, 2)}
                  </span>
                  <div>
                    <p className="text-sm font-medium capitalize">{p.platform}</p>
                    <p className="kp-mono text-xs text-muted-foreground">{p.handle}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="kp-display text-xl">{formatNumber(p.followers)}</p>
                  <p className="text-[10px] text-muted-foreground">followers</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section className="kp-container py-12">
        <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
          <div>
            <h2 className="kp-display text-2xl">About</h2>
            <p className="mt-4 text-base leading-relaxed text-foreground/85">{c.bio}</p>
          </div>
          <div className="space-y-3">
            <Meta icon={MapPin} label="Location" value={c.location} />
            <Meta icon={Languages} label="Languages" value="English, Spanish" />
            <Meta icon={Calendar} label="Creating since" value="2019" />
          </div>
        </div>
      </section>

      {/* CONTENT GALLERY */}
      <section className="border-t border-border bg-surface py-16">
        <div className="kp-container">
          <h2 className="kp-display text-3xl">Recent work</h2>
          <p className="mt-1 text-sm text-muted-foreground">Live metrics, refreshed every 24 hours.</p>
          <div className="mt-8 grid gap-5 md:grid-cols-2">
            {MOCK_CONTENT_ITEMS.map((item) => (
              <div key={item.id} className="kp-card kp-card-hover overflow-hidden">
                <div className="relative aspect-video bg-gradient-to-br from-surface-2 to-surface-offset">
                  <div className="absolute inset-0 grid place-items-center">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-background/80 backdrop-blur">
                      <Play className="h-5 w-5 fill-foreground text-foreground" />
                    </span>
                  </div>
                  {item.isFeatured && (
                    <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-xs font-medium text-primary-foreground">
                      <Star className="h-3 w-3 fill-current" /> Featured
                    </span>
                  )}
                  <span className="absolute right-3 top-3 rounded-full bg-background/80 px-2.5 py-0.5 text-xs capitalize backdrop-blur">
                    {item.platform}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs uppercase tracking-[0.12em] text-muted-foreground">{item.nicheTag}</span>
                    {item.metricSource === "manual" && (
                      <span className="text-[10px] text-muted-foreground">(self-reported)</span>
                    )}
                  </div>
                  <p className="mt-2 font-medium">{item.title}</p>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <Stat icon={Eye} label="Views" v={formatNumber(item.viewCount)} />
                    <Stat icon={Heart} label="Likes" v={formatNumber(item.likeCount)} />
                    <Stat icon={Star} label="ER" v={formatPercent(item.engagementRate)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BRAND COLLABS */}
      <section className="kp-container py-16">
        <h2 className="kp-display text-3xl">Past brand collaborations</h2>
        <div className="mt-6 grid gap-3 md:grid-cols-4">
          {BRAND_COLLABS.map((b) => (
            <div key={b.name} className="kp-card grid place-items-center p-6 text-center">
              <p className="kp-display text-xl">{b.name}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {BRAND_COLLABS.slice(0, 2).map((b) => (
            <div key={b.name} className="kp-card p-6">
              <p className="kp-display text-xl">{b.name}</p>
              <p className="mt-2 text-sm text-muted-foreground">{b.deliverables}</p>
              <p className="mt-3 text-sm text-success">{b.results}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="border-t border-border bg-surface py-16">
        <div className="kp-container">
          <h2 className="kp-display text-3xl">Brand testimonials</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {MOCK_TESTIMONIALS.map((t) => (
              <div key={t.id} className="kp-card p-6">
                <div className="flex items-center gap-1 text-primary">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="mt-4 text-sm">"{t.text}"</p>
                <div className="mt-5 flex items-center justify-between text-xs">
                  <span className="font-medium">{t.brandContactName}, {t.brandName}</span>
                  {t.isVerified && (
                    <span className="inline-flex items-center gap-1 text-primary">
                      <Verified className="h-3.5 w-3.5" /> Verified
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* RATES */}
      <section className="kp-container py-16">
        <h2 className="kp-display text-3xl">Rates</h2>
        <div className="kp-card mt-6 overflow-hidden">
          {MOCK_RATES.map((r, i) => (
            <div key={r.id} className={`flex items-center justify-between p-5 ${i > 0 ? "border-t border-border" : ""}`}>
              <div>
                <p className="font-medium">{r.deliverable}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{r.notes}</p>
              </div>
              {r.isPrivate ? (
                <a href="#inquiry" className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 text-xs hover:bg-surface-offset">
                  <Lock className="h-3 w-3" /> Request via inquiry
                </a>
              ) : (
                <span className="kp-display text-2xl">{r.priceLabel}</span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Turnaround: 7 business days from brief approval. 30-day organic usage included.</p>
      </section>

      {/* INQUIRY */}
      <section id="inquiry" className="border-t border-border bg-surface py-16">
        <div className="kp-container max-w-2xl">
          <div className="kp-card p-8 md:p-10">
            <h2 className="kp-display text-3xl">Work together</h2>
            <p className="mt-1 text-sm text-muted-foreground">I reply within 48 hours.</p>
            <form className="mt-6 grid gap-4 md:grid-cols-2">
              <Input label="Full name" required />
              <Input label="Work email" type="email" required />
              <Input label="Brand / company" required />
              <Input label="Company website" />
              <div>
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Budget range</label>
                <select className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20">
                  <option>Under $1k</option>
                  <option>$1k–$3k</option>
                  <option>$3k–$8k</option>
                  <option>$8k–$15k</option>
                  <option>$15k+</option>
                </select>
              </div>
              <Input label="Campaign timeline" placeholder="e.g. Q3 launch" />
              <div className="md:col-span-2">
                <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Campaign brief</label>
                <textarea rows={5} className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
              </div>
              <div className="md:col-span-2 flex items-center justify-between rounded-xl bg-surface-2 p-3 text-xs text-muted-foreground">
                <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-primary" /> Protected by Cloudflare Turnstile</span>
                <span className="kp-mono">verified</span>
              </div>
              <button className="md:col-span-2 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
                <Send className="h-4 w-4" /> Send inquiry
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="kp-container py-12 text-center text-xs text-muted-foreground">
        <a href={`mailto:${c.contactEmail}`} className="text-foreground hover:text-primary">{c.contactEmail}</a>
        <p className="mt-6">
          Built with{" "}
          <Link to="/" className="kp-brand text-foreground hover:text-primary">kitpager</Link>
          {" — "}
          <Link to="/signup" className="text-primary hover:underline">Create yours free →</Link>
        </p>
      </footer>
    </div>
  );
}

function Meta({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <Icon className="h-4 w-4 text-muted-foreground" />
      <div>
        <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}

function Stat({ icon: Icon, label, v }: { icon: typeof Eye; label: string; v: string }) {
  return (
    <div className="rounded-lg bg-surface-2 p-2 text-center">
      <Icon className="mx-auto h-3 w-3 text-muted-foreground" />
      <p className="kp-mono mt-1 text-xs font-medium">{v}</p>
      <p className="text-[9px] text-muted-foreground">{label}</p>
    </div>
  );
}

function Input({ label, type = "text", placeholder, required }: { label: string; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

function InactiveKit({ name }: { name: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div className="max-w-md">
        <Logo size="lg" />
        <h1 className="kp-display mt-8 text-3xl">This page is paused</h1>
        <p className="mt-3 text-muted-foreground">{name} has temporarily disabled their KitPager page.</p>
        <Link to="/" className="mt-6 inline-flex rounded-full border border-border px-5 py-2.5 text-sm hover:bg-surface-2">Back to KitPager</Link>
      </div>
    </div>
  );
}

function NotFoundKit({ slug }: { slug: string }) {
  return (
    <div className="grid min-h-screen place-items-center bg-background p-6 text-center">
      <div className="max-w-md">
        <Logo size="lg" />
        <h1 className="kp-display mt-8 text-4xl">No creator at /{slug}</h1>
        <p className="mt-3 text-muted-foreground">This handle isn't taken yet. Maybe it could be yours?</p>
        <Link to="/signup" className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
          Create your own KitPager →
        </Link>
      </div>
    </div>
  );
}
