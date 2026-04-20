import { PageHeader, CTAStrip } from "@/components/marketing/PageHeader";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const EXAMPLES = [
  { slug: "alexrivera", name: "Alex Rivera", niche: "Tech, Lifestyle", followers: "4.2M", color: "from-purple-600/40 to-fuchsia-500/30" },
  { slug: "miraokafor", name: "Mira Okafor", niche: "Skincare, Wellness", followers: "1.1M", color: "from-rose-500/40 to-amber-500/30" },
  { slug: "jordanchen", name: "Jordan Chen", niche: "Food, Travel", followers: "820K", color: "from-emerald-500/40 to-cyan-500/30" },
  { slug: "saraellis", name: "Sara Ellis", niche: "Fashion", followers: "2.6M", color: "from-violet-600/40 to-indigo-500/30" },
  { slug: "devonwright", name: "Devon Wright", niche: "Fitness", followers: "640K", color: "from-orange-500/40 to-red-500/30" },
  { slug: "lucayama", name: "Luca Yama", niche: "Music, Production", followers: "1.9M", color: "from-sky-500/40 to-blue-500/30" },
];

export default function Examples() {
  return (
    <>
      <PageHeader
        eyebrow="Examples"
        title={<>Real creator pages, ready to study.</>}
        subtitle="Six sample KitPager pages across niches. Click any to view the public layout end to end."
      />

      <section className="kp-container mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map((ex) => (
          <Link
            key={ex.slug}
            to={`/${ex.slug}`}
            className="kp-card kp-card-hover group overflow-hidden"
          >
            <div className={`relative h-44 bg-gradient-to-br ${ex.color}`}>
              <div className="absolute inset-0 grid place-items-center">
                <span className="kp-display text-4xl text-foreground/85">{ex.name.split(" ").map(n => n[0]).join("")}</span>
              </div>
            </div>
            <div className="p-5">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="kp-display text-xl">{ex.name}</h3>
                  <p className="mt-0.5 text-xs text-muted-foreground">{ex.niche}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
              </div>
              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="kp-mono text-muted-foreground">kitpager.pro/{ex.slug}</span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-foreground/70">{ex.followers}</span>
              </div>
            </div>
          </Link>
        ))}
      </section>

      <CTAStrip />
    </>
  );
}
