import { useMemo, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Lock, Check, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateRenderer, TEMPLATE_META } from "@/components/templates/TemplateRenderer";
import { useKitPageStore, type TemplateId } from "@/store/kitPage";
import { useEffectivePlan, planMeets } from "@/store/plan";
import { buildDemoCreator } from "@/lib/demoCreator";
import { getAggregate, getMyRating, setMyRating } from "@/lib/templateRatings";
import { toast } from "@/hooks/use-toast";

const VALID_IDS: readonly TemplateId[] = ["minimal", "bold", "professional"];

export default function AppTemplatePreview() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const data = useKitPageStore((s) => s.data);
  const setTemplate = useKitPageStore((s) => s.setTemplate);
  const plan = useEffectivePlan();

  const id = useMemo<TemplateId>(() => {
    if (templateId && VALID_IDS.includes(templateId as TemplateId)) {
      return templateId as TemplateId;
    }
    return "minimal";
  }, [templateId]);

  const meta = TEMPLATE_META[id];
  const demo = useMemo(() => buildDemoCreator(id), [id]);
  const stored = getMyRating(id);
  const [myRating, setMyR] = useState(stored?.rating ?? 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [thumbs, setThumbs] = useState(stored?.thumbsUp ?? false);
  const [agg, setAgg] = useState(getAggregate(id));
  const [applying, setApplying] = useState(false);

  const active = data.template === id;
  const locked = !!meta.planRequired && !planMeets(plan, meta.planRequired);

  const persistRating = (rating: number, thumbsUp: boolean) => {
    setMyRating(id, { rating, thumbsUp });
    setAgg(getAggregate(id));
  };

  const handleStar = (n: number) => {
    setMyR(n);
    persistRating(n, thumbs);
    toast({ title: "Thanks for rating", description: `${n} stars on ${meta.label}` });
  };

  const handleThumbs = () => {
    const next = !thumbs;
    setThumbs(next);
    persistRating(myRating, next);
  };

  const setActive = () => {
    if (locked) {
      window.dispatchEvent(
        new CustomEvent<{ targetPlan: "Creator" | "Pro"; featureName: string }>(
          "kp:upgrade",
          { detail: { targetPlan: meta.planRequired ?? "Creator", featureName: `${meta.label} template` } },
        ),
      );
      return;
    }
    setApplying(true);
    window.setTimeout(() => {
      setTemplate(id);
      setApplying(false);
      toast({ title: "Template updated", description: `Now using ${meta.label}.` });
    }, 800);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden lg:flex-row">
      {/* Mobile: top bar with controls */}
      <div className="border-b border-border bg-surface px-4 py-3 lg:hidden">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/app/templates")}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> All templates
          </button>
          {active ? (
            <Button size="sm" disabled className="bg-success text-success-foreground">
              <Check className="h-3.5 w-3.5" /> Active
            </Button>
          ) : (
            <Button size="sm" loaderClick isLoading={applying} onClick={setActive}>
              {locked ? <Lock className="h-3.5 w-3.5" /> : null} Set active
            </Button>
          )}
        </div>
      </div>

      {/* Preview panel */}
      <div className="min-h-0 flex-1 overflow-y-auto bg-surface-2 lg:w-[70%]">
        <div className="bg-background">
          <TemplateRenderer data={demo} preview />
        </div>
      </div>

      {/* Desktop right panel */}
      <aside className="hidden shrink-0 flex-col border-l border-border bg-background lg:flex lg:w-[30%]">
        <div className="border-b border-border p-6">
          <button
            type="button"
            onClick={() => navigate("/app/templates")}
            className="inline-flex items-center gap-1 text-xs text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to all templates
          </button>
          <h2 className="kp-display mt-3 text-2xl">{meta.label}</h2>
          <p className="mt-1 text-sm text-muted-foreground">{meta.tagline}</p>
          {meta.planRequired && (
            <span className="mt-3 inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
              <Lock className="h-2.5 w-2.5" /> {meta.planRequired}
            </span>
          )}
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Aggregate rating
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Star className="h-5 w-5 fill-primary text-primary" />
              <span className="kp-display text-2xl">{agg.avg.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">({agg.count} ratings)</span>
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Your rating
            </p>
            <div
              className="mt-2 flex items-center gap-1"
              onMouseLeave={() => setHoverRating(0)}
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => handleStar(n)}
                  onMouseEnter={() => setHoverRating(n)}
                  aria-label={`Rate ${n}`}
                >
                  <Star
                    className={`h-6 w-6 transition ${
                      n <= (hoverRating || myRating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              Thumbs up
            </p>
            <div className="mt-2 flex items-center gap-3">
              <button
                type="button"
                onClick={handleThumbs}
                className={`grid h-10 w-10 place-items-center rounded-full border transition ${
                  thumbs
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-surface text-foreground hover:bg-surface-2"
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
              </button>
              <span className="kp-mono text-sm">{agg.thumbs.toLocaleString()}</span>
            </div>
          </div>
        </div>
        <div className="border-t border-border p-6">
          {active ? (
            <Button disabled className="w-full bg-success text-success-foreground">
              <Check className="h-4 w-4" /> Active template
            </Button>
          ) : (
            <Button
              loaderClick
              isLoading={applying}
              onClick={setActive}
              className="w-full"
              size="lg"
            >
              {locked ? <Lock className="h-4 w-4" /> : null}
              Set as my active template
            </Button>
          )}
          <Link
            to="/app/templates"
            className="mt-3 block text-center text-xs text-muted-foreground hover:text-foreground"
          >
            Back to all templates
          </Link>
        </div>
      </aside>
    </div>
  );
}
