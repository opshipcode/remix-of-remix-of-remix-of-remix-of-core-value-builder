import { ExternalLink } from "lucide-react";

const RES = [
  { title: "Creator contract template (PDF)", href: "#", category: "Legal" },
  { title: "Brand pitch email template", href: "#", category: "Outbound" },
  { title: "Rate benchmark report Q2 2026", href: "#", category: "Pricing" },
  { title: "FTC disclosure cheatsheet", href: "#", category: "Compliance" },
  { title: "Invoicing template (Notion)", href: "#", category: "Operations" },
  { title: "DMCA response template", href: "#", category: "Legal" },
];

export default function Resources() {
  return (
    <div className="kp-card divide-y divide-border">
      {RES.map((r) => (
        <a key={r.title} href={r.href} className="flex items-center justify-between p-5 transition hover:bg-surface-2">
          <div>
            <p className="text-sm font-medium">{r.title}</p>
            <p className="text-xs text-muted-foreground">{r.category}</p>
          </div>
          <ExternalLink className="h-4 w-4 text-muted-foreground" />
        </a>
      ))}
    </div>
  );
}
