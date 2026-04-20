import { PageHeader, CTAStrip } from "@/components/marketing/PageHeader";
import { BookOpen, FileText, Scale, Sparkles, TrendingUp, Users } from "lucide-react";

const RESOURCES = [
  { icon: BookOpen, title: "The brand deal playbook", body: "How to negotiate, scope, and close partnerships without leaving money on the table.", tag: "Guide" },
  { icon: FileText, title: "Creator contract template", body: "Plain-English contract template covering deliverables, usage rights, exclusivity, and payment.", tag: "Template" },
  { icon: Scale, title: "FTC disclosure checklist", body: "Stay compliant on every sponsored post across TikTok, Instagram, and YouTube.", tag: "Checklist" },
  { icon: TrendingUp, title: "Rate benchmarks Q2 2026", body: "What 200 creators are charging by platform, follower tier, and niche this quarter.", tag: "Benchmark" },
  { icon: Users, title: "Inbound vs outbound", body: "When to chase brands and when to let your KitPager page do the work.", tag: "Strategy" },
  { icon: Sparkles, title: "Pitch deck patterns that work", body: "The four pitch structures we see closing the most inbound briefs.", tag: "Guide" },
];

export default function Resources() {
  return (
    <>
      <PageHeader
        eyebrow="Resources"
        title={<>Field notes for serious creators.</>}
        subtitle="Templates, benchmarks, and tactical guides — written by operators who built creator businesses."
      />

      <section className="kp-container mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {RESOURCES.map((r) => (
          <article key={r.title} className="kp-card kp-card-hover p-6">
            <div className="flex items-start justify-between">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-primary-highlight text-primary">
                <r.icon className="h-4 w-4" />
              </span>
              <span className="rounded-full border border-border bg-surface px-2.5 py-0.5 text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                {r.tag}
              </span>
            </div>
            <h3 className="kp-display mt-5 text-xl">{r.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{r.body}</p>
            <a className="mt-5 inline-flex text-sm text-primary hover:underline" href="#">
              Read article
            </a>
          </article>
        ))}
      </section>

      <CTAStrip />
    </>
  );
}
