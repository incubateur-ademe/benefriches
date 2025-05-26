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

const agriculturalCustomSiteDtoSchema = baseSchema.extend({
  isFriche: z.literal(false),
  nature: siteNatureSchema.extract(["AGRICULTURAL_OPERATION"]),
  agriculturalOperationActivity: z.enum([
    "CEREALS_AND_OILSEEDS_CULTIVATION",
    "LARGE_VEGETABLE_CULTIVATION",
    "MARKET_GARDENING",
    "FLOWERS_AND_HORTICULTURE",
    "VITICULTURE",
    "FRUITS_AND_OTHER_PERMANENT_CROPS",
    "CATTLE_FARMING",
    "PIG_FARMING",
    "POULTRY_FARMING",
    "SHEEP_AND_GOAT_FARMING",
    "POLYCULTURE_AND_LIVESTOCK",
  ]),
});

const naturalCustomSiteDtoSchema = baseSchema.extend({
  isFriche: z.literal(false),
  nature: siteNatureSchema.extract(["NATURAL_AREA"]),
  naturalAreaType: z.enum(["PRAIRIE", "FOREST", "WET_LAND", "MIXED_NATURAL_AREA"]),
});

const createCustomSiteDtoSchema = z.discriminatedUnion("nature", [
  fricheCustomDtoSchema,
  agriculturalCustomSiteDtoSchema,
  naturalCustomSiteDtoSchema,
]);

export const createCustomSite = {
  path: "/sites/create-custom",
  bodySchema: createCustomSiteDtoSchema,
} as const satisfies RouteDef;
