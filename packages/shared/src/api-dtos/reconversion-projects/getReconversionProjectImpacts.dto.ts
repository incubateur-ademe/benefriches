import { z } from "zod";

import {
  AggregatedReconversionIndirectEconomicImpacts,
  AggregatedProjectImpactMetric,
  ProjectEconomicBalance,
  ReconversionProjectOnSiteIndirectEconomicImpacts,
  ReconversionStakeholders,
  ProjectOnSiteImpactMetric,
} from "../../reconversion-project-impacts";
import { siteStatuQuoImpactsSchema } from "../../site";

export type GetReconversionProjectImpactsResultDto = {
  projectionYears: string[];
  projectEconomicBalance: ProjectEconomicBalance;
  operationsFirstYear: number;
  stakeholders: ReconversionStakeholders;
  aggregatedReconversionImpacts: {
    breakEvenYear?: string;
    breakEvenIndex?: number;
    cumulativeBalanceByYear: number[];
    indirectEconomicImpacts: AggregatedReconversionIndirectEconomicImpacts;
    impactsMetrics: AggregatedProjectImpactMetric[];
  };
  reconversionImpactsBreakdown: {
    siteStatuQuoIndirectEconomicImpactsData: z.infer<
      typeof siteStatuQuoImpactsSchema.shape.economicImpacts
    >;
    projectOnSiteIndirectEconomicImpactsData: ReconversionProjectOnSiteIndirectEconomicImpacts;
    projectIndirectImpactMetrics: ProjectOnSiteImpactMetric[];
    siteStatuQuoImpactMetrics: z.infer<typeof siteStatuQuoImpactsSchema.shape.impactMetrics>;
  };
};
