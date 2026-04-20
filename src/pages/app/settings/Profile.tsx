import { ImagePlaceholder } from "@/components/kit/ImagePlaceholder";
import { useAuthStore } from "@/store/auth";

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
      <div className="kp-card p-6">
        <p className="text-sm font-semibold">Profile photo</p>
        <p className="mt-1 text-xs text-muted-foreground">Square, at least 512px. Shown circular on your kit page.</p>
        <div className="mt-4">
          <ImagePlaceholder
            aspect="square"
            title="Creator avatar"
            dimensions="512x512"
            orientation="square"
            description="Square portrait of the creator, well-lit, soft background. Will be cropped circular."
            background="any"
            facesAllowed
            usage="Profile photo (settings + public hero)"
            format="png/jpg"
          />
        </div>
        <button className="mt-4 w-full rounded-xl border border-border bg-surface px-4 py-2.5 text-sm hover:bg-surface-2">Upload photo</button>
      </div>

      <div className="kp-card p-6">
        <h2 className="text-lg font-semibold">Identity</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <Field label="Display name" defaultValue={user?.displayName} />
          <Field label="Username (slug)" defaultValue={user?.slug} mono />
          <Field label="Public contact email" defaultValue={user?.email} type="email" />
          <Field label="Location" placeholder="Brooklyn, NY" />
          <Field label="Languages" placeholder="English, Spanish" />
          <Field label="Creating since" placeholder="2019" />
        </div>
        <div className="mt-4">
          <Field label="Tagline" placeholder="Lifestyle and tech creator helping brands ship better launch content" />
        </div>
        <div className="mt-4">
          <Field label="Bio" textarea rows={5} />
        </div>
        <div className="mt-4">
          <Field label="Brand collaboration style" placeholder="Authentic storytelling for DTC brands" />
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button className="rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-2">Discard</button>
          <button className="rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">Save changes</button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label, defaultValue, placeholder, type = "text", textarea, rows = 3, mono,
}: { label: string; defaultValue?: string; placeholder?: string; type?: string; textarea?: boolean; rows?: number; mono?: boolean }) {
  const cls = `mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${mono ? "kp-mono" : ""}`;
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea rows={rows} placeholder={placeholder} defaultValue={defaultValue} className={cls} />
      ) : (
        <input type={type} placeholder={placeholder} defaultValue={defaultValue} className={cls} />
      )}
    </div>
  );
}
