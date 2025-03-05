import z from "zod";

import {
  addressSchema,
  fricheActivitySchema,
  siteNatureSchema,
  siteYearlyExpenseSchema,
} from "../../site";
import { RouteDef } from "../routeDef";

const baseSchema = z.object({
  createdBy: z.string(),
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: addressSchema,
  soilsDistribution: z.record(z.string(), z.number().nonnegative()),
  owner: z.object({ structureType: z.string(), name: z.string() }).optional(),
  tenant: z.object({ structureType: z.string(), name: z.string() }).optional(),
  yearlyExpenses: siteYearlyExpenseSchema.array(),
  yearlyIncomes: z
    .object({
      source: z.string(),
      amount: z.number().nonnegative(),
    })
    .array(),
});

const fricheCustomDtoSchema = baseSchema.extend({
  isFriche: z.literal(true),
  nature: siteNatureSchema.extract(["FRICHE"]),
  fricheActivity: fricheActivitySchema.optional(),
  contaminatedSoilSurface: z.number().optional(),
  accidentsMinorInjuries: z.number().optional(),
  accidentsSevereInjuries: z.number().optional(),
  accidentsDeaths: z.number().optional(),
});

const agriculturaOrNaturalCustomSiteDtoSchema = baseSchema.extend({
  isFriche: z.literal(false),
  nature: siteNatureSchema.exclude(["FRICHE"]),
});

const createCustomSiteDtoSchema = z.discriminatedUnion("isFriche", [
  fricheCustomDtoSchema,
  agriculturaOrNaturalCustomSiteDtoSchema,
]);

export const createCustomSite = {
  path: "/sites/create-custom",
  bodySchema: createCustomSiteDtoSchema,
} as const satisfies RouteDef;
