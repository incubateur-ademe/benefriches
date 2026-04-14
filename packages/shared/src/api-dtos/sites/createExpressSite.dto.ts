import z from "zod";

import { addressSchema, fricheActivitySchema, siteNatureSchema } from "../../site";
import { surfaceAreaSchema } from "../../surface-area";

const baseExpressSiteDtoSchema = z.object({
  id: z.string(),
  createdBy: z.string(),
  surfaceArea: surfaceAreaSchema,
  address: addressSchema,
  nature: siteNatureSchema,
});

export const createExpressSiteDtoSchema = z.discriminatedUnion("nature", [
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("FRICHE"),
    fricheActivity: fricheActivitySchema,
    builtSurfaceArea: surfaceAreaSchema.optional(),
    hasContaminatedSoils: z.boolean().optional(),
  }),
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("AGRICULTURAL_OPERATION"),
    activity: z.string(),
  }),
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("NATURAL_AREA"),
    type: z.string(),
  }),
]);

export type CreateExpressSiteDto = z.infer<typeof createExpressSiteDtoSchema>;
