import { Link } from "react-router-dom";
import { Check, X } from "lucide-react";

const PLANS = [
  {
    name: "Free",
    price: "$0",
    cadence: "forever",
    desc: "Get a real public kit page online today.",
    cta: { to: "/signup", label: "Start free" },
    features: [
      { f: "1 public page", on: true },
      { f: "Basic template", on: true },
      { f: "KitPager footer required", on: true },
      { f: "All 3 templates", on: false },
      { f: "Private / password pages", on: false },
      { f: "Analytics dashboard", on: false },
      { f: "Viewed-by email alerts", on: false },
      { f: "Country restrictions", on: false },
    ],
  },
  {
    name: "Creator",
    price: "$12",
    cadence: "/month",
    desc: "For working creators pitching brands every week.",
    highlight: true,
    cta: { to: "/signup", label: "Start 7-day free trial" },
    features: [
      { f: "Everything in Free", on: true },
      { f: "All 3 templates + custom theme", on: true },
      { f: "Private rates", on: true },
      { f: "Limited password-protected shares", on: true },
      { f: "Country restriction controls", on: true },
      { f: "Basic analytics dashboard", on: true },
      { f: "Broken-link email alerts", on: true },
      { f: "Viewed-by email alerts", on: false },
    ],
  },
  {
    name: "Pro",
    price: "$29",
    cadence: "/month",
    desc: "For creators running real partnership pipelines.",
    cta: { to: "/signup", label: "Start 7-day free trial" },
    features: [
      { f: "Everything in Creator", on: true },
      { f: "Advanced analytics", on: true },
      { f: "Viewed-by email notifications", on: true },
      { f: "Richer engagement reporting", on: true },
      { f: "Generous private share limits", on: true },
      { f: "Expanded country restriction", on: true },
      { f: "Priority support", on: true },
      { f: "Highest customization access", on: true },
    ],
  },
];

export default function Pricing() {
  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-20 text-center md:py-28">
          <span className="kp-eyebrow">Pricing</span>
          <h1 className="kp-display mt-5 text-5xl md:text-6xl">Plans that scale with your career.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Start free. Upgrade only when KitPager is closing real deals for you.
          </p>
        </div>
      </section>

      <section className="kp-container -mt-10 pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <div
              key={p.name}
              className={`kp-card relative flex flex-col p-8 ${
                p.highlight ? "border-primary/40 shadow-glow" : ""
              }`}
            >
              {p.highlight && (
                <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
                  Most popular
                </span>
              )}
              <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">{p.name}</h3>
              <p className="mt-4 kp-display text-5xl">
                {p.price}<span className="text-base text-muted-foreground">{p.cadence}</span>
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{p.desc}</p>
              <Link
                to={p.cta.to}
                className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition ${
                  p.highlight
                    ? "bg-primary text-primary-foreground hover:bg-primary-hover"
                    : "border border-border bg-surface text-foreground hover:bg-surface-2"
                }`}
              >
                {p.cta.label}
              </Link>
              <ul className="mt-8 space-y-2.5 text-sm">
                {p.features.map((feat) => (
                  <li key={feat.f} className="flex items-start gap-2.5">
                    {feat.on ? (
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground/40" />
                    )}
                    <span className={feat.on ? "text-foreground/80" : "text-muted-foreground/60 line-through"}>
                      {feat.f}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 text-center text-xs text-muted-foreground">
          Annual plans include 2 months free. Currency in USD. Cancel anytime.
        </p>
      </section>
    </>
  );
}
