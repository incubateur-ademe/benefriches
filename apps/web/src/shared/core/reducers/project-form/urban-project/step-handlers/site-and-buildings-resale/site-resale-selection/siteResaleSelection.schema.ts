import z from "zod";

export const siteResaleSelectionSchema = z.object({
  siteResaleSelection: z.enum(["yes", "no", "unknown"]),
});
