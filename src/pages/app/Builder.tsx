import { useEffect, useState } from "react";
import {
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Eye,
  ChevronDown,
  User,
  Image as ImageIcon,
  Tag,
  Link2,
  FileText,
  Film,
  Briefcase,
  Star,
  DollarSign,
  Settings as SettingsIcon,
  Inbox,
  Check,
  Lock,
  ExternalLink,
  Minus,
  Plus,
  Maximize2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useKitPageStore, type TemplateId, type KitPageData } from "@/store/kitPage";
import { TemplateRenderer, TEMPLATE_META } from "@/components/templates/TemplateRenderer";
import { useEffectivePlan, planMeets } from "@/store/plan";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const DEVICES = [
  { id: "mobile", icon: Smartphone, label: "Mobile", w: 390, h: 844 },
  { id: "tablet", icon: Tablet, label: "Tablet", w: 820, h: 1100 },
  { id: "desktop", icon: Monitor, label: "Desktop", w: 1200, h: 820 },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

const SECTIONS = [
  { id: "template", label: "Template", icon: ImageIcon },
  { id: "identity", label: "Identity", icon: User },
  { id: "tags", label: "Niche tags", icon: Tag },
  { id: "platforms", label: "Platforms", icon: Link2 },
  { id: "about", label: "About", icon: FileText },
  { id: "gallery", label: "Content gallery", icon: Film },
  { id: "collabs", label: "Brand collaborations", icon: Briefcase },
  { id: "testimonials", label: "Testimonials", icon: Star },
  { id: "rates", label: "Rates", icon: DollarSign },
  { id: "inquiry", label: "Inquiry form", icon: Inbox },
  { id: "page", label: "Page settings", icon: SettingsIcon },
] as const;

export default function Builder() {
  const data = useKitPageStore((s) => s.data);
  const setData = useKitPageStore((s) => s.setData);
  const setTemplate = useKitPageStore((s) => s.setTemplate);
  const plan = useEffectivePlan();

  const [device, setDevice] = useState<DeviceId>("desktop");
  const [open, setOpen] = useState<string>("template");
  const [publishing, setPublishing] = useState(false);
  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const raw = window.localStorage.getItem("kp_builder_zoom");
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n >= 0.5 && n <= 1.5 ? n : 1;
  });
  useEffect(() => {
    try {
      window.localStorage.setItem("kp_builder_zoom", String(zoom));
    } catch {
      // ignore
    }
  }, [zoom]);
  const current = DEVICES.find((d) => d.id === device)!;

  const handlePublish = () => {
    setPublishing(true);
    window.setTimeout(() => {
      setPublishing(false);
      toast({ title: "Published", description: `Your kit page is live at /${data.slug}` });
    }, 1000);
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
        <div className="kp-mono text-xs text-muted-foreground">
          draft · template <span className="text-foreground">{TEMPLATE_META[data.template].label}</span> · auto-saved
        </div>
        <div className="kp-glass flex items-center gap-1 rounded-full p-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${
                device === d.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <d.icon className="h-3.5 w-3.5" /> {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/${data.slug}`}
            target="_blank"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-surface-2"
          >
            <Eye className="h-3.5 w-3.5" /> Preview <ExternalLink className="h-3 w-3" />
          </Link>
          <Button
            size="sm"
            loaderClick
            isLoading={publishing}
            onClick={handlePublish}
            className="rounded-full"
          >
            <Save className="h-3.5 w-3.5" /> Publish
          </Button>
        </div>
      </div>

      {/* Main: canvas + right panel */}
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* Live preview canvas — never scrolls, device frame scales to fit */}
        <div className="relative min-h-0 overflow-hidden bg-surface-2">
          <div className="flex h-full w-full items-center justify-center p-4 md:p-6">
            <div
              className="overflow-hidden rounded-3xl border border-border bg-background shadow-lg transition-[width,height] duration-300 ease-out"
              style={{
                width: current.w,
                height: current.h,
                maxWidth: "100%",
                maxHeight: "100%",
                transform: `scale(${zoom})`,
                transformOrigin: "center top",
                flexShrink: 0,
              }}
            >
              <div className="h-full overflow-y-auto">
                <TemplateRenderer data={data} preview />
              </div>
            </div>
          </div>
          {/* Zoom controls */}
          <div className="absolute bottom-3 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border border-border bg-background/90 p-1 shadow-md backdrop-blur">
            <button
              type="button"
              onClick={() => setZoom((z) => Math.max(0.5, Math.round((z - 0.1) * 10) / 10))}
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="kp-mono w-10 text-center text-xs">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))}
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              aria-label="Zoom in"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setZoom(1)}
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground"
              aria-label="Reset zoom"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right editor panel */}
        <aside className="flex min-h-0 flex-col border-l border-border bg-background">
          <div className="shrink-0 border-b border-border p-4">
            <h3 className="kp-display text-lg">Page editor</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Changes save instantly to your draft.
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {SECTIONS.map((s) => (
              <Section
                key={s.id}
                icon={s.icon}
                label={s.label}
                open={open === s.id}
                onToggle={() => setOpen(open === s.id ? "" : s.id)}
              >
                {s.id === "template" && (
                  <TemplatePicker current={data.template} plan={plan} onSelect={setTemplate} />
                )}
                {s.id === "identity" && <IdentitySection data={data} setData={setData} />}
                {s.id === "tags" && <TagsSection data={data} setData={setData} />}
                {s.id === "about" && <AboutSection data={data} setData={setData} />}
                {s.id === "platforms" && (
                  <p className="text-xs text-muted-foreground">
                    Manage in <Link to="/app/platforms" className="text-primary hover:underline">Platforms</Link>.
                  </p>
                )}
                {s.id === "gallery" && (
                  <p className="text-xs text-muted-foreground">
                    {data.contentGallery.length} cards · drag-and-drop coming soon.
                  </p>
                )}
                {s.id === "collabs" && (
                  <p className="text-xs text-muted-foreground">{data.brandCollabs.length} brand collaborations added.</p>
                )}
                {s.id === "testimonials" && (
                  <Link
                    to="/app/testimonials"
                    className="block rounded-lg bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary-hover"
                  >
                    Manage testimonials
                  </Link>
                )}
                {s.id === "rates" && (
                  <Link
                    to="/app/rates"
                    className="block rounded-lg border border-border px-3 py-2 text-center text-xs hover:bg-surface-2"
                  >
                    Edit rate card →
                  </Link>
                )}
                {s.id === "inquiry" && <InquirySection data={data} setData={setData} />}
                {s.id === "page" && (
                  <Link
                    to="/app/settings/page"
                    className="block text-center text-xs text-primary hover:underline"
                  >
                    Open page settings →
                  </Link>
                )}
              </Section>
            ))}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* ---------- Section primitives ---------- */

function Section({
  icon: Icon,
  label,
  open,
  onToggle,
  children,
}: {
  icon: typeof User;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-2 overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium hover:bg-surface-2"
      >
        <span className="flex items-center gap-2.5">
          <Icon className="h-4 w-4 text-muted-foreground" />
          {label}
        </span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-3 border-t border-border p-3">{children}</div>}
    </div>
  );
}

function TemplatePicker({
  current,
  plan,
  onSelect,
}: {
  current: TemplateId;
  plan: ReturnType<typeof useEffectivePlan>;
  onSelect: (t: TemplateId) => void;
}) {
  const templates: TemplateId[] = ["minimal", "bold", "professional"];
  return (
    <div className="space-y-2">
      {templates.map((id) => {
        const meta = TEMPLATE_META[id];
        const locked = !!meta.planRequired && !planMeets(plan, meta.planRequired);
        const active = current === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => {
              if (locked) {
                window.dispatchEvent(
                  new CustomEvent("kp:upgrade", {
                    detail: { targetPlan: meta.planRequired, featureName: `${meta.label} template` },
                  }),
                );
                return;
              }
              onSelect(id);
              toast({ title: "Template applied", description: `${meta.label} is now active.` });
            }}
            className={`group relative w-full overflow-hidden rounded-xl border p-3 text-left transition ${
              active ? "border-primary bg-primary/5" : "border-border bg-surface hover:bg-surface-2"
            }`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold">{meta.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{meta.tagline}</p>
              </div>
              {active ? (
                <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" />
                </span>
              ) : locked ? (
                <span className="inline-flex items-center gap-0.5 rounded-full bg-warning/20 px-1.5 py-0.5 text-[9px] font-bold uppercase text-warning">
                  <Lock className="h-2.5 w-2.5" /> {meta.planRequired}
                </span>
              ) : null}
            </div>
            <TemplatePreviewSwatch id={id} />
          </button>
        );
      })}
    </div>
  );
}

function TemplatePreviewSwatch({ id }: { id: TemplateId }) {
  if (id === "minimal") {
    return (
      <div className="mt-3 h-14 rounded-lg border border-border bg-background p-2">
        <div className="mx-auto h-2.5 w-1/3 rounded-full bg-foreground/40" />
        <div className="mx-auto mt-1 h-1.5 w-1/2 rounded-full bg-foreground/15" />
        <div className="mt-2 grid grid-cols-3 gap-1">
          <div className="h-1.5 rounded bg-foreground/15" />
          <div className="h-1.5 rounded bg-foreground/15" />
          <div className="h-1.5 rounded bg-foreground/15" />
        </div>
      </div>
    );
  }
  if (id === "bold") {
    return (
      <div className="mt-3 h-14 overflow-hidden rounded-lg" style={{ background: "var(--gradient-primary)" }}>
        <div className="p-2">
          <div className="h-3 w-3/4 rounded bg-primary-foreground/80" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-primary-foreground/50" />
        </div>
      </div>
    );
  }
  return (
    <div className="mt-3 h-14 rounded-lg border border-border bg-background p-1.5">
      <div className="grid grid-cols-[1fr_auto] gap-1">
        <div>
          <div className="h-1.5 w-1/3 rounded bg-foreground/40" />
          <div className="mt-1 h-1.5 w-1/2 rounded bg-foreground/15" />
        </div>
        <div className="h-3 w-6 rounded bg-success/40" />
      </div>
      <div className="mt-2 space-y-0.5">
        <div className="h-1 w-full rounded bg-foreground/10" />
        <div className="h-1 w-full rounded bg-foreground/10" />
        <div className="h-1 w-3/4 rounded bg-foreground/10" />
      </div>
    </div>
  );
}

/* ---------- Editable form sections ---------- */

function IdentitySection({ data, setData }: { data: KitPageData; setData: (p: Partial<KitPageData>) => void }) {
  return (
    <>
      <Field label="Display name" value={data.displayName} onChange={(v) => setData({ displayName: v })} />
      <Field label="Tagline" value={data.tagline} onChange={(v) => setData({ tagline: v })} />
      <Field label="Slug" value={data.slug} onChange={(v) => setData({ slug: v })} mono />
      <Field label="Public contact email" value={data.contactEmail} onChange={(v) => setData({ contactEmail: v })} />
    </>
  );
}

function TagsSection({ data, setData }: { data: KitPageData; setData: (p: Partial<KitPageData>) => void }) {
  return (
    <Field
      label="Niche tags"
      value={data.nicheTags.join(", ")}
      onChange={(v) => setData({ nicheTags: v.split(",").map((s) => s.trim()).filter(Boolean) })}
      hint="Comma-separated"
    />
  );
}

function AboutSection({ data, setData }: { data: KitPageData; setData: (p: Partial<KitPageData>) => void }) {
  return (
    <>
      <Field label="Bio" value={data.bio} onChange={(v) => setData({ bio: v })} textarea />
      <Field label="Location" value={data.location} onChange={(v) => setData({ location: v })} />
      <Field
        label="Languages"
        value={data.languages.join(", ")}
        onChange={(v) => setData({ languages: v.split(",").map((s) => s.trim()).filter(Boolean) })}
      />
      <Field
        label="Creating since"
        value={String(data.creatingSince ?? "")}
        onChange={(v) => setData({ creatingSince: v ? Number(v) : null })}
      />
      <Field label="Collaboration style" value={data.collabStyle} onChange={(v) => setData({ collabStyle: v })} textarea />
    </>
  );
}

function InquirySection({ data, setData }: { data: KitPageData; setData: (p: Partial<KitPageData>) => void }) {
  return (
    <>
      <Field
        label="Intro message"
        value={data.inquirySettings.introMessage ?? ""}
        onChange={(v) => setData({ inquirySettings: { ...data.inquirySettings, introMessage: v } })}
        textarea
      />
      <Toggle
        label="Show budget field"
        on={data.inquirySettings.showBudgetField}
        onChange={(v) => setData({ inquirySettings: { ...data.inquirySettings, showBudgetField: v } })}
      />
    </>
  );
}

/* ---------- Field primitives ---------- */

function Field({
  label,
  value,
  onChange,
  hint,
  textarea,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  hint?: string;
  textarea?: boolean;
  mono?: boolean;
}) {
  const cls = `mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${
    mono ? "kp-mono" : ""
  }`;
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className={cls} />
      )}
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Toggle({ label, on, onChange }: { label: string; on: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
      <span className="text-xs">{label}</span>
      <button
        onClick={() => onChange(!on)}
        className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-surface-offset"}`}
      >
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
