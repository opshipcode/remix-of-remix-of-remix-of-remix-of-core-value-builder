import { useEffect, useState } from "react";
import {
  Smartphone,
  Tablet,
  Monitor,
  Save,
  Eye,
  User,
  Tag,
  Link2,
  FileText,
  Film,
  Briefcase,
  Star,
  DollarSign,
  Settings as SettingsIcon,
  Inbox,
  Minus,
  Plus,
  Maximize2,
  Users,
  ChevronLeft,
  ChevronRight,
  Pencil,
  ExternalLink,
  Image as ImageIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useKitPageStore, type KitPageData } from "@/store/kitPage";
import { TemplateRenderer, TEMPLATE_META } from "@/components/templates/TemplateRenderer";
import { useEffectivePlan } from "@/store/plan";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { EditorSections } from "@/components/app/EditorSections";

// ─── Device definitions ───────────────────────────────────────────────────────
const DEVICES = [
  { id: "mobile", icon: Smartphone, label: "Mobile", w: 390, h: 844 },
  { id: "tablet", icon: Tablet, label: "Tablet", w: 820, h: 1100 },
  { id: "desktop", icon: Monitor, label: "Desktop", w: 1200, h: 820 },
] as const;

type DeviceId = (typeof DEVICES)[number]["id"];

// ─── Collapsed icon rail sections ────────────────────────────────────────────
// Must stay in sync with the SECTIONS array inside EditorSections.tsx.
// These are only used for the collapsed sidebar icon rail — they do NOT
// drive any rendering logic, just map a section id → icon + label for the
// tooltip/aria-label.
const RAIL_SECTIONS = [
  { id: "template",     label: "Template",             icon: ImageIcon },
  { id: "identity",     label: "Identity",             icon: User },
  { id: "about",        label: "About & Bio",           icon: FileText },
  { id: "tags",         label: "Niche Tags",            icon: Tag },
  { id: "platforms",    label: "Platforms",             icon: Link2 },
  { id: "audience",     label: "Audience",              icon: Users },
  { id: "gallery",      label: "Content Gallery",       icon: Film },
  { id: "collabs",      label: "Brand Collabs",         icon: Briefcase },
  { id: "testimonials", label: "Testimonials",          icon: Star },
  { id: "rates",        label: "Rates",                 icon: DollarSign },
  { id: "inquiry",      label: "Work Together",         icon: Inbox },
  { id: "page",         label: "Page Settings",         icon: SettingsIcon },
] as const;

