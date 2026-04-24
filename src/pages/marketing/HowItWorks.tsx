import { PageHeader, CTAStrip } from "@/components/marketing/PageHeader";
import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";
import { ArrowRight, CheckCircle2 } from "lucide-react";

const STEPS = [
  {
    n: "01",
    title: "Connect your platforms",
    body: "Link TikTok, Instagram, and YouTube — or paste your handles for manual entry. We pull verified follower counts, engagement, and recent uploads automatically.",
  },
  {
    n: "02",
    title: "Drop in your proof",
    body: "Pick your best videos, attach brand collaborations, request testimonials with a single secure link. KitPager handles the storage, embeds, and verification.",
  },
  {
    n: "03",
    title: "Set rates and inquiry rules",
    body: "Public rate card or 'request via inquiry' — your call. Configure budget gates, country restrictions, password-protected private shares.",
  },
  {
    n: "04",
    title: "Publish at kitpager.pro/yourname",
    body: "Pick a slug, choose a template, and your page goes live. Brands can email or submit a structured inquiry that lands in your dashboard.",
  },
];

export default function HowItWorks() {
  return (
    <>
      <PageHeader
        eyebrow="How it works"
        title={<>From zero to brand-ready in five minutes.</>}
        subtitle="A short, structured walkthrough of the KitPager flow — from sign up to your first inquiry."
      />

      <section className="kp-container mt-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <ol className="space-y-6">
            {STEPS.map((s) => (
              <li key={s.n} className="kp-card kp-card-hover p-6 md:p-8">
                <div className="flex items-start gap-5">
                  <span className="kp-mono mt-1 rounded-full bg-primary-highlight px-3 py-1 text-xs text-primary">
                    {s.n}
                  </span>
                  <div>
                    <h3 className="kp-display text-2xl">{s.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground md:text-base">{s.body}</p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ImagePlaceholder
              aspect="portrait"
              title="Walkthrough hero artwork"
              dimensions="1200x1500"
              orientation="portrait"
              description="Editorial collage of the four product flows: a connect-platforms card, a content gallery card, a rates card, and a publish slug card — softly stacked with depth, dark mode friendly, faint purple glow."
              background="dark surface with faint electric purple radial glow"
              facesAllowed={false}
              usage="/how-it-works visual sidebar"
              format="png/jpg"
            />
          </div>
        </div>
      </section>

      <section className="kp-container mt-24">
        <h2 className="kp-display text-3xl">What you get on day one</h2>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {[
            "Verified platform metrics",
            "Brand testimonial collector",
            "Inquiry inbox with budget gating",
            "Custom slug + SEO meta",
            "Rate card with public/private modes",
            "Country and password protection",
          ].map((feat) => (
            <div key={feat} className="kp-card flex items-start gap-3 p-5">
              <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
              <p className="text-sm">{feat}</p>
            </div>
          ))}
        </div>
      </section>

      <CTAStrip />
    </>
  );
}
