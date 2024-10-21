import { differenceInDays } from "date-fns";
import { Schedule, scheduleSchema, soilTypeSchema } from "shared";
import { z } from "zod";

import { urbanProjectsFeaturesSchema } from "./urbanProjects";

export const photovoltaicPowerStationFeaturesSchema = z.object({
  surfaceArea: z.number().nonnegative(),
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

export type PhotovoltaicPowerStationFeatures = z.infer<
  typeof photovoltaicPowerStationFeaturesSchema
>;

export const costSchema = z.object({ purpose: z.string(), amount: z.number().nonnegative() });
const revenueSchema = z.object({ source: z.string(), amount: z.number().nonnegative() });

const developmentPlanType = z.enum(["PHOTOVOLTAIC_POWER_PLANT", "URBAN_PROJECT"]);

const baseDevelopmentPlanSchema = z.object({
  type: developmentPlanType,
  developer: z.object({ name: z.string(), structureType: z.string() }),
  costs: costSchema.array(),
  installationSchedule: scheduleSchema.optional(),
});

const developmentPlanSchema = z.discriminatedUnion("type", [
  baseDevelopmentPlanSchema.extend({
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    features: photovoltaicPowerStationFeaturesSchema,
  }),
  baseDevelopmentPlanSchema.extend({
    type: z.literal("URBAN_PROJECT"),
    features: urbanProjectsFeaturesSchema,
  }),
]);

export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;

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
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
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

export type ReconversionProject = z.infer<typeof reconversionProjectSchema>;

export const getDurationFromScheduleInYears = ({ startDate, endDate }: Schedule) => {
  const durationInDays = differenceInDays(endDate, startDate);

  return durationInDays / 365;
};
