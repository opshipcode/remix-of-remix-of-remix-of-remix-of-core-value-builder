import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Check } from "lucide-react";
import { useLocaleStore } from "@/store/locale";
import { formatPrice } from "@/lib/formatPrice";
import { FoundingMemberCard, FoundingMemberPopup } from "@/components/kit/FoundingMemberCard";

type Cadence = "monthly" | "annual";

interface PlanDef {
  name: string;
  highlight?: boolean;
  monthly: number;
  annual: number;
  annualMonthly: number;
  monthlyStrike: number;
  annualStrike: number;
  desc: string;
  cta: string;
  ctaTo: string;
  features: string[];
}

const PLANS: PlanDef[] = [
  {
    name: "Free",
    monthly: 0,
    annual: 0,
    annualMonthly: 0,
    monthlyStrike: 0,
    annualStrike: 0,
    desc: "Get a real public kit page online today.",
    cta: "Start free — no card needed",
    ctaTo: "/signup",
    features: [
      "1 connected platform",
      "Minimal template only",
      "5 view notifications/month",
      "1 active report/month",
      '"Built with KitPager" on page',
      "Basic analytics",
    ],
  },
  {
    name: "Creator",
    highlight: true,
    monthly: 12,
    monthlyStrike: 19,
    annual: 99,
    annualMonthly: 8.25,
    annualStrike: 144,
    desc: "For working creators pitching brands every week.",
    cta: "Start 7-day free trial",
    ctaTo: "/signup",
    features: [
      "Everything in Free",
      "3 platforms, 3 accounts each",
      "Unlimited view notifications (batched)",
      "Unlimited reports (6hr refresh)",
      "4 templates (Minimal + Bold + Professional + Agency)",
      "Remove KitPager branding",
      "Full analytics + AtlasKit world map",
      "Audience demographics section",
      "Priority support",
    ],
  },
  {
    name: "Pro",
    monthly: 29,
    monthlyStrike: 49,
    annual: 239,
    annualMonthly: 19.92,
    annualStrike: 348,
    desc: "For creators running real partnership pipelines.",
    cta: "Upgrade to Pro",
    ctaTo: "/signup",
    features: [
      "Everything in Creator",
      "Unlimited platforms + accounts",
      "Real-time notifications (instant, every view)",
      "Reports refresh every hour",
      "All templates including Signature + future releases",
      "UTM named pitch tracking",
      "White-label report pages (no KitPager branding)",
      "Analytics export",
    ],
  },
];

// Store the original detected locale so we can toggle back
let originalDetectedLocale: {
  countryCode: string;
  countryName: string;
  currencyCode: string;
  currencySymbol: string;
  exchangeRate: number;
  locale: string;
  routePrefix: string;
} | null = null;

