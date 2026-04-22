import { useEffect, useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { AppPageSkeleton } from "@/components/kit/AppPageSkeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { useKitPageStore, type RateRow, type PlatformId } from "@/store/kitPage";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Eye, EyeOff, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const PLATFORM_OPTS: PlatformId[] = ["tiktok", "instagram", "youtube"];

export default function Rates() {
  const { loading } = usePageLoader();
  const data = useKitPageStore((s) => s.data);
  const setData = useKitPageStore((s) => s.setData);

  const [rows, setRows] = useState<RateRow[]>(data.rates.rows);
  const [publicMode, setPublicMode] = useState(data.rates.isPublic);
  const [licensing, setLicensing] = useState(data.rates.licensingNotes);
  const [turnaround, setTurnaround] = useState(data.rates.turnaround);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setDirty(true);
  }, [rows, publicMode, licensing, turnaround]);

  if (loading) return <AppPage><AppPageSkeleton cards={2} /></AppPage>;

  function add() {
    setRows([
      ...rows,
      {
        id: `r_${Date.now()}`,
        platform: "instagram",
        deliverable: "New deliverable",
        priceUSD: 0,
        notes: "",
      },
    ]);
  }

  function remove(id: string) {
    setRows(rows.filter((r) => r.id !== id));
  }

  function update(id: string, patch: Partial<RateRow>) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function handleSave() {
    setSaving(true);
    window.setTimeout(() => {
      setData({
        rates: {
          isPublic: publicMode,
          rows,
          licensingNotes: licensing,
          turnaround,
        },
      });
      setSaving(false);
      setDirty(false);
      toast({ title: "Rates saved", description: "Your rate card is updated." });
    }, 1000);
  }

  return (
    <AppPage>
      <AppHeader
        title="Rates"
        description="Edit your deliverables. Toggle public to display prices, or keep them gated behind inquiry."
      />

      <div className="kp-card mb-6 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold">Public rates</p>
            <p className="text-xs text-muted-foreground">
              Show prices on your kit page or hide them all behind 'Request via inquiry'.
            </p>
          </div>
          <Button
            variant={publicMode ? "default" : "outline"}
            onClick={() => setPublicMode((v) => !v)}
            className="rounded-full"
          >
            {publicMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {publicMode ? "Public" : "Private"}
          </Button>
        </div>
      </div>

      <div className="kp-card overflow-hidden">
        <div className="grid grid-cols-[1fr_1.5fr_1fr_2fr_auto] gap-3 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Platform</span>
          <span>Deliverable</span>
          <span>Price (USD)</span>
          <span>Notes</span>
          <span></span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1fr_1.5fr_1fr_2fr_auto] items-center gap-3 border-b border-border px-5 py-3 last:border-b-0">
            <select
              value={r.platform}
              onChange={(e) => update(r.id, { platform: e.target.value as PlatformId })}
              className="rounded-lg border border-border bg-background px-2 py-1.5 text-sm capitalize"
            >
              {PLATFORM_OPTS.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
            <input
              value={r.deliverable}
              onChange={(e) => update(r.id, { deliverable: e.target.value })}
              className="w-full rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
            />
            <input
              type="number"
              value={r.priceUSD}
              onChange={(e) => update(r.id, { priceUSD: Number(e.target.value) || 0 })}
              className="kp-mono w-full rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
            />
            <input
              value={r.notes}
              onChange={(e) => update(r.id, { notes: e.target.value })}
              className="w-full rounded-lg bg-transparent px-2 py-1.5 text-sm text-muted-foreground outline-none focus:bg-surface"
            />
            <button
              onClick={() => remove(r.id)}
              className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={add}
        className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-surface px-4 py-2 text-sm hover:bg-surface-2"
      >
        <Plus className="h-4 w-4" /> Add deliverable
      </button>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Field
          label="Licensing & usage"
          placeholder="e.g. 30-day organic usage included, paid amplification +20%"
          value={licensing}
          onChange={setLicensing}
          textarea
        />
        <Field
          label="Turnaround time"
          placeholder="e.g. 7 business days from brief approval"
          value={turnaround}
          onChange={setTurnaround}
        />
      </div>

      {/* Sticky save bar */}
      <div className="sticky bottom-4 z-10 mt-8 flex items-center justify-end">
        <div
          className={`kp-glass-strong flex items-center gap-3 rounded-full px-4 py-2 transition-opacity ${
            dirty ? "opacity-100" : "opacity-60"
          }`}
        >
          <span className="text-xs text-muted-foreground">
            {dirty ? "You have unsaved changes" : "All changes saved"}
          </span>
          <Button
            size="sm"
            loaderClick
            isLoading={saving}
            onClick={handleSave}
            disabled={!dirty}
            className="rounded-full"
          >
            <Save className="h-3.5 w-3.5" /> Save
          </Button>
        </div>
      </div>
    </AppPage>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      )}
    </div>
  );
}
