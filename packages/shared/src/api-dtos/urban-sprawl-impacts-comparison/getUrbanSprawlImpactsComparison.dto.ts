import { z } from "zod";

import {
  UrbanSprawlComparisonProjectImpactsDataView,
  SiteImpactsDataView,
  ProjectEconomicBalance,
  ReconversionStakeholders,
} from "../../reconversion-project-impacts";
import { siteNatureSchema, siteStatuQuoImpactsSchema } from "../../site";

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
  evaluationPeriodInYears: z.coerce.number().nonnegative().optional(),
});
