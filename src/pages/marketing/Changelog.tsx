const ENTRIES = [
  {
    date: "April 18, 2026",
    version: "0.4.0",
    items: [
      "Live proof engine ships for TikTok, Instagram, and YouTube",
      "Brand-side testimonial collection flow",
      "Viewed-by email notifications (Pro)",
    ],
  },
  {
    date: "April 4, 2026",
    version: "0.3.0",
    items: [
      "Builder redesign with device preview modes",
      "Analytics dashboard rewrite",
      "Country restriction controls",
    ],
  },
  {
    date: "March 22, 2026",
    version: "0.2.0",
    items: [
      "Three template designs — Minimal, Bold, Professional",
      "Onboarding wizard with draft persistence",
      "Polar billing and 7-day free trial",
    ],
  },
];

export default function Changelog() {
  return (
    <>
      <section className="bg-hero">
        <div className="kp-container py-16 text-center md:py-24">
          <span className="kp-eyebrow">Changelog</span>
          <h1 className="kp-display mt-5 text-4xl md:text-5xl">Built in public.</h1>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            What shipped, when, and why.
          </p>
        </div>
      </section>

      <section className="kp-container py-16">
        <div className="mx-auto max-w-2xl space-y-12">
          {ENTRIES.map((e) => (
            <article key={e.version} className="border-l border-border pl-6">
              <p className="kp-mono text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {e.date} &middot; v{e.version}
              </p>
              <ul className="mt-4 space-y-2 text-foreground/80">
                {e.items.map((it) => (
                  <li key={it} className="flex gap-2">
                    <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
