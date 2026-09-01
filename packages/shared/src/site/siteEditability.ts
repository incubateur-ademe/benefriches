import { z } from "zod";

export const siteCreationModeSchema = z.enum(["express", "custom", "csv-import"]);
export type SiteCreationMode = z.infer<typeof siteCreationModeSchema>;

export const siteNotEditableReasonSchema = z.enum([
  "NOT_CREATOR",
  "NOT_CUSTOM",
  "ACTIVE_RECONVERSION_PROJECT",
]);
export type SiteNotEditableReason = z.infer<typeof siteNotEditableReasonSchema>;

export const siteEditabilitySchema = z.object({
  isEditable: z.boolean(),
  notEditableReason: siteNotEditableReasonSchema.nullable(),
});
export type SiteEditability = z.infer<typeof siteEditabilitySchema>;
