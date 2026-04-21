import { useState } from "react";
import { useKitPageStore } from "@/store/kitPage";
import { Globe2, Lock, Eye } from "lucide-react";
import { SettingsSaveBar } from "@/components/kit/SettingsSaveBar";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { toast } from "@/hooks/use-toast";

export default function Page() {
  const { loading } = usePageLoader(700);
  const data = useKitPageStore((s) => s.data);
  const setData = useKitPageStore((s) => s.setData);

  const [form, setForm] = useState({
    slug: data.slug,
    seoTitle: data.seo.title,
    seoDescription: data.seo.description,
    isActive: data.isActive,
    passwordProtect: data.passwordProtect,
    passphrase: data.passphrase,
  });
  const [initial, setInitial] = useState(form);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  if (loading) return <PageSkeleton />;

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setData({
        slug: form.slug,
        seo: { ...data.seo, title: form.seoTitle, description: form.seoDescription },
        isActive: form.isActive,
        passwordProtect: form.passwordProtect,
        passphrase: form.passphrase,
      });
      setInitial(form);
      setSaving(false);
      toast({ title: "Page settings saved" });
    }, 1000);
  };

  return (
    <>
      <div className="space-y-6">
        <div className="kp-card p-6">
          <h2 className="text-lg font-semibold">Slug & SEO</h2>
          <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_1fr]">
            <div className="space-y-4">
              <Field
                label="Page slug"
                value={form.slug}
                onChange={(v) => setForm({ ...form, slug: v })}
                mono
                prefix="kitpager.pro/"
              />
              <Field
                label="SEO title"
                value={form.seoTitle}
                onChange={(v) => setForm({ ...form, seoTitle: v })}
              />
              <Field
                label="SEO description"
                value={form.seoDescription}
                onChange={(v) => setForm({ ...form, seoDescription: v })}
                textarea
              />
            </div>
            <div className="kp-card overflow-hidden bg-surface-2">
              <div className="p-4">
                <p className="text-xs text-muted-foreground">Search preview</p>
                <p className="mt-2 text-base text-primary truncate">{form.seoTitle}</p>
                <p className="kp-mono text-xs text-success">kitpager.pro/{form.slug}</p>
                <p className="mt-1 text-sm text-foreground/80">{form.seoDescription}</p>
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
              on={form.isActive}
              onChange={(v) => setForm({ ...form, isActive: v })}
            />
            <Toggle
              icon={Lock}
              title="Password protect"
              desc="Visitors enter a passphrase to view your page."
              on={form.passwordProtect}
              onChange={(v) => setForm({ ...form, passwordProtect: v })}
            />
            {form.passwordProtect && (
              <div className="ml-12">
                <Field
                  label="Passphrase"
                  value={form.passphrase}
                  onChange={(v) => setForm({ ...form, passphrase: v })}
                  placeholder="Enter passphrase"
                />
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
      <SettingsSaveBar
        dirty={dirty}
        saving={saving}
        onSave={handleSave}
        onDiscard={() => setForm(initial)}
      />
    </>
  );
}

function PageSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-72" />
      <Skeleton className="h-64" />
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  mono,
  prefix,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  mono?: boolean;
  prefix?: string;
  textarea?: boolean;
}) {
  const cls = `w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${mono ? "kp-mono" : ""}`;
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`mt-1.5 ${cls}`} />
      ) : prefix ? (
        <div className="mt-1.5 flex overflow-hidden rounded-xl border border-border bg-background focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
          <span className="kp-mono border-r border-border bg-surface px-3 py-2.5 text-sm text-muted-foreground">{prefix}</span>
          <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`flex-1 bg-transparent px-3 py-2.5 text-sm outline-none ${mono ? "kp-mono" : ""}`} />
        </div>
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={`mt-1.5 ${cls}`} />
      )}
    </div>
  );
}
