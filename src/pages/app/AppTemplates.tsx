import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { AppHeader, AppPage } from "@/components/app/AppPage";
import { Button } from "@/components/ui/button";
import { TEMPLATE_META } from "@/components/templates/TemplateRenderer";
import { useKitPageStore, type TemplateId } from "@/store/kitPage";
import { useEffectivePlan, planMeets } from "@/store/plan";
import { getAggregate } from "@/lib/templateRatings";
import { Check, Star, Lock, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const TEMPLATE_IDS: TemplateId[] = ["minimal", "bold", "professional"];

export default function AppTemplates() {
  const data = useKitPageStore((s) => s.data);
  const setTemplate = useKitPageStore((s) => s.setTemplate);
  const plan = useEffectivePlan();
  const [applyingId, setApplyingId] = useState<TemplateId | null>(null);

  const activeMeta = TEMPLATE_META[data.template];
  const activeAgg = useMemo(() => getAggregate(data.template), [data.template]);

  const handleSetActive = (id: TemplateId) => {
    const meta = TEMPLATE_META[id];
    const locked = !!meta.planRequired && !planMeets(plan, meta.planRequired);
    if (locked) {
      window.dispatchEvent(
        new CustomEvent<{ targetPlan: "Creator" | "Pro"; featureName: string }>(
          "kp:upgrade",
          { detail: { targetPlan: meta.planRequired ?? "Creator", featureName: `${meta.label} template` } },
        ),
      );
      return;
    }
    setApplyingId(id);
    window.setTimeout(() => {
      setTemplate(id);
      setApplyingId(null);
      toast({
        title: "Template updated",
        description: `Your page now uses ${meta.label}.`,
      });
    }, 800);
  };

  return (
    <AppPage>
      <AppHeader
        title="Templates"
        description="Choose how your pitch page looks to brands."
      />

      <div className="kp-card mb-8 flex flex-col items-start justify-between gap-4 p-6 md:flex-row md:items-center">
        <div className="flex items-center gap-4">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 text-primary">
            <Check className="h-6 w-6" />
          </div>
          <div>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-[10px] font-semibold uppercase text-success">
              Active
            </span>
            <h2 className="kp-display mt-1 text-2xl">{activeMeta.label}</h2>
            <p className="text-sm text-muted-foreground">{activeMeta.tagline}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Star className="h-4 w-4 fill-primary text-primary" />
          <span className="kp-mono">{activeAgg.avg.toFixed(1)}</span>
          <span className="text-muted-foreground">({activeAgg.count})</span>
          <a href="#choose" className="ml-3 text-xs text-primary hover:underline">
            Change template
          </a>
        </div>
      </div>

      <div id="choose" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {TEMPLATE_IDS.map((id) => {
          const meta = TEMPLATE_META[id];
          const agg = getAggregate(id);
          const locked = !!meta.planRequired && !planMeets(plan, meta.planRequired);
          const active = data.template === id;
          return (
            <div key={id} className="kp-card flex flex-col overflow-hidden">
              <div className="grid aspect-[4/5] place-items-center bg-surface-2 text-xs uppercase tracking-[0.14em] text-muted-foreground">
                {meta.label} preview
              </div>
              <div className="flex flex-1 flex-col gap-3 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold">{meta.label}</h3>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {meta.tagline}
                    </p>
                  </div>
                  {meta.planRequired && (
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-warning/15 px-1.5 py-0.5 text-[9px] font-bold uppercase text-warning">
                      <Lock className="h-2.5 w-2.5" /> {meta.planRequired}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Star className="h-3 w-3 fill-primary text-primary" />
                  <span className="kp-mono">{agg.avg.toFixed(1)}</span>
                  <span>({agg.count})</span>
                </div>
                <div className="mt-auto flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1">
                    <Link to={`/app/templates/${id}`}>
                      <Eye className="h-3.5 w-3.5" /> Preview
                    </Link>
                  </Button>
                  {active ? (
                    <Button size="sm" disabled className="flex-1 bg-success text-success-foreground hover:bg-success/90">
                      <Check className="h-3.5 w-3.5" /> Active
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1"
                      loaderClick
                      isLoading={applyingId === id}
                      onClick={() => handleSetActive(id)}
                    >
                      {locked ? <Lock className="h-3.5 w-3.5" /> : null}
                      Set as active
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </AppPage>
  );
}
