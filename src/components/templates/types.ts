import type { KitPageData } from "@/store/kitPage";

export interface TemplateProps {
  data: KitPageData;
  /** When true, render in compact preview mode (used inside Builder canvas). */
  preview?: boolean;}

export type TemplateId = "minimal" | "bold" | "professional";