export default function Pricing() {
  const [cadence, setCadence] = useState<Cadence>("monthly");
  const locale = useLocaleStore();
  const setLocale = useLocaleStore((s) => s.setLocale);
  const isAnnual = cadence === "annual";
  
  // On component mount/reload, reset to original currency
  useEffect(() => {
    // Clear the USD override from session storage
    try {
      window.sessionStorage.removeItem("kp_locale_override");
    } catch {
      /* ignore */
    }
    
    // Reset forcedUSD flag if it was set
    if (locale.forcedUSD && originalDetectedLocale) {
      setLocale({
        ...originalDetectedLocale,
        forcedUSD: false,
      });
    }
  }, []); // Empty dependency array means this runs once on mount
  
  // Check if we're currently showing in the user's local currency or USD
  const isShowingLocalCurrency = locale.detected && locale.currencyCode !== "USD" && !locale.forcedUSD;

  const handleToggleCurrency = () => {
    try {
      // If we're showing local currency, switch to USD
      if (isShowingLocalCurrency) {
        // Save the current locale before switching to USD
        originalDetectedLocale = {
          countryCode: locale.countryCode,
          countryName: locale.countryName,
          currencyCode: locale.currencyCode,
          currencySymbol: locale.currencySymbol,
          exchangeRate: locale.exchangeRate,
          locale: locale.locale,
          routePrefix: locale.routePrefix,
        };
        
        window.sessionStorage.setItem("kp_locale_override", "USD");
        setLocale({
          countryCode: "US",
          countryName: "United States",
          currencyCode: "USD",
          currencySymbol: "$",
          exchangeRate: 1,
          locale: "en-US",
          forcedUSD: true,
          routePrefix: "",
        });
      } 
      // If we're showing USD (forced), switch back to local currency
      else if (locale.forcedUSD && originalDetectedLocale) {
        window.sessionStorage.removeItem("kp_locale_override");
        setLocale({
          ...originalDetectedLocale,
          forcedUSD: false,
        });
      }
    } catch {
      /* ignore */
    }
  };

  // Save the detected locale when it's first detected
  if (locale.detected && locale.currencyCode !== "USD" && !originalDetectedLocale && !locale.forcedUSD) {
    originalDetectedLocale = {
      countryCode: locale.countryCode,
      countryName: locale.countryName,
      currencyCode: locale.currencyCode,
      currencySymbol: locale.currencySymbol,
      exchangeRate: locale.exchangeRate,
      locale: locale.locale,
      routePrefix: locale.routePrefix,
    };
  }

  // Determine if we should show the currency toggle
  const showCurrencyToggle = (locale.detected && locale.currencyCode !== "USD" && !locale.forcedUSD) || (locale.forcedUSD && originalDetectedLocale);
  
  const toggleLabel = locale.forcedUSD && originalDetectedLocale 
    ? `Switch to ${originalDetectedLocale.currencyCode} · ${originalDetectedLocale.countryCode}`
    : `Switch to USD`;

  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-16 text-center sm:py-20 md:py-28">
          <span className="kp-eyebrow">Pricing</span>
          <h1 className="kp-display mt-5 text-4xl sm:text-5xl md:text-6xl">
            Plans that scale with your career.
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Start free. Upgrade only when KitPager is closing real deals for you.
          </p>

          {/* Cadence toggle */}
          <div className="mt-8 inline-flex rounded-full border border-border bg-surface p-1 text-sm">
            <button
              type="button"
              onClick={() => setCadence("monthly")}
              className={`rounded-full px-5 py-2 font-medium transition ${
                !isAnnual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setCadence("annual")}
              className={`flex items-center gap-2 rounded-full px-5 py-2 font-medium transition ${
                isAnnual ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Annual
              <span className="rounded-full bg-success/20 px-2 py-0.5 text-[10px] font-semibold text-success">
                Save 2 months
              </span>
            </button>
          </div>
        </div>
      </section>

      <section className="kp-container -mt-10 pb-16 sm:pb-24">
        <div className="grid gap-4 md:grid-cols-3">
          {PLANS.map((p) => (
            <PlanCard key={p.name} plan={p} cadence={cadence} />
          ))}
        </div>

        {/* Founding Member offer */}
        <div className="mt-8">
          <FoundingMemberCard />
        </div>

        <div className="mt-10 text-center">
          {/* Currency toggle - only shows when user's currency is different from USD */}
          {showCurrencyToggle && (
            <p className="text-xs text-muted-foreground">
              {locale.forcedUSD 
                ? "Showing prices in USD" 
                : `Showing prices in ${locale.currencyCode} · ${locale.countryCode}`
              }
              {" · "}
              <button
                type="button"
                onClick={handleToggleCurrency}
                className="underline hover:text-foreground"
              >
                {toggleLabel}
              </button>
            </p>
          )}
          <p className={`text-xs text-muted-foreground ${showCurrencyToggle ? 'mt-2' : ''}`}>
            Cancel anytime. All prices via secure Paddle checkout.
          </p>
        </div>
      </section>

      <FoundingMemberPopup />
    </>
  );
}

interface PlanCardProps {
  plan: PlanDef;
  cadence: Cadence;
}
function PlanCard({ plan, cadence }: PlanCardProps) {
  const isAnnual = cadence === "annual";
  const locale = useLocaleStore();
  const isFree = plan.monthly === 0;

  const priceDisplay: string = isFree
    ? "$0"
    : isAnnual
      ? formatPrice(plan.annualMonthly, locale)
      : formatPrice(plan.monthly, locale);
  const cadenceLabel = isFree ? "forever" : "/mo";
  const strike: number = isAnnual ? plan.annualStrike : plan.monthlyStrike;
  const annualSubline: string | null = !isFree && isAnnual
    ? `billed ${formatPrice(plan.annual, locale)} /yr`
    : null;
  const savings: number = !isFree && isAnnual ? plan.annualStrike - plan.annual : 0;

  return (
    <div
      className={`kp-card relative flex flex-col p-6 sm:p-8 ${
        plan.highlight ? "border-primary/40 shadow-glow" : ""
      }`}
    >
      {plan.highlight && (
        <span className="absolute -top-3 left-6 rounded-full bg-primary px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-primary-foreground">
          Most popular
        </span>
      )}
      <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {plan.name}
      </h3>
      <div
        key={`${cadence}-${locale.currencyCode}`}
        className="mt-4 animate-in fade-in duration-200"
      >
        <p className="kp-display flex flex-col items-baseline gap-0 text-6xl sm:text-4xl">
          {!isFree && strike > 0 && !isAnnual && (
            <span className="text-base text-muted-foreground/60 line-through">
              {formatPrice(strike, locale)}
            </span>
          )}
          <div>
          <span>{priceDisplay}</span>
          <span className="text-base text-muted-foreground">{cadenceLabel}</span>
          </div>
        </p>
        {annualSubline && (
          <p className="mt-1 text-xs text-muted-foreground">
            {annualSubline}{" "}
            <span className="text-muted-foreground/60 line-through">
              {formatPrice(strike, locale)}
            </span>{" "}
            <span className="font-semibold text-success">
              Save {formatPrice(savings, locale)}
            </span>
          </p>
        )}
      </div>
      <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
      <Link
        to={plan.ctaTo}
        className={`mt-6 inline-flex w-full items-center justify-center rounded-full px-4 py-3 text-sm font-medium transition ${
          plan.highlight
            ? "bg-primary text-primary-foreground hover:bg-primary-hover"
            : "border border-border bg-surface text-foreground hover:bg-surface-2"
        }`}
      >
        {plan.cta}
      </Link>
      <ul className="mt-8 space-y-2.5 text-sm">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2.5">
            <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}