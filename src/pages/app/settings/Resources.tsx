import { useState } from "react";
import { ExternalLink, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { usePageLoader } from "@/hooks/usePageLoader";
import { toast } from "@/hooks/use-toast";

const RES = [
  { id: "r1", title: "Creator contract template (PDF)", category: "Legal" },
  { id: "r2", title: "Brand pitch email template", category: "Outbound" },
  { id: "r3", title: "Rate benchmark report Q2 2026", category: "Pricing" },
  { id: "r4", title: "FTC disclosure cheatsheet", category: "Compliance" },
  { id: "r5", title: "Invoicing template (Notion)", category: "Operations" },
  { id: "r6", title: "DMCA response template", category: "Legal" },
];

export default function Resources() {
  const { loading } = usePageLoader(700);
  const [busy, setBusy] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="kp-card divide-y divide-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center justify-between p-5">
            <div className="space-y-2">
              <Skeleton className="h-4 w-72" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-8 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const handleDownload = (id: string, title: string) => {
    setBusy(id);
    window.setTimeout(() => {
      setBusy(null);
      toast({ title: "Downloaded", description: `${title} saved.` });
    }, 900);
  };

  return (
    <div className="kp-card divide-y divide-border">
      {RES.map((r) => (
        <div key={r.id} className="flex items-center justify-between gap-4 p-5">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.category}</p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              loaderClick
              isLoading={busy === r.id}
              onClick={() => handleDownload(r.id, r.title)}
              className="rounded-full"
            >
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className="text-muted-foreground hover:text-foreground"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
