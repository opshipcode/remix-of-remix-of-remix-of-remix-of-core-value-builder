import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { Globe2, Lock, Eye } from "lucide-react";

export default function Page() {
  const slug = useAuthStore((s) => s.user?.slug ?? "yourname");
  const [active, setActive] = useState(true);
  const [pw, setPw] = useState(false);

  return (
    <div className="space-y-6">
      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Slug & SEO</h2>
        <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <Field label="Page slug" defaultValue={slug} mono prefix="kitpager.pro/" />
            <Field label="SEO title" defaultValue="Alex Rivera — Lifestyle & Tech Creator" />
            <Field label="SEO description" defaultValue="Lifestyle and tech creator helping premium brands ship better launch content." textarea />
            <Field label="Open Graph image" placeholder="Upload 1200×630" />
          </div>
          <div className="kp-card overflow-hidden bg-surface-2">
            <div className="p-4">
              <p className="text-xs text-muted-foreground">Search preview</p>
              <p className="mt-2 text-base text-primary truncate">Alex Rivera — Lifestyle & Tech Creator</p>
              <p className="kp-mono text-xs text-success">kitpager.pro/{slug}</p>
              <p className="mt-1 text-sm text-foreground/80">Lifestyle and tech creator helping premium brands ship better launch content.</p>
            </div>
            <div className="border-t border-border p-4">
              <p className="text-xs text-muted-foreground">Social preview</p>
              <div className="mt-2 aspect-[1200/630] rounded-xl border border-border bg-surface" />
            </div>
          </div>
        </div>
      </div>

      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Visibility</h2>
        <div className="mt-4 space-y-3">
          <Toggle
            icon={Eye}
            title="Page is active"
            desc="Anyone can visit your page. Disable to show an inactive screen."
            on={active}
            onChange={setActive}
          />
          <Toggle
            icon={Lock}
            title="Password protect"
            desc="Visitors enter a passphrase to view your page."
            on={pw}
            onChange={setPw}
          />
          {pw && (
            <div className="ml-12">
              <Field label="Passphrase" placeholder="Enter passphrase" />
            </div>
          )}
          <Toggle
            icon={Globe2}
            title="Country restrictions"
            desc="Restrict your page to selected countries (multi-select)."
            on={false}
          />
        </div>
      </div>
    </div>
  );
}

function Toggle({ icon: Icon, title, desc, on, onChange }: { icon: typeof Eye; title: string; desc: string; on: boolean; onChange?: (v: boolean) => void }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-surface-2"><Icon className="h-4 w-4" /></span>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      <button
        onClick={() => onChange?.(!on)}
        className={`relative h-6 w-11 shrink-0 rounded-full transition ${on ? "bg-primary" : "bg-surface-offset"}`}
      >
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-background transition ${on ? "left-[22px]" : "left-0.5"}`} />
      </button>
    </div>
  );
}

function Field({ label, defaultValue, placeholder, mono, prefix, textarea }: { label: string; defaultValue?: string; placeholder?: string; mono?: boolean; prefix?: string; textarea?: boolean }) {
  const cls = `w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${mono ? "kp-mono" : ""}`;
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={3} defaultValue={defaultValue} placeholder={placeholder} className={`mt-1.5 ${cls}`} />
      ) : prefix ? (
        <div className="mt-1.5 flex overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <span className="kp-mono border-r border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground">{prefix}</span>
          <input defaultValue={defaultValue} placeholder={placeholder} className={`flex-1 bg-transparent px-3 py-2.5 text-sm outline-none ${mono ? "kp-mono" : ""}`} />
        </div>
      ) : (
        <input defaultValue={defaultValue} placeholder={placeholder} className={`mt-1.5 ${cls}`} />
      )}
    </div>
  );
}
