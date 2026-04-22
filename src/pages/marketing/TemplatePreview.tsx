import { useMemo } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Star, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TemplateRenderer, TEMPLATE_META } from "@/components/templates/TemplateRenderer";
import type { TemplateId } from "@/store/kitPage";
import { buildDemoCreator } from "@/lib/demoCreator";
import { getAggregate } from "@/lib/templateRatings";
import { useAuthStore } from "@/store/auth";

const VALID_IDS: readonly TemplateId[] = ["minimal", "bold", "professional"];

export default function TemplatePreview() {
  const { templateId } = useParams<{ templateId: string }>();
  const navigate = useNavigate();
  const isAuthed = useAuthStore((s) => s.isAuthenticated);

  const id = useMemo<TemplateId>(() => {
    if (templateId && VALID_IDS.includes(templateId as TemplateId)) {
      return templateId as TemplateId;
    }
    return "minimal";
  }, [templateId]);

  const meta = TEMPLATE_META[id];
  const demo = useMemo(() => buildDemoCreator(id), [id]);
  const agg = getAggregate(id);

  return (
    <div className="bg-background">
      <div className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
        <div className="kp-container flex flex-wrap items-center justify-between gap-3 py-3">
          <button
            type="button"
            onClick={() => navigate("/templates")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> All templates
          </button>
          <div className="flex items-center gap-3">
            <div>
              <p className="text-sm font-semibold leading-tight">{meta.label}</p>
              <p className="text-[11px] text-muted-foreground">{meta.tagline}</p>
            </div>
            {meta.planRequired && (
              <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-warning">
                <Lock className="h-2.5 w-2.5" /> {meta.planRequired}
              </span>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" />
              <span className="kp-mono">{agg.avg.toFixed(1)}</span>
              <span>({agg.count})</span>
            </div>
          </div>
          <Button asChild size="sm" className="rounded-full">
            {isAuthed ? (
              <Link to={`/app/templates/${id}`}>Set as my template →</Link>
            ) : (
              <Link to="/signup">Sign up to use this template →</Link>
            )}
          </Button>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="border-b border-border bg-surface px-4 py-2 text-center text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          Live preview · demo data
        </div>
        <div className="bg-background">
          <TemplateRenderer data={demo} preview />
        </div>
      </div>
    </div>
  );
}
