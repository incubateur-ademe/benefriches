import z from "zod";

import { addressSchema, siteNatureSchema } from "../../site";
import { RouteDef } from "../routeDef";

const createExpressSiteDtoSchema = z.object({
  id: z.string(),
  createdBy: z.string(),
  surfaceArea: z.number().nonnegative(),
  address: addressSchema,
  nature: siteNatureSchema,
  cityPopulation: z.number().optional(),
});

export const createExpressSite = {
  path: "/sites/create-express",
  bodySchema: createExpressSiteDtoSchema,
} as const satisfies RouteDef;
