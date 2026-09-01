import z from "zod";

import {
  addressSchema,
  siteNatureSchema,
  urbanZoneLandParcelSchema,
  urbanZoneTypeSchema,
} from "../../site";
import { soilsDistributionSchema } from "../../soils";
import { surfaceAreaSchema } from "../../surface-area";

const baseSiteFeaturesSchema = z.object({
  id: z.string(),
  name: z.string(),
  isExpressSite: z.boolean(),
  owner: z.object({
    name: z.string().optional(),
    structureType: z.string(),
  }),
  tenant: z
    .object({
      name: z.string().optional(),
      structureType: z.string().optional(),
    })
    .optional(),
  soilsDistribution: soilsDistributionSchema,
  surfaceArea: surfaceAreaSchema,
  address: addressSchema,
  yearlyExpenses: z
    .array(
      z.object({
        amount: z.number(),
        purpose: z.string(),
        bearer: z.enum(["owner", "tenant"]),
      }),
    )
    .default([]),
  yearlyIncomes: z
    .array(
      z.object({
        amount: z.number(),
        source: z.string(),
      }),
    )
    .default([]),
  description: z.string().optional(),
});

const fricheSiteFeaturesResponseDtoSchema = baseSiteFeaturesSchema.extend({
  nature: siteNatureSchema.extract(["FRICHE"]),
  fricheActivity: z.string().optional(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().optional(),
  accidentsMinorInjuries: z.number().optional(),
  accidentsSevereInjuries: z.number().optional(),
  accidentsDeaths: z.number().optional(),
});

const agriculturalOperationSiteFeaturesResponseDtoSchema = baseSiteFeaturesSchema.extend({
  nature: siteNatureSchema.extract(["AGRICULTURAL_OPERATION"]),
  // optional: the column is nullable and sites created before it existed have no activity
  agriculturalOperationActivity: z.string().optional(),
  // optional: the column is nullable (legacy rows, or sites operated by their owner with no
  // recorded tenant); the update-site wizard falls back to deriving it from tenant/income
  // presence when absent (see convertSiteToCustomSteps.ts).
  isSiteOperated: z.boolean().optional(),
});

const naturalAreaSiteFeaturesResponseDtoSchema = baseSiteFeaturesSchema.extend({
  nature: siteNatureSchema.extract(["NATURAL_AREA"]),
  // optional: the column is nullable and sites created before it existed have no type
  naturalAreaType: z.string().optional(),
});

const urbanZoneSiteFeaturesResponseDtoSchema = baseSiteFeaturesSchema.extend({
  nature: siteNatureSchema.extract(["URBAN_ZONE"]),
  urbanZoneType: urbanZoneTypeSchema,
  landParcels: urbanZoneLandParcelSchema.array(),
  hasContaminatedSoils: z.boolean().optional(),
  contaminatedSoilSurface: z.number().optional(),
  manager: z.object({ structureType: z.string(), name: z.string() }).optional(),
  vacantCommercialPremisesFootprint: z.number().optional(),
  vacantCommercialPremisesFloorArea: z.number().optional(),
  fullTimeJobsEquivalent: z.number().optional(),
});

export const getSiteFeaturesResponseDtoSchema = z.discriminatedUnion("nature", [
  fricheSiteFeaturesResponseDtoSchema,
  agriculturalOperationSiteFeaturesResponseDtoSchema,
  naturalAreaSiteFeaturesResponseDtoSchema,
  urbanZoneSiteFeaturesResponseDtoSchema,
]);

export type GetSiteFeaturesResponseDto = z.infer<typeof getSiteFeaturesResponseDtoSchema>;
