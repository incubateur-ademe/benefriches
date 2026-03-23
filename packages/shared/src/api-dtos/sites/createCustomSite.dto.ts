import z from "zod";

import {
  addressSchema,
  fricheActivitySchema,
  siteNatureSchema,
  siteYearlyExpenseSchema,
  siteYearlyIncomeSchema,
  urbanZoneLandParcelSchema,
  urbanZoneTypeSchema,
} from "../../site";
import { soilsDistributionSchema } from "../../soils";

const baseSchema = z.object({
  createdBy: z.string(),
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  address: addressSchema,
  soilsDistribution: soilsDistributionSchema,
  owner: z.object({ structureType: z.string(), name: z.string() }).optional(),
  tenant: z.object({ structureType: z.string(), name: z.string() }).optional(),
  yearlyExpenses: siteYearlyExpenseSchema.array(),
  yearlyIncomes: siteYearlyIncomeSchema.array(),
});

const fricheCustomDtoSchema = baseSchema.extend({
  nature: siteNatureSchema.extract(["FRICHE"]),
  fricheActivity: fricheActivitySchema.optional(),
  contaminatedSoilSurface: z.number().optional(),
  accidentsMinorInjuries: z.number().optional(),
  accidentsSevereInjuries: z.number().optional(),
  accidentsDeaths: z.number().optional(),
});

const agriculturalCustomSiteDtoSchema = baseSchema.extend({
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
  isSiteOperated: z.boolean(),
});

const naturalCustomSiteDtoSchema = baseSchema.extend({
  nature: siteNatureSchema.extract(["NATURAL_AREA"]),
  naturalAreaType: z.enum(["PRAIRIE", "FOREST", "WET_LAND", "MIXED_NATURAL_AREA"]),
});

const urbanZoneCustomSiteDtoSchema = baseSchema.extend({
  nature: siteNatureSchema.extract(["URBAN_ZONE"]),
  // soils distribution is derived from land parcels
  soilsDistribution: z.never(),
  urbanZoneType: urbanZoneTypeSchema,
  landParcels: urbanZoneLandParcelSchema.array().nonempty(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().optional(),
  manager: z.object({ structureType: z.string(), name: z.string() }),
  vacantCommercialPremisesFootprint: z.number(),
  vacantCommercialPremisesFloorArea: z.number().optional(),
  fullTimeJobsEquivalent: z.number().optional(),
});

export const createCustomSiteDtoSchema = z.discriminatedUnion("nature", [
  fricheCustomDtoSchema,
  agriculturalCustomSiteDtoSchema,
  naturalCustomSiteDtoSchema,
  urbanZoneCustomSiteDtoSchema,
]);

export type CreateCustomSiteDto = z.infer<typeof createCustomSiteDtoSchema>;
