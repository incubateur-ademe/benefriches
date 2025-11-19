import z from "zod";

import { addressSchema, fricheActivitySchema, siteNatureSchema } from "../../site";

const baseExpressSiteDtoSchema = z.object({
  id: z.string(),
  createdBy: z.string(),
  surfaceArea: z.number().nonnegative(),
  address: addressSchema,
  nature: siteNatureSchema,
});

export const createExpressSiteDtoSchema = z.discriminatedUnion("nature", [
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("FRICHE"),
    fricheActivity: fricheActivitySchema,
    builtSurfaceArea: z.number().nonnegative().optional(),
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
