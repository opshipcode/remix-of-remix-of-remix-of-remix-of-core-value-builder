import { Eye, Star, Zap, Lock, BarChart3, Shield, MessageSquare, Sparkles, Check, Globe2, Image, Mail } from "lucide-react";

const GROUPS = [
  {
    title: "Live Proof Engine",
    icon: Zap,
    blurb: "Real numbers, pulled from real platforms. Brands trust verified data.",
    features: [
      "TikTok, Instagram, and YouTube support",
      "Auto-refresh every 24 hours",
      "Engagement rate computed server-side",
      "Manual fallback with clear self-reported labeling",
      "Broken-link detection with creator alerts",
    ],
  },
  {
    title: "Testimonial Collection",
    icon: Star,
    blurb: "Frictionless brand reviews — no account required.",
    features: [
      "One-tap branded request links",
      "14-day expiring secure tokens",
      "Brand-side form with Turnstile anti-bot",
      "Approval queue with star ratings",
      "Verified badge for KitPager-collected reviews",
    ],
  },
  {
    title: "Viewed-By Notifications",
    icon: Eye,
    blurb: "Know when a brand opens your page.",
    features: [
      "Email alerts with city, country, time on page",
      "Non-blocking analytics ingestion (sendBeacon)",
      "Real-time recent-views feed in dashboard",
      "Pro-tier reveal of full visitor context",
    ],
  },
  {
    title: "Brand Inquiry Funnel",
    icon: MessageSquare,
    blurb: "A clean front door for partnership requests.",
    features: [
      "Validated form with budget, brief, and contact",
      "Turnstile + rate-limit protection",
      "Resend + Sendi failover for delivery",
      "Inbox with status tags and notes",
    ],
  },
  {
    title: "Privacy and Control",
    icon: Lock,
    blurb: "You decide what's public and who can see it.",
    features: [
      "Public or private rates",
      "Password-protected share links",
      "Country restriction controls",
      "Custom contact email per page",
    ],
  },
  {
    title: "Analytics",
    icon: BarChart3,
    blurb: "Calm, focused dashboards. No vanity metrics.",
    features: [
      "Top referrers and countries",
      "Time on page and scroll depth",
      "Conversion to inquiry tracking",
      "30-day rolling history",
    ],
  },
];

export default function Features() {
  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-20 text-center md:py-28">
          <span className="kp-eyebrow">Every feature</span>
          <h1 className="kp-display mt-5 text-5xl md:text-6xl">Built for the realities of brand work.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Designed for the creator who's already getting inbound — and tired of looking like an amateur.
          </p>
        </div>
      </section>

      <section className="kp-container grid gap-4 py-20 md:grid-cols-2">
        {GROUPS.map((g) => (
          <div key={g.title} className="kp-card kp-card-hover p-8">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary-highlight text-primary">
                <g.icon className="h-5 w-5" />
              </div>
              <h2 className="kp-display text-2xl">{g.title}</h2>
            </div>
            <p className="mt-3 text-muted-foreground">{g.blurb}</p>
            <ul className="mt-6 space-y-2.5 text-sm">
              {g.features.map((f) => (
                <li key={f} className="flex items-start gap-2.5">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span className="text-foreground/80">{f}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
