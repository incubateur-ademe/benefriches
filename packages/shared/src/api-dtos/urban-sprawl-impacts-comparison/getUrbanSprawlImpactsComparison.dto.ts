import { z } from "zod";

import type {
  UrbanSprawlComparisonProjectImpactsDataView,
  SiteImpactsDataView,
  ProjectEconomicBalance,
  ReconversionStakeholders,
} from "../../reconversion-project-impacts";
import type { siteStatuQuoImpactsSchema } from "../../site";
import { siteNatureSchema } from "../../site";
import {
  MAX_EVALUATION_PERIOD_IN_YEARS,
  MIN_EVALUATION_PERIOD_IN_YEARS,
} from "../../sum-on-evolution-period/SumOnEvolutionPeriodService";

export type UrbanSprawlImpactsComparisonResultDto = {
  simulationSiteData: SiteImpactsDataView;
  projectionYears: string[];
  stakeholders: ReconversionStakeholders;
  operationsFirstYear: number;
  simulationSiteStatuQuoImpactsData: z.infer<
    typeof siteStatuQuoImpactsSchema.shape.economicImpacts
  >;
  projectEconomicBalance: ProjectEconomicBalance;
  projectOnSimulationSiteImpactsData: UrbanSprawlComparisonProjectImpactsDataView;
  breakEvenYear?: string;
  breakEvenIndex?: number;
  cumulativeBalanceByYear: number[];
};

export const getUrbanSprawlImpactsComparisonDtoSchema = z.object({
  comparisonSiteNature: siteNatureSchema,
  // Bounded: the period sizes per-year arrays, so an unbounded value could exhaust memory.
  evaluationPeriodInYears: z.coerce
    .number()
    .int()
    .min(MIN_EVALUATION_PERIOD_IN_YEARS)
    .max(MAX_EVALUATION_PERIOD_IN_YEARS)
    .optional(),
});
