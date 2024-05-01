import { differenceInDays } from "date-fns";
import { z } from "zod";
import { soilTypeSchema } from "src/soils/domain/soils";

export const photovoltaicPowerStationFeaturesSchema = z.object({
  surfaceArea: z.number().nonnegative(),
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

const scheduleSchema = z.object({
  startDate: z.date(),
  endDate: z.date(),
});

export type Schedule = z.infer<typeof scheduleSchema>;

const baseDevelopmentPlanSchema = z.object({
  type: z.string(),
  developer: z.object({ name: z.string(), structureType: z.string() }),
  cost: z.number().nonnegative(),
  installationSchedule: scheduleSchema.optional(),
});

const developmentPlanSchema = z.discriminatedUnion("type", [
  baseDevelopmentPlanSchema.extend({
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    features: photovoltaicPowerStationFeaturesSchema,
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
  developmentPlans: z.array(developmentPlanSchema).nonempty(),
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  futureSiteOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  realEstateTransactionSellingPrice: z.number().nonnegative().optional(),
  realEstateTransactionPropertyTransferDuties: z.number().nonnegative().optional(),
  reinstatementCost: z.number().nonnegative().optional(),
  reinstatementFinancialAssistanceAmount: z.number().nonnegative().optional(),
  yearlyProjectedCosts: z.object({ purpose: z.string(), amount: z.number().nonnegative() }).array(),
  yearlyProjectedRevenues: z
    .object({ source: z.string(), amount: z.number().nonnegative() })
    .array(),
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
