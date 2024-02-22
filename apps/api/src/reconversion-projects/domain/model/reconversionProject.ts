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

const baseDevelopmentPlanSchema = z.object({
  type: z.string(),
  cost: z.number().nonnegative(),
  installationSchedule: scheduleSchema.optional(),
});

const developmentPlanSchema = z.discriminatedUnion("type", [
  baseDevelopmentPlanSchema.extend({
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    features: photovoltaicPowerStationFeaturesSchema,
  }),
]);

export const reconversionProjectSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.date(),
  name: z.string(),
  description: z.string().optional(),
  relatedSiteId: z.string().uuid(),
  developmentPlans: z.array(developmentPlanSchema).nonempty(),
  futureOperator: z.object({ name: z.string(), structureType: z.string() }).optional(),
  conversionFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementContractOwner: z.object({ name: z.string(), structureType: z.string() }).optional(),
  operationsFullTimeJobsInvolved: z.number().nonnegative().optional(),
  reinstatementCost: z.number().nonnegative().optional(),
  reinstatementFinancialAssistanceAmount: z.number().nonnegative().optional(),
  yearlyProjectedCosts: z.object({ purpose: z.string(), amount: z.number().nonnegative() }).array(),
  yearlyProjectedRevenues: z
    .object({ source: z.string(), amount: z.number().nonnegative() })
    .array(),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
  reinstatementSchedule: scheduleSchema.optional(),
  operationsFirstYear: z.number().int().min(2000).optional(),
});

export type ReconversionProject = z.infer<typeof reconversionProjectSchema>;
