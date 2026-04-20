import { useState } from "react";
import { Smartphone, Tablet, Monitor, Save, Eye } from "lucide-react";

const DEVICES = [
  { id: "mobile", icon: Smartphone, label: "Mobile", w: 380, h: 720 },
  { id: "tablet", icon: Tablet, label: "Tablet", w: 720, h: 900 },
  { id: "desktop", icon: Monitor, label: "Desktop", w: 1180, h: 700 },
] as const;

export default function Builder() {
  const [device, setDevice] = useState<typeof DEVICES[number]["id"]>("desktop");
  const current = DEVICES.find((d) => d.id === device)!;

  return (
    <div className="-m-5 md:-m-8">
      {/* Toolbar */}
      <div className="sticky top-14 z-20 flex items-center justify-between border-b border-border bg-background/80 px-4 py-2 backdrop-blur md:px-8">
        <div className="flex items-center gap-2">
          <div className="kp-mono text-xs text-muted-foreground">draft &middot; saved 2s ago</div>
        </div>
        <div className="kp-glass flex items-center gap-1 rounded-full p-1">
          {DEVICES.map((d) => (
            <button
              key={d.id}
              type="button"
              onClick={() => setDevice(d.id)}
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs transition ${
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

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px]">
        {/* Canvas */}
        <div className="min-h-[80vh] bg-surface-2 p-6 md:p-10">
          <div className="mx-auto" style={{ maxWidth: current.w }}>
            <div className="overflow-hidden rounded-3xl border border-border bg-background shadow-lg" style={{ height: current.h }}>
              <div className="grid h-full place-items-center text-sm text-muted-foreground">
                Live preview &middot; {current.label}
              </div>
            </div>
          </div>
        </div>
        {/* Property panel */}
        <aside className="border-l border-border bg-background p-6">
          <h3 className="kp-display text-xl">Hero block</h3>
          <p className="mt-1 text-xs text-muted-foreground">Edit identity, headline, and avatar.</p>
          <div className="mt-6 space-y-4">
            <Field label="Display name" />
            <Field label="Headline" />
            <Field label="Niche tags" />
            <Field label="Contact email" type="email" />
          </div>
        </aside>
      </div>
    </div>
  );
}

function Field({ label, type = "text" }: { label: string; type?: string }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      <input type={type} className="mt-1.5 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20" />
    </div>
  );
}
