import React, { useCallback, useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Eye, EyeOff, Lock, Upload, Loader2, ImageIcon, Check, LockIcon,
  User, FileText, Tag, Link2, Film, Briefcase, Star, DollarSign,
  Settings, Inbox, Users, Palette
} from "lucide-react";
import { uploadToCloudinary } from "@/lib/cloudinaryHelper";
import type { KitPageData } from "@/store/kitPage";
import type { TemplateId } from "@/components/templates/types";
import type { SectionKey } from "@/components/templates/MinimalTemplate";
import { useEffectivePlan } from "@/store/plan";
import { toast } from "@/hooks/use-toast"; // Add this
import { TEMPLATE_META } from "@/components/templates/TemplateRenderer"; // Add this
import { planMeets } from "@/store/plan"; // Add this
import { AudiencePanel } from "../audience/AudiencePanel";
import { GalleryEditor } from "./GalleryEditor";
import { CollabsEditor } from "./CollabsEditor";
import { ThemePicker } from "./ThemePicker";

// ─── Types ───────────────────────────────────────────────────────────────────
interface EditorSectionsProps {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
  setTemplate: (t: TemplateId) => void;
  plan: ReturnType<typeof useEffectivePlan>;
  open: string;
  setOpen: (v: string) => void;
}

// ─── Plan Gating ─────────────────────────────────────────────────────────────
//
// FREE sections  → identity, about, tags, platforms, audience,
//                  gallery (recent work), testimonials, inquiry (work together)
//
// PAID sections  → rates, collabs (brand collaborations), page (page settings)
//
// The template still renders paid sections if the creator had data before
// downgrading — gating only blocks editing in the editor UI.

const PAID_ONLY_SECTIONS: string[] = ["rates", "collabs", "page", "testimonials", "inquiry", "theme", "template"];

function isPaidSection(
  sectionId: string,
  plan: ReturnType<typeof useEffectivePlan>
): boolean {
  const isPaid = true; // adjust property name to match your plan shape
  if (isPaid) return false; // paid users are never gated
  return PAID_ONLY_SECTIONS.includes(sectionId);
}

// ─── Lock Overlay ─────────────────────────────────────────────────────────────
const PAID_SECTION_LABELS: Record<string, string> = {
  rates: "Rate cards are a paid feature",
  collabs: "Brand collaborations are a paid feature",
  page: "Custom page settings are a paid feature",
  testimonials: "Testimonials are a paid feature",
  inquiry: "Inquiry form is a paid feature",
};

function PlanLockOverlay({ sectionId }: { sectionId: string }) {
  const label = PAID_SECTION_LABELS[sectionId] ?? "This feature requires a paid plan";
  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-xl border border-border bg-background/90 backdrop-blur-sm gap-2 text-center p-5">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-2 border border-border">
        <Lock className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-xs font-semibold leading-snug max-w-[160px]">{label}</p>
      <p className="text-[10px] text-muted-foreground max-w-[180px] leading-relaxed">
        Upgrade to add this section to your public kit page.
      </p>
      <Link
        to="/app/settings/billing"
        className="mt-1 rounded-full bg-primary px-4 py-1.5 text-[11px] font-semibold text-primary-foreground hover:bg-primary-hover transition-colors"
      >
        Upgrade plan →
      </Link>
    </div>
  );
}

// ─── Visibility Toggle ────────────────────────────────────────────────────────
function VisibilityToggle({
  sectionKey,
  data,
  setData,
}: {
  sectionKey: SectionKey;
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
}) {
  const isVisible = data.sectionVisibility?.[sectionKey] !== false;

  const toggle = () => {
    setData({
      sectionVisibility: {
        ...data.sectionVisibility,
        [sectionKey]: !isVisible,
      },
    });
  };

  return (
    <button
      onClick={toggle}
      className={`flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-medium transition-colors ${
        isVisible
          ? "border-green-500/30 bg-green-500/10 text-green-600 hover:bg-green-500/20"
          : "border-border bg-surface-2 text-muted-foreground hover:bg-surface"
      }`}
      title={isVisible ? "Visible on page · click to hide" : "Hidden · click to show"}
    >
      {isVisible ? (
        <>
          <Eye className="h-3 w-3" /> Visible
        </>
      ) : (
        <>
          <EyeOff className="h-3 w-3" /> Hidden
        </>
      )}
    </button>
  );
}

