import { Link } from "react-router-dom";
import { ArrowRight, Check, Eye, Zap, Shield, Sparkles, Star, BarChart3, Lock, MessageSquare } from "lucide-react";
import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";

export default function Home() {
  return (
    <>
      {/* ============== HERO ============== */}
      <section className="relative overflow-hidden bg-hero">
        <div className="kp-container pb-24 pt-16 md:pb-32 md:pt-24">
          <div className="mx-auto max-w-3xl text-center">
            <span className="kp-eyebrow">For serious creators</span>
            <h1 className="kp-display mt-6 text-5xl text-foreground md:text-7xl">
              The media kit that <span className="text-primary">closes the deal.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
              Stop sending Canva PDFs. KitPager is a fast, polished, brand-converting page that pulls live proof from your real content — so brands trust you faster.
            </p>
            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="group inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Start free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-medium text-foreground transition hover:bg-surface-2"
              >
                See templates
              </Link>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card required. Free forever, with a published page in under 15 minutes.
            </p>
          </div>

          <div className="relative mx-auto mt-16 max-w-6xl">
            <ImagePlaceholder
              aspect="landscape"
              title="Homepage hero — KitPager kit page mockup"
              dimensions="2400x1500"
              orientation="landscape"
              description="High-end product mockup: a floating MacBook Pro screen showing a beautifully rendered creator media kit page (hero, proof grid, testimonials, rates) with a faint teal glow underneath. Subtle warm neutral background. Composition feels editorial — generous whitespace around the device. No humans, no text overlays. Premium soft shadow."
              background="warm off-white #F8F7F4 with soft radial teal glow at 50% 0%"
              facesAllowed={false}
              usage="Homepage hero — main visual under headline"
              format="png or jpg, 2x retina"
              className="shadow-glow"
            />
          </div>
        </div>
      </section>

      {/* ============== TRUST RIBBON ============== */}
      <section className="border-y border-border bg-surface py-10">
        <div className="kp-container">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Featured on
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
            {["Product Hunt", "Indie Hackers", "BetaList", "Peerlist", "Fazier", "TinyLaunch"].map((b) => (
              <div key={b} className="kp-display text-base text-muted-foreground/70">{b}</div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PRODUCT EXPLAINER ============== */}
      <section className="kp-container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="kp-eyebrow">How it works</span>
          <h2 className="kp-display mt-4 text-4xl md:text-5xl">A media kit that updates itself.</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Paste your content URLs. KitPager pulls live view counts, engagement, and embeds — automatically.
          </p>
        </div>

        <div className="kp-bento mt-16 gap-4">
          {/* Big card: live proof */}
          <div className="kp-card kp-card-hover col-span-12 overflow-hidden lg:col-span-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
              <div className="p-8 md:p-10">
                <span className="kp-eyebrow">Differentiator 01</span>
                <h3 className="kp-display mt-4 text-3xl">Live proof, not a screenshot.</h3>
                <p className="mt-3 text-muted-foreground">
                  Verified metrics pulled from TikTok, Instagram, and YouTube. Brands see real numbers, not your best guess from a year ago.
                </p>
                <ul className="mt-6 space-y-2 text-sm">
                  {["Verified view counts and engagement", "Auto-refresh every 24 hours", "Broken links flagged and fixed"].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-foreground/80">
                      <Check className="h-4 w-4 text-primary" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="border-t border-border p-6 md:border-l md:border-t-0">
                <ImagePlaceholder
                  aspect="square"
                  title="Live proof card mockup"
                  dimensions="1200x1200"
                  orientation="square"
                  description="A single 'proof card' UI element rendered in isolation: vertical video thumbnail, small platform badge (YouTube), live metrics row (1.2M views, 84.2K likes, 7.04% engagement) and a tiny 'verified' check. Floating on warm neutral background with subtle shadow."
                  background="warm off-white, no gradient"
                  facesAllowed={false}
                  usage="Homepage product explainer — Live Proof card"
                  format="png"
                />
              </div>
            </div>
          </div>

          {/* Card: testimonials */}
          <div className="kp-card kp-card-hover col-span-12 p-8 lg:col-span-5 md:p-10">
            <span className="kp-eyebrow">Differentiator 02</span>
            <h3 className="kp-display mt-4 text-3xl">Testimonials, on autopilot.</h3>
            <p className="mt-3 text-muted-foreground">
              Send a one-tap link to a brand contact. They submit a short review without making an account. You approve and publish.
            </p>
            <div className="mt-6">
              <ImagePlaceholder
                aspect="video"
                title="Testimonial collection flow"
                dimensions="1600x900"
                orientation="landscape"
                description="A clean two-step illustration: left = creator copying a 'kitpager.pro/review/abc' link, right = a brand-side form with star rating + textarea filled in. Use product UI screenshots, not stock graphics. Warm background, subtle teal accents."
                background="warm off-white"
                facesAllowed={false}
                usage="Homepage product explainer — Testimonials"
                format="png"
              />
            </div>
          </div>

          {/* Card: viewed-by */}
          <div className="kp-card kp-card-hover col-span-12 p-8 lg:col-span-5 md:p-10">
            <span className="kp-eyebrow">Differentiator 03</span>
            <h3 className="kp-display mt-4 text-3xl">See exactly who's looking.</h3>
            <p className="mt-3 text-muted-foreground">
              Get an email the moment a brand views your page — with city, time, and how long they stayed.
            </p>
            <div className="mt-6">
              <ImagePlaceholder
                aspect="video"
                title="Viewed-by email notification"
                dimensions="1600x900"
                orientation="landscape"
                description="An email inbox preview showing a single, well-designed KitPager notification: 'Someone in Brooklyn, US just viewed your KitPager — 2:14 pm, 3m 18s on page'. Premium typography, no emojis, brand-safe."
                background="warm off-white"
                facesAllowed={false}
                usage="Homepage product explainer — Viewed-by"
                format="png"
              />
            </div>
          </div>

          {/* Card: speed */}
          <div className="kp-card kp-card-hover col-span-12 overflow-hidden lg:col-span-7">
            <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_1fr]">
              <div className="p-8 md:p-10">
                <span className="kp-eyebrow">Built for speed</span>
                <h3 className="kp-display mt-4 text-3xl">Loads in under 500ms.</h3>
                <p className="mt-3 text-muted-foreground">
                  Every public kit page is pre-compiled and cached at the edge. Brands never wait. Skeleton loaders everywhere — never a spinner.
                </p>
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <Stat n="<500ms" l="Cached page load" />
                  <Stat n="100/100" l="Lighthouse" />
                  <Stat n="0" l="Layout shift" />
                </div>
              </div>
              <div className="border-t border-border p-6 md:border-l md:border-t-0">
                <ImagePlaceholder
                  aspect="square"
                  title="Performance gauge illustration"
                  dimensions="1000x1000"
                  orientation="square"
                  description="An abstract premium illustration of speed: thin teal arc reading '<500ms' over a faint waveform, calm and minimal. No charts, no clichés."
                  background="warm off-white"
                  facesAllowed={false}
                  usage="Homepage — speed/perf card"
                  format="png or svg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== TEMPLATE SHOWCASE ============== */}
      <section className="border-y border-border bg-surface py-24 md:py-32">
        <div className="kp-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="kp-eyebrow">Three distinct templates</span>
            <h2 className="kp-display mt-4 text-4xl md:text-5xl">Pick a feel. Switch any time.</h2>
            <p className="mt-4 text-lg text-muted-foreground">
              All three templates use the same content. Switch in one click — nothing breaks.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {[
              { name: "Minimal", desc: "Editorial typography, calm whitespace.", spec: "Mockup of the Minimal template rendered on a desktop browser frame — bright surfaces, large headers, restrained accents." },
              { name: "Bold", desc: "Color-forward, image-led, high contrast.", spec: "Mockup of the Bold template rendered on a desktop browser frame — vibrant teal accents, large hero image, magazine-style proof grid." },
              { name: "Professional", desc: "Structured, data-rich, brand-safe.", spec: "Mockup of the Professional template rendered on a desktop browser frame — dense rate card, audience charts, conservative serif/sans pairing." },
            ].map((t) => (
              <div key={t.name} className="kp-card kp-card-hover overflow-hidden">
                <ImagePlaceholder
                  aspect="portrait"
                  title={`${t.name} template preview`}
                  dimensions="900x1200"
                  orientation="portrait"
                  description={t.spec}
                  background="warm off-white with subtle gradient"
                  facesAllowed={false}
                  usage={`Homepage template showcase — ${t.name}`}
                  format="png"
                  className="rounded-none border-0 border-b"
                />
                <div className="p-6">
                  <h3 className="kp-display text-2xl">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background px-5 py-2.5 text-sm font-medium transition hover:bg-surface-2"
            >
              Compare templates
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== FEATURE GRID ============== */}
      <section className="kp-container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="kp-eyebrow">Everything you need</span>
          <h2 className="kp-display mt-4 text-4xl md:text-5xl">Built for the realities of brand work.</h2>
        </div>
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f) => (
            <div key={f.title} className="kp-card kp-card-hover p-6">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-highlight text-primary">
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 text-lg font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ============== DEVICE PREVIEW ============== */}
      <section className="border-t border-border bg-surface py-24">
        <div className="kp-container">
          <div className="mx-auto max-w-3xl text-center">
            <span className="kp-eyebrow">Mobile-first</span>
            <h2 className="kp-display mt-4 text-4xl md:text-5xl">Looks right on any screen.</h2>
            <p className="mt-4 text-muted-foreground">
              Most brands open your link from their phone. KitPager is built for that first.
            </p>
          </div>
          <div className="mt-12">
            <ImagePlaceholder
              aspect="wide"
              title="Multi-device kit page preview"
              dimensions="2400x1100"
              orientation="landscape"
              description="A composition showing the same KitPager kit page rendered across iPhone (portrait), iPad (landscape), and laptop (laptop frame). Devices arranged in a soft 3D float, warm background, low-contrast teal glow under the laptop. No humans, no UI chrome from real OSes — keep it brand-clean."
              background="warm off-white with faint radial glow"
              facesAllowed={false}
              usage="Homepage — device preview section"
              format="png"
            />
          </div>
        </div>
      </section>

      {/* ============== PRICING SUMMARY ============== */}
      <section className="kp-container py-24 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="kp-eyebrow">Simple pricing</span>
          <h2 className="kp-display mt-4 text-4xl md:text-5xl">Pay when you're ready.</h2>
          <p className="mt-4 text-muted-foreground">
            Free forever, no credit card. Upgrade when you want more polish, privacy, or analytics.
          </p>
        </div>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {[
            { name: "Free", price: "$0", desc: "1 public page, basic template, KitPager footer." },
            { name: "Creator", price: "$12", desc: "All templates, private rates, basic analytics, broken-link alerts.", highlight: true },
            { name: "Pro", price: "$29", desc: "Advanced analytics, viewed-by alerts, expanded controls." },
          ].map((p) => (
            <div
              key={p.name}
              className={`kp-card relative p-8 ${
                p.highlight ? "border-primary/40 shadow-glow" : ""
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.name}</h3>
              <p className="mt-3 kp-display text-5xl">{p.price}<span className="text-base text-muted-foreground">/mo</span></p>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <Link
                to="/pricing"
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-2.5 text-sm font-medium transition ${
                  p.highlight ? "bg-primary text-primary-foreground hover:bg-primary-hover" : "border border-border bg-surface text-foreground hover:bg-surface-2"
                }`}
              >
                {p.name === "Free" ? "Start free" : "Choose plan"}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ============== CLOSING CTA ============== */}
      <section className="kp-container pb-24">
        <div className="kp-card relative overflow-hidden p-10 md:p-16">
          <div className="absolute inset-0 bg-hero" aria-hidden="true" />
          <div className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="kp-display text-4xl md:text-5xl">A page brands take seriously.</h2>
            <p className="mt-4 text-muted-foreground">
              Set up in 15 minutes. Send the link before your next pitch.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-full bg-foreground px-6 py-3.5 text-sm font-medium text-background transition hover:opacity-90"
              >
                Create your KitPager
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/templates"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-6 py-3.5 text-sm font-medium transition hover:bg-surface-2"
              >
                See it live
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

const FEATURES = [
  { icon: Zap, title: "Live proof", desc: "Verified metrics pulled directly from TikTok, Instagram, and YouTube." },
  { icon: Star, title: "Brand testimonials", desc: "One-tap request links. Brands submit reviews without an account." },
  { icon: Eye, title: "Viewed-by alerts", desc: "Get notified when a brand views your page, with city and duration." },
  { icon: BarChart3, title: "Analytics", desc: "Top sources, countries, time on page, and conversion to inquiry." },
  { icon: Lock, title: "Private rates", desc: "Hide rates publicly. Reveal only after a verified brand inquiry." },
  { icon: Shield, title: "Country controls", desc: "Block specific regions or restrict who can view your kit." },
  { icon: MessageSquare, title: "Brand inquiries", desc: "Built-in form with budget, brief, and Turnstile anti-bot." },
  { icon: Sparkles, title: "Auto-fill", desc: "Connect once. Templates populate from your real content." },
  { icon: Check, title: "Broken-link guard", desc: "We watch every link. You get an email the moment one breaks." },
];

function Stat({ n, l }: { n: string; l: string }) {
  return (
    <div>
      <p className="kp-display text-2xl text-foreground">{n}</p>
      <p className="text-xs text-muted-foreground">{l}</p>
    </div>
  );
}
