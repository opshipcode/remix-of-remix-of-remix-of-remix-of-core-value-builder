import type { KitPageData, TemplateId } from "@/store/kitPage";
import { MinimalTemplate } from "./MinimalTemplate";
import { BoldTemplate } from "./BoldTemplate";
import { ProfessionalTemplate } from "./ProfessionalTemplate";

interface Props {
  data: KitPageData;
  /** Optional override of which template to render (defaults to data.template) */
  template?: TemplateId;
  preview?: boolean;
}

export function TemplateRenderer({ data, template, preview }: Props) {
  const id = template ?? data.template;
  switch (id) {
    case "bold":
      return <BoldTemplate data={data} preview={preview} />;
    case "professional":
      return <ProfessionalTemplate data={data} preview={preview} />;
    case "minimal":
    default:
      return <MinimalTemplate data={data} preview={preview} />;
  }
}

export const TEMPLATE_META: Record<TemplateId, { label: string; tagline: string; planRequired?: "Creator" | "Pro" }> = {
  minimal: {
    label: "Minimal",
    tagline: "Quiet, editorial, type-led. For creators whose work speaks first.",
  },
  bold: {
    label: "Bold",
    tagline: "Loud color, oversized type, bento stats. For statement creators.",
    planRequired: "Creator",
  },
  professional: {
    label: "Professional",
    tagline: "Agency-grade tables and KPIs. For brand-side teams who want receipts.",
    planRequired: "Creator",
  },
};
