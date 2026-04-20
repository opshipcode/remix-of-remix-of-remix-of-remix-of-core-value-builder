import { useState } from "react";
import { AppHeader, AppPage } from "@/components/app/AppPage";
import { MOCK_INQUIRIES } from "@/lib/mockData";
import { Mail, Reply } from "lucide-react";

export default function Inquiries() {
  const [active, setActive] = useState(MOCK_INQUIRIES[0]);
  return (
    <AppPage>
      <AppHeader
        title="Inquiries"
        description="Inbound brand inquiries from your kit page. Stored, structured, searchable."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr]">
        <div className="kp-card overflow-hidden">
          {MOCK_INQUIRIES.map((i) => {
            const isActive = active.id === i.id;
            return (
              <button
                key={i.id}
                onClick={() => setActive(i)}
                className={`flex w-full items-start gap-3 border-b border-border p-4 text-left transition ${
                  isActive ? "bg-surface-2" : "hover:bg-surface"
                }`}
              >
                <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${i.status === "new" ? "bg-primary" : "bg-muted"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-sm font-medium">{i.brandName}</p>
                    <span className="kp-mono text-[10px] text-muted-foreground">
                      {new Date(i.receivedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted-foreground">{i.contactName} · {i.budget}</p>
                  <p className="mt-1 line-clamp-1 text-xs text-foreground/70">{i.summary}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="kp-card p-6 md:p-8">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="kp-display text-2xl">{active.brandName}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{active.contactName} · <span className="kp-mono">{active.email}</span></p>
            </div>
            <span className="rounded-full bg-primary-highlight px-3 py-1 text-xs text-primary">{active.budget}</span>
          </div>
          <div className="kp-divider my-6" />
          <p className="text-sm leading-relaxed text-foreground/85">{active.summary}</p>
          <div className="mt-8 flex gap-2">
            <a href={`mailto:${active.email}`} className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary-hover">
              <Reply className="h-4 w-4" /> Reply
            </a>
            <button className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm hover:bg-surface-2">
              <Mail className="h-4 w-4" /> Mark as replied
            </button>
          </div>
        </div>
      </div>
    </AppPage>
  );
}
