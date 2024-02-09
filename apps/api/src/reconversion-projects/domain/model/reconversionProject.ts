import { z } from "zod";
import { soilTypeSchema } from "src/soils/domain/soils";

const photovoltaicPowerStationFeaturesSchema = z.object({
  electricalPowerKWc: z.number().nonnegative(),
  expectedAnnualProduction: z.number().nonnegative(),
  contractDuration: z.number().nonnegative(),
});

const developmentPlanSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("PHOTOVOLTAIC_POWER_PLANT"),
    surfaceArea: z.number().nonnegative(),
    cost: z.number().nonnegative(),
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
  financialAssistanceRevenue: z.number().nonnegative(),
  yearlyProjectedCosts: z.object({ purpose: z.string(), amount: z.number().nonnegative() }).array(),
  yearlyProjectedRevenues: z
    .object({ source: z.string(), amount: z.number().nonnegative() })
    .array(),
  soilsDistribution: z.record(soilTypeSchema, z.number().nonnegative()),
});

export type ReconversionProject = z.infer<typeof reconversionProjectSchema>;
