import z from "zod";

import {
  addressSchema,
  agriculturalOperationActivitySchema,
  fricheActivitySchema,
  naturalAreaTypeSchema,
  SITE_NAME_MAX_LENGTH,
  SITE_STAKEHOLDER_NAME_MAX_LENGTH,
  siteNatureSchema,
  siteYearlyExpenseSchema,
  siteYearlyIncomeSchema,
  urbanZoneLandParcelSchema,
  urbanZoneTypeSchema,
} from "../../site";
import { soilsDistributionSchema } from "../../soils";

const stakeholderSchema = z.object({
  structureType: z.string(),
  name: z.string().max(SITE_STAKEHOLDER_NAME_MAX_LENGTH),
});

export const baseCustomSiteSchema = z.object({
  id: z.string(),
  name: z.string().max(SITE_NAME_MAX_LENGTH),
  description: z.string().optional(),
  address: addressSchema,
  owner: stakeholderSchema.optional(),
  tenant: stakeholderSchema.optional(),
  yearlyExpenses: siteYearlyExpenseSchema.array(),
  yearlyIncomes: siteYearlyIncomeSchema.array(),
});

export const fricheCustomSiteFieldsSchema = z.object({
  nature: siteNatureSchema.extract(["FRICHE"]),
  fricheActivity: fricheActivitySchema.optional(),
  soilsDistribution: soilsDistributionSchema,
  contaminatedSoilSurface: z.number().optional(),
  accidentsMinorInjuries: z.number().optional(),
  accidentsSevereInjuries: z.number().optional(),
  accidentsDeaths: z.number().optional(),
});

export const agriculturalCustomSiteFieldsSchema = z.object({
  nature: siteNatureSchema.extract(["AGRICULTURAL_OPERATION"]),
  agriculturalOperationActivity: agriculturalOperationActivitySchema,
  soilsDistribution: soilsDistributionSchema,
  isSiteOperated: z.boolean(),
});

export const naturalCustomSiteFieldsSchema = z.object({
  nature: siteNatureSchema.extract(["NATURAL_AREA"]),
  naturalAreaType: naturalAreaTypeSchema,
  soilsDistribution: soilsDistributionSchema,
});

export const urbanZoneCustomSiteFieldsSchema = z.object({
  nature: siteNatureSchema.extract(["URBAN_ZONE"]),
  urbanZoneType: urbanZoneTypeSchema,
  landParcels: urbanZoneLandParcelSchema.array().nonempty(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().optional(),
  manager: stakeholderSchema,
  vacantCommercialPremisesFootprint: z.number(),
  vacantCommercialPremisesFloorArea: z.number().optional(),
  fullTimeJobsEquivalent: z.number().optional(),
});

const fricheCustomDtoSchema = baseCustomSiteSchema.extend(fricheCustomSiteFieldsSchema.shape);

const agriculturalCustomSiteDtoSchema = baseCustomSiteSchema.extend(
  agriculturalCustomSiteFieldsSchema.shape,
);

const naturalCustomSiteDtoSchema = baseCustomSiteSchema.extend(naturalCustomSiteFieldsSchema.shape);

const urbanZoneCustomSiteDtoSchema = baseCustomSiteSchema.extend(
  urbanZoneCustomSiteFieldsSchema.shape,
);

export const createCustomSiteDtoSchema = z.discriminatedUnion("nature", [
  fricheCustomDtoSchema,
  agriculturalCustomSiteDtoSchema,
  naturalCustomSiteDtoSchema,
  urbanZoneCustomSiteDtoSchema,
]);

export type CreateCustomSiteDto = z.infer<typeof createCustomSiteDtoSchema>;
