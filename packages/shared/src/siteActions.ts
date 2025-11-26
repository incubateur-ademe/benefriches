import { z } from "zod";

export const siteActionTypeSchema = z.enum([
  "EVALUATE_COMPATIBILITY",
  "EVALUATE_RECONVERSION_SOCIOECONOMIC_IMPACTS",
  "REQUEST_URBAN_VITALIZ_SUPPORT",
  "REQUEST_INFORMATION_ABOUT_REMEDIATION",
  "REQUEST_FUNDING_INFORMATION",
  "REFERENCE_SITE_ON_CARTOFRICHES",
]);

export type SiteActionType = z.infer<typeof siteActionTypeSchema>;

export const siteActionStatusSchema = z.enum(["todo", "done", "skipped"]);

export type SiteActionStatus = z.infer<typeof siteActionStatusSchema>;
