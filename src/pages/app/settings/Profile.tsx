import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth";
import { SettingsSaveBar } from "@/components/kit/SettingsSaveBar";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";
import { usePageLoader } from "@/hooks/usePageLoader";
import {
  ProfilePhotoUploader,
  ProfilePhotoCircle,
} from "@/components/kit/ProfilePhotoUploader";

export default function Profile() {
  const { loading } = usePageLoader(700);
  const user = useAuthStore((s) => s.user);
  const [form, setForm] = useState({
    displayName: user?.displayName ?? "",
    slug: user?.slug ?? "",
    email: user?.email ?? "",
    location: "",
    languages: "",
    creatingSince: "",
    tagline: "",
    bio: "",
    collabStyle: "",
  });
  const [initial, setInitial] = useState(form);
  const [saving, setSaving] = useState(false);
  const dirty = JSON.stringify(form) !== JSON.stringify(initial);

  useEffect(() => {
    const next = {
      displayName: user?.displayName ?? "",
      slug: user?.slug ?? "",
      email: user?.email ?? "",
      location: "",
      languages: "",
      creatingSince: "",
      tagline: "",
      bio: "",
      collabStyle: "",
    };
    setForm(next);
    setInitial(next);
  }, [user]);

  const update = <K extends keyof typeof form>(k: K, v: string) =>
    setForm((s) => ({ ...s, [k]: v }));

  const handleSave = () => {
    setSaving(true);
    window.setTimeout(() => {
      setInitial(form);
      setSaving(false);
      toast({ title: "Profile saved" });
    }, 1000);
  };

  if (loading) return <ProfileSkeleton />;

  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="kp-card p-6">
          <p className="text-sm font-semibold">Profile photo</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Square, at least 512px. Shown circular on your kit page.
          </p>
          <div className="mt-5 flex flex-col items-center gap-4">
            <ProfilePhotoCircle size={144} className="ring-2 ring-border" />
            <ProfilePhotoUploader className="w-full" />
            <p className="text-[11px] text-muted-foreground">
              PNG, JPG, or WebP · max 5MB
            </p>
          </div>
        </div>

        <div className="kp-card p-6">
          <h2 className="text-lg font-semibold">Identity</h2>
          <div className="mt-5 grid gap-4 md:grid-cols-2">
            <Field label="Display name" value={form.displayName} onChange={(v) => update("displayName", v)} />
            <Field label="Username (slug)" value={form.slug} onChange={(v) => update("slug", v)} mono />
            <Field label="Public contact email" value={form.email} onChange={(v) => update("email", v)} type="email" />
            <Field label="Location" value={form.location} onChange={(v) => update("location", v)} placeholder="Brooklyn, NY" />
            <Field label="Languages" value={form.languages} onChange={(v) => update("languages", v)} placeholder="English, Spanish" />
            <Field label="Creating since" value={form.creatingSince} onChange={(v) => update("creatingSince", v)} placeholder="2019" />
          </div>
          <div className="mt-4">
            <Field label="Tagline" value={form.tagline} onChange={(v) => update("tagline", v)} placeholder="Lifestyle and tech creator helping brands ship better launch content" />
          </div>
          <div className="mt-4">
            <Field label="Bio" value={form.bio} onChange={(v) => update("bio", v)} textarea rows={5} />
          </div>
          <div className="mt-4">
            <Field label="Brand collaboration style" value={form.collabStyle} onChange={(v) => update("collabStyle", v)} placeholder="Authentic storytelling for DTC brands" />
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

function ProfileSkeleton() {
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="kp-card p-6 space-y-3">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="aspect-square w-full" />
        <Skeleton className="h-9 w-full" />
      </div>
      <div className="kp-card p-6 space-y-4">
        <Skeleton className="h-5 w-40" />
        <div className="grid gap-3 md:grid-cols-2">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-10" />)}
        </div>
        <Skeleton className="h-10" />
        <Skeleton className="h-24" />
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  textarea,
  rows = 3,
  mono,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  textarea?: boolean;
  rows?: number;
  mono?: boolean;
}) {
  const cls = `mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${mono ? "kp-mono" : ""}`;
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={rows} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={cls} />
      )}
    </div>
  );
}