// ─── Section Wrapper ──────────────────────────────────────────────────────────
interface SectionProps {
  icon: React.ReactNode;
  label: string;
  open: boolean;
  onToggle: () => void;
  children: React.ReactNode;
  isGated?: boolean;
}

function Section({ icon, label, open, onToggle, children, isGated }: SectionProps) {
  // Strip the " ✦ Pro" suffix from the label for display — we render the badge separately
  const displayLabel = label;

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <button
        className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-surface-2 transition-colors"
        onClick={onToggle}
      >
        <span className="text-muted-foreground">{icon}</span>
        <span className="flex-1 text-sm ml-auto mr-0 font-medium">{displayLabel}</span>
        {isGated && (
          <span className="mr-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400">
            Pro
          </span>
        )}
        <span
          className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`}
        >
          ▾
        </span>
      </button>
      {open && (
        <div className="border-t border-border bg-surface px-4 pb-5 pt-4">
          {children}
        </div>
      )}
    </div>
  );
}

// ─── Avatar Upload ────────────────────────────────────────────────────────────
function AvatarUpload({
  data,
  setData,
}: {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith("image/")) {
        setError("Please select an image file.");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setError("Image must be under 5 MB.");
        return;
      }

      // Show local preview immediately
      const preview = URL.createObjectURL(file);
      setLocalPreview(preview);
      setError(null);
      setUploading(true);

      try {
        const { url } = await uploadToCloudinary(file, "kitpager/avatars");
        setData({ profileImage: url });
        URL.revokeObjectURL(preview);
        setLocalPreview(null);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : "Upload failed";
        setError(msg);
        setLocalPreview(null);
      } finally {
        setUploading(false);
      }
    },
    [setData]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const currentImage = localPreview || data.profileImage;

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Profile Image <span className="text-[10px] font-normal opacity-50">(used as page favicon)</span>
      </p>

      {/* Drop zone */}
      <div
        className="relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-border bg-surface-2 p-6 transition-colors hover:border-primary/40 cursor-pointer"
        onClick={() => !uploading && inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {currentImage ? (
          <img
            src={currentImage}
            alt="Profile"
            className={`h-20 w-20 rounded-full object-cover border border-border transition-opacity ${uploading ? "opacity-50" : ""}`}
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-surface border border-border text-muted-foreground">
            <ImageIcon className="h-8 w-8 opacity-40" />
          </div>
        )}

        {uploading ? (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Loader2 className="h-3 w-3 animate-spin" /> Uploading…
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Upload className="h-3 w-3" />
            {currentImage ? "Click or drag to replace" : "Click or drag to upload"}
          </div>
        )}
      </div>

      {error && <p className="text-xs text-red-500">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={onInputChange}
      />
    </div>
  );
}

// ─── Identity Section ─────────────────────────────────────────────────────────
function IdentitySection({
  data,
  setData,
}: {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
}) {
  return (
    <div className="space-y-5">
      <AvatarUpload data={data} setData={setData} />
      <TextField
        label="Display name"
        value={data.displayName}
        onChange={(v) => setData({ displayName: v })}
        placeholder="Your name or brand"
      />
      <TextField
        label="Tagline"
        value={data.tagline}
        onChange={(v) => setData({ tagline: v })}
        placeholder="A short, punchy headline"
      />
      <TextField
        label="Contact email"
        value={data.contactEmail}
        onChange={(v) => setData({ contactEmail: v })}
        placeholder="you@email.com"
        type="email"
      />
    </div>
  );
}

function AboutSection({
  data,
  setData,
}: {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
}) {
  const [languagesInput, setLanguagesInput] = useState(
    () => data.languages?.join(", ") ?? ""
  );

  const handleLanguagesChange = (raw: string) => {
    setLanguagesInput(raw);
    const arr = raw
      .split(",")
      .map((l) => l.trim())
      .filter(Boolean);
    setData({ languages: arr.length > 0 ? arr : [] });
  };

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Bio
        </label>
        <textarea
          rows={5}
          value={data.bio}
          onChange={(e) => setData({ bio: e.target.value })}
          placeholder="Tell brands about yourself…"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none resize-none"
        />
        <p className="text-[10px] text-muted-foreground">
          This appears in the hero section, above review stars.
        </p>
      </div>
      <TextField
        label="Location"
        value={data.location ?? ""}
        onChange={(v) => setData({ location: v })}
        placeholder="Lagos, Nigeria"
      />
      {/* Languages — local state, no useEffect sync */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Languages
        </label>
        <input
          type="text"
          value={languagesInput}
          onChange={(e) => handleLanguagesChange(e.target.value)}
          placeholder="English, Yoruba"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none"
        />
        <p className="text-[10px] text-muted-foreground">
          Separate multiple languages with commas.
        </p>
      </div>
      <TextField
        label="Creating since"
        value={data.creatingSince ? String(data.creatingSince) : ""}
        onChange={(v) => setData({ creatingSince: v ? parseInt(v) : undefined })}
        placeholder="2019"
        type="number"
      />
    </div>
  );
}

// ─── Tags Section ─────────────────────────────────────────────────────────────
function TagsSection({
  data,
  setData,
}: {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
}) {
  const [input, setInput] = useState("");

  const addTag = () => {
    const tag = input.trim();
    if (!tag || data.nicheTags.includes(tag)) return;
    setData({ nicheTags: [...data.nicheTags, tag] });
    setInput("");
  };

  const removeTag = (tag: string) =>
    setData({ nicheTags: data.nicheTags.filter((t) => t !== tag) });

  return (
    <div className="space-y-3">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        Niche Tags
      </p>
      <div className="flex flex-wrap gap-1.5">
        {data.nicheTags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 px-2.5 py-0.5 text-[11px]"
          >
            {tag}
            <button
              onClick={() => removeTag(tag)}
              className="opacity-50 hover:opacity-100 transition-opacity"
            >
              ×
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          placeholder="Add a tag…"
          className="flex-1 rounded-xl border border-border bg-surface px-3 py-2 text-sm focus:outline-none"
        />
        <button
          onClick={addTag}
          className="rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary-hover"
        >
          Add
        </button>
      </div>
    </div>
  );
}

// ─── Inquiry Section ──────────────────────────────────────────────────────────
function InquirySection({
  data,
  setData,
}: {
  data: KitPageData;
  setData: (patch: Partial<KitPageData>) => void;
}) {
  return (
    <div className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          Intro message
        </label>
        <textarea
          rows={3}
          value={data.inquirySettings?.introMessage ?? ""}
          onChange={(e) =>
            setData({
              inquirySettings: { ...data.inquirySettings, introMessage: e.target.value },
            })
          }
          placeholder="Tell brands what you're looking for…"
          className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}

// ─── Section Definitions ──────────────────────────────────────────────────────
// icon is a React element — swap with your actual lucide icons or icon system
const SECTIONS: {
  id: string;
  label: string;
  icon: React.ReactNode;
  sectionKey?: SectionKey;
}[] = [
  { id: "identity", label: "Identity", icon: <User className="h-4 w-4" /> },
  { id: "about", label: "About & Bio", icon: <FileText className="h-4 w-4" /> },
  { id: "audience", label: "Audience", icon: <Users className="h-4 w-4" />, sectionKey: "audience" },
  { id: "tags", label: "Niche Tags", icon: <Tag className="h-4 w-4" /> },
  { id: "platforms", label: "Platforms", icon: <Link2 className="h-4 w-4" />, sectionKey: "platforms" },
  { id: "gallery", label: "Content Gallery", icon: <Film className="h-4 w-4" />, sectionKey: "gallery" },
  { id: "collabs", label: "Brand Collabs ✦ Pro", icon: <Briefcase className="h-4 w-4" />, sectionKey: "collabs" },
  { id: "testimonials", label: "Testimonials ✦ Pro", icon: <Star className="h-4 w-4" />, sectionKey: "testimonials" },
  { id: "rates", label: "Rates ✦ Pro", icon: <DollarSign className="h-4 w-4" />, sectionKey: "rates" },
  { id: "inquiry", label: "Work Together ✦ Pro", icon: <Inbox className="h-4 w-4" />, sectionKey: "inquiry" },
  { id: "template", label: "Template ✦ Pro", icon: <Palette className="h-4 w-4" /> },
  { id: "theme", label: "Theme ✦ Pro", icon: <Palette className="h-4 w-4" /> },
  { id: "page", label: "Page Settings ✦ Pro", icon: <Settings className="h-4 w-4" /> },
];

// ─── EditorSections (main export) ────────────────────────────────────────────
export function EditorSections({
  data,
  setData,
  setTemplate,
  plan,
  open,
  setOpen,
}: EditorSectionsProps) {
  return (
    <div className="space-y-2">
      {SECTIONS.map((s) => {
        const isGated = isPaidSection(s.id, plan);

        return (
          <Section
            key={s.id}
            icon={s.icon}
            label={s.label}
            open={open === s.id}
            onToggle={() => setOpen(open === s.id ? "" : s.id)}
            isGated={isGated}
          >
            {/* Gated sections: overlay sits over a blurred preview so there's
                always enough height for the lock UI to render properly */}
            <div className={`relative ${isGated ? "min-h-[160px]" : ""}`}>
              {isGated && <PlanLockOverlay sectionId={s.id} />}

              {/* Blur the content behind the overlay for paid sections */}
              <div className={isGated ? "pointer-events-none select-none blur-[2px] opacity-40" : ""}>

              {/* Visibility toggle for sections that appear on the public page */}
              {s.sectionKey && !isGated && (
                <div className="flex items-center justify-between mb-4">
                  <p className="text-[11px] text-muted-foreground">
                    Show on public page
                  </p>
                  <VisibilityToggle
                    sectionKey={s.sectionKey}
                    data={data}
                    setData={setData}
                  />
                </div>
              )}
              {s.id === "identity" && (
                <IdentitySection data={data} setData={setData} />
              )}
              {s.id === "about" && (
                <AboutSection data={data} setData={setData} />
              )}

              {s.id === "audience" && <AudiencePanel />}
              {s.id === "theme" && (
                <ThemePicker
                    current={data.theme || "platform"}
                    onSelect={(themeId) => setData({ theme: themeId })}
                    plan={plan}
                />
                )}
              {/* Section content */}
              {s.id === "template" && (
                <TemplatePicker current={data.template} plan={plan} onSelect={setTemplate} />
              )}
              {s.id === "tags" && (
                <TagsSection data={data} setData={setData} />
              )}
              {s.id === "platforms" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    Manage platforms and followers in{" "}
                    <Link to="/app/platforms" className="text-primary hover:underline">
                      Platforms →
                    </Link>
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Each platform shows an "updated X ago" timestamp based on when
                    you last edited it.
                  </p>
                </div>
              )}
              {s.id === "gallery" && (
                <GalleryEditor
                    items={data.contentGallery}
                    maxItems={6}
                    onChange={(items) => setData({ contentGallery: items })}
                />
                )}
              {s.id === "collabs" && (
                <CollabsEditor
                    items={data.brandCollabs}
                    onChange={(items) => setData({ brandCollabs: items })}
                />
                )}
              {s.id === "testimonials" && (
                <div className="space-y-3">
                  <p className="text-xs text-muted-foreground">
                    {
                      data.testimonials.filter(
                        (t) => t.visible && t.status === "approved"
                      ).length
                    }{" "}
                    approved · Up to 10 most recent shown.
                  </p>
                  <Link
                    to="/app/testimonials"
                    className="block rounded-lg bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary-hover"
                  >
                    Manage testimonials →
                  </Link>
                  <div className="rounded-xl border border-border bg-surface-2 p-3">
                    <p className="text-[11px] font-semibold text-muted-foreground mb-1">
                      Leave-a-review button
                    </p>
                    <p className="text-[10px] text-muted-foreground">
                      A "Leave a review" button is shown at the bottom of the
                      testimonials section. It opens an email to your contact
                      address. No extra setup needed.
                    </p>
                  </div>
                </div>
              )}
              {s.id === "rates" && (
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground">
                    {data.rates.rows.length} rate items · All items are shown.
                    Currency: <b>NGN (₦)</b>.
                  </p>
                  <Link
                    to="/app/rates"
                    className="block rounded-lg border border-border px-3 py-2 text-center text-xs hover:bg-surface-2"
                  >
                    Edit rate card →
                  </Link>
                </div>
              )}
              {s.id === "inquiry" && (
                <InquirySection data={data} setData={setData} />
              )}
              {s.id === "page" && (
                <Link
                  to="/app/settings/page"
                  className="block text-center text-xs text-primary hover:underline"
                >
                  Open page settings →
                </Link>
              )}

              </div> {/* end blur wrapper */}
            </div> {/* end relative */}
          </Section>
        );
      })}
    </div>
  );
}

// ─── Shared field helpers ─────────────────────────────────────────────────────
function TextField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-border bg-surface px-3 py-2.5 text-sm focus:outline-none"
      />
    </div>
  );
}

// ─── Placeholder sub-components (import your real ones) ───────────────────────
// Replace these with your actual TemplatePicker and AudiencePanel imports.

// REPLACE the placeholder TemplatePicker with this:
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
