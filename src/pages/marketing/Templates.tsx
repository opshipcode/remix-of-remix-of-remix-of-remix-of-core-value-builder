import { Link } from "react-router-dom";

import { ArrowRight } from "lucide-react";
import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";

const TEMPLATES = [
  {
    id: "minimal",
    name: "Minimal",
    blurb: "Editorial typography, calm whitespace, premium quiet.",
    best: "Tech, lifestyle, design, premium UGC.",
    spec: "Full-page mockup of the Minimal template — large editorial header with creator name in serif display, single-column proof grid, restrained teal accents on warm off-white. Apple.com-grade polish.",
  },
  {
    id: "bold",
    name: "Bold",
    blurb: "Color-forward, image-led, high contrast.",
    best: "Beauty, fashion, food, fitness.",
    spec: "Full-page mockup of the Bold template — magazine-style hero with full-bleed creator photo placeholder, two-column proof grid with thick borders, larger type, deeper teal accents.",
  },
  {
    id: "professional",
    name: "Professional",
    blurb: "Structured, data-rich, brand-safe.",
    best: "Business, finance, B2B, agency-roster creators.",
    spec: "Full-page mockup of the Professional template — structured rate card up top, audience demographics chart, conservative serif/sans pairing, denser layout, neutral palette.",
  },
];

export default function Templates() {
  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-20 text-center md:py-28">
          <span className="kp-eyebrow">Templates</span>
          <h1 className="kp-display mt-5 text-5xl md:text-6xl">Three distinct ways to show your best work.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            Switch templates with one click. Your content stays exactly where it should.
          </p>
        </div>
      </section>

      <section className="kp-container space-y-24 py-20 md:py-28">
        {TEMPLATES.map((t, i) => (
          <div
            key={t.id}
            className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${
              i % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
            }`}
          >
            <div>
              <span className="kp-eyebrow">Template {String(i + 1).padStart(2, "0")}</span>
              <h2 className="kp-display mt-4 text-4xl md:text-5xl">{t.name}</h2>
              <p className="mt-3 text-lg text-muted-foreground">{t.blurb}</p>
              <p className="mt-6 text-sm text-foreground/80">
                <span className="font-semibold">Best for:</span> {t.best}
              </p>
              <Link
                to={`/${t.id}-demo`}
                className="mt-8 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-5 py-2.5 text-sm font-medium transition hover:bg-surface-2"
              >
                Preview live
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ImagePlaceholder
              aspect="portrait"
              title={`${t.name} template — full mockup`}
              dimensions="1200x1500"
              orientation="portrait"
              description={t.spec}
              background="warm off-white with subtle gradient backdrop"
              facesAllowed={false}
              usage={`/templates page — ${t.name} block`}
              format="png"
            />
          </div>
        ))}
      </section>
    </>
  );
}
