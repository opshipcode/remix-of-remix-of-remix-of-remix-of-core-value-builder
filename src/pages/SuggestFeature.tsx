import { useState } from "react";
import { Lightbulb, ArrowUp, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

type Importance = "Nice to have" | "Important" | "Critical";
type Category =
  | "Builder"
  | "Analytics"
  | "Platforms"
  | "Inquiries"
  | "Templates"
  | "Pricing"
  | "Mobile"
  | "Other";

interface Suggestion {
  id: string;
  title: string;
  description: string;
  category: Category;
  importance: Importance;
  email: string;
  createdAt: string;
}

const CATEGORIES: Category[] = [
  "Builder",
  "Analytics",
  "Platforms",
  "Inquiries",
  "Templates",
  "Pricing",
  "Mobile",
  "Other",
];

const COMMUNITY: Array<{ title: string; category: Category; upvotes: number }> = [
  { title: "Schedule posts directly from the builder", category: "Builder", upvotes: 142 },
  { title: "Notion-style brand collaboration timeline", category: "Templates", upvotes: 98 },
  { title: "Bulk-import past testimonials from Gmail", category: "Inquiries", upvotes: 76 },
  { title: "Stripe payouts inside KitPager", category: "Pricing", upvotes: 54 },
];

export default function SuggestFeature() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Builder");
  const [importance, setImportance] = useState<Importance>("Important");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const reset = () => {
    setTitle("");
    setDescription("");
    setCategory("Builder");
    setImportance("Important");
    setEmail("");
    setSubmitted(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.length === 0 || description.length < 30) {
      toast({ title: "Add more detail", description: "Description needs at least 30 characters." });
      return;
    }
    setLoading(true);
    window.setTimeout(() => {
      try {
        const raw = window.localStorage.getItem("kp_suggestions");
        const list: Suggestion[] = raw ? (JSON.parse(raw) as Suggestion[]) : [];
        const next: Suggestion = {
          id: Math.random().toString(36).slice(2, 10),
          title,
          description,
          category,
          importance,
          email,
          createdAt: new Date().toISOString(),
        };
        window.localStorage.setItem("kp_suggestions", JSON.stringify([next, ...list]));
      } catch {
        /* ignore */
      }
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="kp-container max-w-3xl py-10 sm:py-14">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 text-primary">
            <Lightbulb className="h-5 w-5" />
          </span>
          <div>
            <h1 className="kp-display text-3xl sm:text-4xl">Suggest a feature</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Help shape KitPager. The best ideas come from creators using it every day.
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="kp-card mt-8 p-8 text-center">
            <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-success/15 text-success">
              <Check className="h-6 w-6" />
            </span>
            <h2 className="kp-display mt-4 text-2xl">Suggestion received</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thanks for helping make KitPager better. We read every single one.
            </p>
            <Button onClick={reset} className="mt-6 rounded-full" variant="outline">
              Submit another
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="kp-card mt-8 space-y-5 p-6 sm:p-8">
            <Field label="Feature title" hint={`${title.length}/80`}>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value.slice(0, 80))}
                required
                placeholder="One-liner that describes the feature"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <Field label="Description" hint={`${description.length}/600`}>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value.slice(0, 600))}
                required
                rows={5}
                placeholder="What's the problem? What would the ideal solution look like?"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </Field>

            <Field label="Category">
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as Category)}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </Field>

            <Field label="How important is this to you?">
              <div className="grid grid-cols-3 gap-2">
                {(["Nice to have", "Important", "Critical"] as Importance[]).map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setImportance(opt)}
                    className={`rounded-full border px-3 py-2 text-xs transition ${
                      importance === opt
                        ? "border-primary bg-primary/10 text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </Field>

            <Field label="Your email (optional)" hint="So we can follow up if we build it">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary"
              />
            </Field>

            <Button
              type="submit"
              loaderClick
              isLoading={loading}
              size="lg"
              className="w-full rounded-full"
            >
              Submit suggestion
            </Button>
          </form>
        )}

        <section className="mt-12">
          <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Recent suggestions from the community
          </h3>
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {COMMUNITY.map((s) => (
              <li
                key={s.title}
                className="kp-card flex items-start justify-between gap-3 p-4"
              >
                <div>
                  <p className="text-sm font-medium">{s.title}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.12em] text-muted-foreground">
                    {s.category}
                  </p>
                </div>
                <span className="flex shrink-0 flex-col items-center rounded-xl bg-surface-2 px-2.5 py-1.5 text-xs">
                  <ArrowUp className="h-3 w-3 text-primary" />
                  <span className="kp-mono text-[11px] font-semibold">{s.upvotes}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between">
        <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">
          {label}
        </label>
        {hint && <span className="text-[10px] text-muted-foreground">{hint}</span>}
      </div>
      {children}
    </div>
  );
}