// ─── Builder ──────────────────────────────────────────────────────────────────
export default function Builder() {
  const data       = useKitPageStore((s) => s.data);
  const setData    = useKitPageStore((s) => s.setData);
  const setTemplate = useKitPageStore((s) => s.setTemplate);
  const plan       = useEffectivePlan();

  const [device, setDevice]       = useState<DeviceId>("desktop");
  const [open, setOpen]           = useState<string>("template");
  const [publishing, setPublishing] = useState(false);
  const [mobileSheet, setMobileSheet] = useState(false);

  const [zoom, setZoom] = useState<number>(() => {
    if (typeof window === "undefined") return 1;
    const raw = window.localStorage.getItem("kp_builder_zoom");
    const n = raw ? Number(raw) : 1;
    return Number.isFinite(n) && n >= 0.5 && n <= 1.5 ? n : 1;
  });

  const [panelState, setPanelState] = useState<"open" | "collapsed">(() => {
    if (typeof window === "undefined") return "open";
    const raw = window.localStorage.getItem("kp_builder_panel");
    return raw === "collapsed" ? "collapsed" : "open";
  });

  useEffect(() => {
    try { window.localStorage.setItem("kp_builder_zoom", String(zoom)); } catch { /* ignore */ }
  }, [zoom]);

  useEffect(() => {
    try { window.localStorage.setItem("kp_builder_panel", panelState); } catch { /* ignore */ }
  }, [panelState]);

  const current = DEVICES.find((d) => d.id === device)!;

  const handlePublish = () => {
    setPublishing(true);
    window.setTimeout(() => {
      setPublishing(false);
      toast({ title: "Published", description: `Your kit page is live at /${data.slug}` });
    }, 1000);
  };

  // Clicking an icon in the collapsed rail expands the panel and opens that section
  const handleRailClick = (id: string) => {
    setOpen(id);
    if (panelState === "collapsed") setPanelState("open");
  };

  // ─── Shared editor content ─────────────────────────────────────────────────
  // Extracted so the exact same tree renders in both the desktop aside
  // AND the mobile Sheet — no duplication, no divergence.
  const editorContent = (
    <EditorSections
      data={data}
      setData={setData}
      setTemplate={setTemplate}
      plan={plan}
      open={open}
      setOpen={setOpen}
    />
  );

  return (
    <div className="flex h-full flex-col overflow-hidden">

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="flex shrink-0 flex-col gap-1.5 border-b border-border bg-background px-3 py-2 md:h-12 md:flex-row md:items-center md:justify-between md:gap-3 md:px-8 md:py-0">

        {/* Row 1 (mobile) / Left slot (desktop) */}
        <div className="flex items-center justify-between gap-4 md:contents">

          {/* Template info */}
          <div className="flex items-center gap-2 min-w-0 flex-1 md:flex-none md:max-w-[35%]">
            <p
              className="kp-mono truncate text-[11px] text-muted-foreground md:text-xs"
              title={`${data.slug} · ${TEMPLATE_META[data.template].label}`}
            >
              <span className="hidden sm:inline">draft · template </span>
              <span className="text-foreground font-medium">
                {TEMPLATE_META[data.template].label}
              </span>
              <span className="ml-1 hidden text-muted-foreground sm:inline">· auto-saved</span>
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-success sm:hidden" />
            </p>
            <span className="inline-flex items-center gap-1 sm:hidden">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              <span className="text-[10px] text-muted-foreground">auto-saved</span>
            </span>
          </div>

          {/* Mobile-only actions */}
          <div className="flex items-center gap-2 shrink-0 md:hidden">
            <Link
              to={`/${data.slug}`}
              target="_blank"
              aria-label="Preview kit page"
              className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-surface-2 transition-colors"
            >
              <Eye className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Preview</span>
              <ExternalLink className="hidden h-3 w-3 sm:inline" />
            </Link>
            <Button
              size="sm"
              loaderClick
              isLoading={publishing}
              onClick={handlePublish}
              className="rounded-full"
            >
              <Save className="h-3.5 w-3.5" />
              <span className="hidden sm:inline ml-1.5">Publish</span>
            </Button>
          </div>
        </div>

        {/* Row 2 (mobile) / Center slot (desktop) — device switcher */}
        <div className="kp-glass flex items-center gap-1 self-stretch rounded-full p-1 md:self-auto md:flex-shrink-0">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`inline-flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs transition md:flex-none ${
                device === d.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              aria-label={d.label}
            >
              <d.icon className="h-3.5 w-3.5" />
              <span className="hidden min-[360px]:inline">{d.label}</span>
            </button>
          ))}
        </div>

        {/* Desktop-only actions */}
        <div className="hidden md:flex items-center gap-2 shrink-0">
          <Link
            to={`/${data.slug}`}
            target="_blank"
            aria-label="Preview kit page"
            className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-surface-2 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Preview</span>
            <ExternalLink className="hidden h-3 w-3 sm:inline" />
          </Link>
          <Button
            size="sm"
            loaderClick
            isLoading={publishing}
            onClick={handlePublish}
            className="rounded-full"
          >
            <Save className="h-3.5 w-3.5" />
            <span className="hidden sm:inline ml-1.5">Publish</span>
          </Button>
        </div>
      </div>

      {/* ── Main: canvas + right panel ──────────────────────────────────────── */}
      <div
        className={`grid h-full min-h-0 flex-1 grid-cols-1 transition-[grid-template-columns] duration-200 ${
          panelState === "open"
            ? "lg:grid-cols-[1fr_400px]"
            : "lg:grid-cols-[1fr_48px]"
        }`}
      >
        {/* ── Live preview canvas ─────────────────────────────────────────── */}
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
              disabled={zoom <= 0.5}
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
              aria-label="Zoom out"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="kp-mono w-10 text-center text-xs">{Math.round(zoom * 100)}%</span>
            <button
              type="button"
              onClick={() => setZoom((z) => Math.min(1.5, Math.round((z + 0.1) * 10) / 10))}
              disabled={zoom >= 1.5}
              className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-surface-2 hover:text-foreground disabled:opacity-30"
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

          {/* Mobile floating Edit button */}
          <button
            type="button"
            onClick={() => setMobileSheet(true)}
            className="absolute bottom-16 right-4 z-10 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-lg lg:hidden"
            aria-label="Edit"
          >
            <Pencil className="h-4 w-4" /> Edit
          </button>
        </div>

        {/* ── Right editor panel — desktop, collapsible ───────────────────── */}
        <aside className="relative hidden min-h-0 border-l border-border bg-background lg:flex lg:flex-col">

          {/* Collapse toggle */}
          <button
            type="button"
            onClick={() => setPanelState(panelState === "open" ? "collapsed" : "open")}
            aria-label={panelState === "open" ? "Collapse panel" : "Expand panel"}
            className="absolute -left-3 top-4 z-10 grid h-6 w-6 place-items-center rounded-full border border-border bg-background text-muted-foreground shadow-sm transition hover:text-foreground"
          >
            {panelState === "open" ? (
              <ChevronRight className="h-3.5 w-3.5" />
            ) : (
              <ChevronLeft className="h-3.5 w-3.5" />
            )}
          </button>

          {panelState === "open" ? (
            <>
              <div className="shrink-0 border-b border-border p-4">
                <h3 className="kp-display text-lg">Page editor</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Changes save instantly to your draft.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-3">
                {editorContent}
              </div>
            </>
          ) : (
            /* Collapsed icon rail */
            <div className="flex flex-col items-center gap-1 overflow-y-auto py-3">
              {RAIL_SECTIONS.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => handleRailClick(s.id)}
                  aria-label={s.label}
                  title={s.label}
                  className="grid h-8 w-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>

      {/* ── Mobile editor sheet ──────────────────────────────────────────────── */}
      <Sheet open={mobileSheet} onOpenChange={setMobileSheet}>
        <SheetContent side="bottom" className="h-[85vh] overflow-y-auto rounded-t-3xl">
          <SheetHeader className="text-left">
            <SheetTitle>Page editor</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {editorContent}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}