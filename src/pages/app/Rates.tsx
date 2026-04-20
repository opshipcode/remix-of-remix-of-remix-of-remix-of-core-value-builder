import { useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { MOCK_RATES } from "@/lib/mockData";
import { Plus, Trash2, Eye, EyeOff } from "lucide-react";

export default function Rates() {
  const [rows, setRows] = useState(MOCK_RATES);
  const [publicMode, setPublicMode] = useState(true);

  function add() {
    setRows([...rows, { id: String(Date.now()), deliverable: "New deliverable", priceLabel: "$0", isPrivate: false, notes: "" }]);
  }
  function remove(id: string) {
    setRows(rows.filter((r) => r.id !== id));
  }
  function update(id: string, patch: Partial<typeof rows[number]>) {
    setRows(rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));
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
            <p className="text-xs text-muted-foreground">Show prices on your kit page or hide them all behind 'Request via inquiry'.</p>
          </div>
          <button
            onClick={() => setPublicMode((v) => !v)}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium ${
              publicMode ? "bg-primary text-primary-foreground" : "border border-border"
            }`}
          >
            {publicMode ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            {publicMode ? "Public" : "Private"}
          </button>
        </div>
      </div>

      <div className="kp-card overflow-hidden">
        <div className="grid grid-cols-[1.4fr_1fr_2fr_auto] gap-3 border-b border-border bg-surface px-5 py-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
          <span>Deliverable</span>
          <span>Price</span>
          <span>Notes</span>
          <span></span>
        </div>
        {rows.map((r) => (
          <div key={r.id} className="grid grid-cols-[1.4fr_1fr_2fr_auto] items-center gap-3 border-b border-border px-5 py-3 last:border-b-0">
            <input
              value={r.deliverable}
              onChange={(e) => update(r.id, { deliverable: e.target.value })}
              className="w-full rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
            />
            <input
              value={r.priceLabel}
              onChange={(e) => update(r.id, { priceLabel: e.target.value })}
              className="kp-mono w-full rounded-lg bg-transparent px-2 py-1.5 text-sm outline-none focus:bg-surface"
            />
            <input
              value={r.notes}
              onChange={(e) => update(r.id, { notes: e.target.value })}
              className="w-full rounded-lg bg-transparent px-2 py-1.5 text-sm text-muted-foreground outline-none focus:bg-surface"
            />
            <button onClick={() => remove(r.id)} className="rounded-lg p-2 text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button onClick={add} className="mt-4 inline-flex items-center gap-2 rounded-full border border-dashed border-border bg-surface px-4 py-2 text-sm hover:bg-surface-2">
        <Plus className="h-4 w-4" /> Add deliverable
      </button>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Field label="Licensing & usage" placeholder="e.g. 30-day organic usage included, paid amplification +20%" textarea />
        <Field label="Turnaround time" placeholder="e.g. 7 business days from brief approval" />
      </div>
    </AppPage>
  );
}

function Field({ label, placeholder, textarea }: { label: string; placeholder?: string; textarea?: boolean }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">{label}</label>
      {textarea ? (
        <textarea
          rows={3}
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      ) : (
        <input
          placeholder={placeholder}
          className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      )}
    </div>
  );
}
