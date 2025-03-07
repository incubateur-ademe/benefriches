import z from "zod";

import { addressSchema, siteNatureSchema } from "../../site";
import { RouteDef } from "../routeDef";

const baseExpressSiteDtoSchema = z.object({
  id: z.string(),
  createdBy: z.string(),
  surfaceArea: z.number().nonnegative(),
  address: addressSchema,
  nature: siteNatureSchema,
});

const createExpressSiteDtoSchema = z.discriminatedUnion("nature", [
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("FRICHE"),
  }),
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("AGRICULTURAL"),
    activity: z.string(),
  }),
  baseExpressSiteDtoSchema.extend({
    nature: z.literal("NATURAL_AREA"),
    type: z.string(),
  }),
]);

export const createExpressSite = {
  path: "/sites/create-express",
  bodySchema: createExpressSiteDtoSchema,
} as const satisfies RouteDef;
