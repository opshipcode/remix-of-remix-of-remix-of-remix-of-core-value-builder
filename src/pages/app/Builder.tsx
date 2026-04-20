import { useState } from "react";
import { Smartphone, Tablet, Monitor, Save, Eye, ChevronDown, User, Image as ImageIcon, Tag, Link2, FileText, Film, Briefcase, Star, DollarSign, Settings as SettingsIcon, Inbox } from "lucide-react";
import { Link } from "react-router-dom";

const DEVICES = [
  { id: "mobile", icon: Smartphone, label: "Mobile", w: 380, h: 720 },
  { id: "tablet", icon: Tablet, label: "Tablet", w: 720, h: 900 },
  { id: "desktop", icon: Monitor, label: "Desktop", w: 1180, h: 760 },
] as const;

const SECTIONS = [
  { id: "identity", label: "Identity", icon: User },
  { id: "media", label: "Profile media", icon: ImageIcon },
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
  const [device, setDevice] = useState<typeof DEVICES[number]["id"]>("desktop");
  const [open, setOpen] = useState<string>("identity");
  const current = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
        <div className="kp-mono text-xs text-muted-foreground">draft · saved 2s ago</div>
        <div className="kp-glass flex items-center gap-1 rounded-full p-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs transition ${
                device === d.id ? "bg-foreground text-background" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <d.icon className="h-3.5 w-3.5" /> {d.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs hover:bg-surface-2">
            <Eye className="h-3.5 w-3.5" /> Preview
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground hover:bg-primary-hover">
            <Save className="h-3.5 w-3.5" /> Publish
          </button>
        </div>
      </div>

      {/* Main: canvas + right panel */}
      <div className="grid h-full min-h-0 flex-1 grid-cols-1 lg:grid-cols-[1fr_400px]">
        {/* Canvas */}
        <div className="min-h-0 overflow-auto bg-surface-2 p-4 md:p-8">
          <div className="mx-auto" style={{ maxWidth: current.w }}>
            <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-lg" style={{ height: current.h }}>
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Live preview · {current.label}
              </div>
            </div>
          </div>
        </div>

        {/* Right panel — fully scrollable */}
        <aside className="flex min-h-0 flex-col border-l border-border bg-background">
          <div className="shrink-0 border-b border-border p-4">
            <h3 className="kp-display text-lg">Page editor</h3>
            <p className="mt-0.5 text-xs text-muted-foreground">Every section of your /:slug page.</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3">
            {SECTIONS.map((s) => (
              <Section key={s.id} id={s.id} icon={s.icon} label={s.label} open={open === s.id} onToggle={() => setOpen(open === s.id ? "" : s.id)}>
                {renderBody(s.id)}
              </Section>
            ))}
            <div className="px-2 py-4 text-center">
              <Link to="/app/settings/page" className="text-xs text-primary hover:underline">Open full Page settings →</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Section({ id, icon: Icon, label, open, onToggle, children }: { id: string; icon: typeof User; label: string; open: boolean; onToggle: () => void; children: React.ReactNode }) {
  return (
    <div className="mb-2 overflow-hidden rounded-xl border border-border bg-card">
      <button onClick={onToggle} className="flex w-full items-center justify-between px-3 py-2.5 text-left text-sm font-medium hover:bg-surface-2">
        <span className="flex items-center gap-2.5"><Icon className="h-4 w-4 text-muted-foreground" />{label}</span>
        <ChevronDown className={`h-4 w-4 text-muted-foreground transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="space-y-3 border-t border-border p-3">{children}</div>}
    </div>
  );
}

function renderBody(id: string) {
  switch (id) {
    case "identity":
      return <>
        <Field label="Display name" defaultValue="Alex Rivera" />
        <Field label="Tagline" defaultValue="Lifestyle and tech creator…" />
      </>;
    case "media":
      return <>
        <Upload label="Profile photo" hint="Square, ≥512px" />
        <Upload label="Banner image" hint="2400×800 wide" />
        <Upload label="Banner video (loop)" hint="MP4, ≤8s, ≤6MB" />
      </>;
    case "tags":
      return <Field label="Niche tags" defaultValue="Tech, Lifestyle, Wellness" hint="Comma-separated" />;
    case "platforms":
      return <>
        {["TikTok", "Instagram", "YouTube"].map((p) => (
          <div key={p} className="rounded-lg border border-border bg-surface p-3">
            <p className="text-xs font-medium">{p}</p>
            <div className="mt-2 grid gap-2">
              <Field label="Handle" placeholder="@yourhandle" small />
              <Field label="Followers" placeholder="120000" small />
            </div>
          </div>
        ))}
      </>;
    case "about":
      return <>
        <Field label="Bio" textarea defaultValue="I make calm, polished short-form content…" />
        <Field label="Location" placeholder="Brooklyn, NY" />
        <Field label="Languages" placeholder="English, Spanish" />
        <Field label="Creating since" placeholder="2019" />
        <Field label="Collaboration style" textarea placeholder="Authentic storytelling for DTC brands" />
      </>;
    case "gallery":
      return <>
        <p className="text-xs text-muted-foreground">3 cards added</p>
        <button className="w-full rounded-lg border border-dashed border-border bg-surface p-3 text-xs hover:bg-surface-2">+ Add video card</button>
      </>;
    case "collabs":
      return <>
        <p className="text-xs text-muted-foreground">4 brands added</p>
        <Upload label="Add brand logo" hint="SVG or PNG" />
        <Field label="Brand name" />
        <Field label="Deliverables" textarea />
        <Field label="Results" placeholder="+38% landing CTR" />
      </>;
    case "testimonials":
      return <>
        <p className="text-xs text-muted-foreground">3 approved · 2 pending</p>
        <Link to="/app/testimonials" className="block rounded-lg bg-primary px-3 py-2 text-center text-xs font-medium text-primary-foreground hover:bg-primary-hover">
          Manage testimonials
        </Link>
      </>;
    case "rates":
      return <>
        <Toggle label="Public rates" defaultOn />
        <Field label="Turnaround time" placeholder="7 business days" />
        <Field label="Licensing notes" textarea placeholder="30-day usage included…" />
        <Link to="/app/rates" className="block text-center text-xs text-primary hover:underline">Edit rate card →</Link>
      </>;
    case "inquiry":
      return <>
        <Toggle label="Show inquiry form" defaultOn />
        <Toggle label="Custom intro message" />
        <Field label="Intro message" textarea placeholder="I reply within 48 hours." />
        <Toggle label="Require budget range" defaultOn />
      </>;
    case "page":
      return <>
        <Field label="Slug" defaultValue="alexrivera" mono />
        <Toggle label="Page is active" defaultOn />
        <Toggle label="Password protect" />
        <Link to="/app/settings/page" className="block text-center text-xs text-primary hover:underline">Open page settings →</Link>
      </>;
    default: return null;
  }
}

function Field({ label, defaultValue, placeholder, textarea, small, mono, hint }: { label: string; defaultValue?: string; placeholder?: string; textarea?: boolean; small?: boolean; mono?: boolean; hint?: string }) {
  const cls = `mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${mono ? "kp-mono" : ""} ${small ? "py-1.5 text-xs" : ""}`;
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={3} defaultValue={defaultValue} placeholder={placeholder} className={cls} />
      ) : (
        <input defaultValue={defaultValue} placeholder={placeholder} className={cls} />
      )}
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Upload({ label, hint }: { label: string; hint?: string }) {
  return (
    <div>
      <label className="text-[10px] font-medium uppercase tracking-[0.12em] text-muted-foreground">{label}</label>
      <button className="mt-1 flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-border bg-surface px-3 py-3 text-xs text-muted-foreground hover:bg-surface-2">
        <ImageIcon className="h-3.5 w-3.5" /> Upload
      </button>
      {hint && <p className="mt-1 text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Toggle({ label, defaultOn }: { label: string; defaultOn?: boolean }) {
  const [on, setOn] = useState(defaultOn ?? false);
  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-surface px-3 py-2">
      <span className="text-xs">{label}</span>
      <button onClick={() => setOn(!on)} className={`relative h-5 w-9 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-surface-offset"}`}>
        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-background transition ${on ? "left-[18px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}
