import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";

export default function About() {
  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-20 text-center md:py-28">
          <span className="kp-eyebrow">About</span>
          <h1 className="kp-display mt-5 text-5xl md:text-6xl">Built by people who've sent the bad PDF.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
            KitPager exists because the way creators present themselves to brands is broken.
            Canva PDFs, dead Notion pages, and screenshots from a year ago.
            Brands deserve better. Creators deserve to be taken seriously.
          </p>
        </div>
      </section>

      <section className="kp-container grid gap-12 py-20 md:grid-cols-[1.1fr_1fr] md:items-center">
        <div className="space-y-6 text-foreground/80">
          <p>
            KitPager is a small, focused team. We build the product we wish we had when we first started pitching brands.
            We obsess over speed, polish, and trust — because those are the three things that decide whether a creator gets the deal.
          </p>
          <p>
            We don't sell your data. We don't game metrics. We don't add features that don't help you close.
            Every line of this product is built so that the moment a brand opens your link, they think: "this person is serious."
          </p>
        </div>
        <ImagePlaceholder
          aspect="square"
          title="About — abstract brand illustration"
          dimensions="1400x1400"
          orientation="square"
          description="A premium abstract composition: layered translucent paper-like rectangles in warm neutrals with a single deep-teal accent stripe. No people, no logos. Editorial calm."
          background="warm off-white"
          facesAllowed={false}
          usage="/about page side art"
          format="png or svg"
        />
      </section>
    </>
  );
}
