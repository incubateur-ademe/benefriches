import { siteNatureSchema } from "shared";
import z from "zod";

export const siteNatureSelectionSchema = z.object({
  siteNature: siteNatureSchema,
});
