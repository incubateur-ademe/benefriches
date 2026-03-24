import {
  agriculturalOperationActivitySchema,
  fricheActivitySchema,
  naturalAreaTypeSchema,
  siteNatureSchema,
} from "shared";
import z from "zod";

const baseSchema = z.object({
  siteNature: siteNatureSchema,
});

export const siteActivitySelectionSchema = z.discriminatedUnion("siteNature", [
  baseSchema.extend({
    siteNature: z.literal("FRICHE"),
    fricheActivity: fricheActivitySchema,
  }),
  baseSchema.extend({
    siteNature: z.literal("AGRICULTURAL_OPERATION"),
    agriculturalOperationActivity: agriculturalOperationActivitySchema,
  }),
  baseSchema.extend({
    siteNature: z.literal("NATURAL_AREA"),
    naturalAreaType: naturalAreaTypeSchema,
  }),
]);
