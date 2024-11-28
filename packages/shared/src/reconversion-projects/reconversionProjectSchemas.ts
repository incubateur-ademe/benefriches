import z from "zod";

import { soilTypeSchema } from "../soils";
import { buildingsUseSurfaceAreaDistributionSchema } from "./urban-project";
import { urbanProjectsSpaceSchema } from "./urban-project/urbanProject";

export const photovoltaicPowerStationFeaturesSchema = z.object({
  surfaceArea: z.number().nonnegative(),
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

export const urbanProjectsFeaturesSchema = z.object({
  spacesDistribution: urbanProjectsSpaceSchema,
  buildingsFloorAreaDistribution: buildingsUseSurfaceAreaDistributionSchema,
});

const costSchema = z.object({ purpose: z.string(), amount: z.number().nonnegative() });
const revenueSchema = z.object({ source: z.string(), amount: z.number().nonnegative() });

const developmentPlanType = z.enum(["PHOTOVOLTAIC_POWER_PLANT", "URBAN_PROJECT"]);

export const scheduleSchema = z.object({
  startDate: z.string().or(z.date()).pipe(z.coerce.date()),
  endDate: z.string().or(z.date()).pipe(z.coerce.date()),
});

export const baseDevelopmentPlanSchema = z.object({
  type: developmentPlanType,
  developer: z.object({ name: z.string(), structureType: z.string() }),
  costs: costSchema.array(),
  installationSchedule: scheduleSchema.optional(),
});

export const developmentPlanSchema = z.discriminatedUnion("type", [
  baseDevelopmentPlanSchema.extend({
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    features: photovoltaicPowerStationFeaturesSchema,
  }),
  baseDevelopmentPlanSchema.extend({
    type: z.literal("URBAN_PROJECT"),
    features: urbanProjectsFeaturesSchema,
  }),
]);

export const reconversionProjectSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  creationMode: z.enum(["express", "custom"]),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  developmentPlan: developmentPlanSchema,
  decontaminatedSoilSurface: z.number().nonnegative().optional(),
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  sitePurchaseSellingPrice: z.number().nonnegative().optional(),
  sitePurchasePropertyTransferDuties: z.number().nonnegative().optional(),
  reinstatementCosts: z.array(costSchema).optional(),
  financialAssistanceRevenues: z.array(revenueSchema).optional(),
  yearlyProjectedCosts: z.array(costSchema),
  yearlyProjectedRevenues: z.array(revenueSchema),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().int().min(2000).optional(),
  projectPhase: z.string(),
  siteResaleExpectedSellingPrice: z.number().nonnegative().optional(),
  siteResaleExpectedPropertyTransferDuties: z.number().nonnegative().optional(),
});

export type DevelopmentPlan = z.infer<typeof reconversionProjectSchema>;

export const reconversionProjectPropsSchema = reconversionProjectSchema.omit({
  createdAt: true,
  creationMode: true,
});
