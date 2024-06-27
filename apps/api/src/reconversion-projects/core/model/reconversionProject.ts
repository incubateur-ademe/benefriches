import { differenceInDays } from "date-fns";
import { z } from "zod";
import { soilTypeSchema } from "src/soils/domain/soils";
import { mixedUseNeighbourhoodFeaturesSchema } from "./mixedUseNeighbourhood";

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

const scheduleSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

const developmentPlanType = z.enum(["PHOTOVOLTAIC_POWER_PLANT", "MIXED_USE_NEIGHBOURHOOD"]);

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
    type: z.literal("MIXED_USE_NEIGHBOURHOOD"),
    features: mixedUseNeighbourhoodFeaturesSchema,
  }),
]);

export type DevelopmentPlan = z.infer<typeof developmentPlanSchema>;

export const reconversionProjectSchema = z.object({
  id: z.string().uuid(),
  createdBy: z.string().uuid(),
  createdAt: z.date(),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  developmentPlan: developmentPlanSchema,
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  realEstateTransactionSellingPrice: z.number().nonnegative().optional(),
  realEstateTransactionPropertyTransferDuties: z.number().nonnegative().optional(),
  reinstatementCosts: z.array(costSchema).optional(),
  financialAssistanceRevenues: z.array(revenueSchema).optional(),
  yearlyProjectedCosts: z.array(costSchema),
  yearlyProjectedRevenues: z.array(revenueSchema),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().int().min(2000).optional(),
  projectPhase: z.string(),
  projectPhaseDetails: z.string().optional(),
});

export type ReconversionProject = z.infer<typeof reconversionProjectSchema>;

export const getDurationFromScheduleInYears = ({ startDate, endDate }: Schedule) => {
  const durationInDays = differenceInDays(endDate, startDate);

  return durationInDays / 365;
};
