import { z } from "zod";

import {
  AggregatedReconversionIndirectEconomicImpacts,
  ProjectEconomicBalance,
  ReconversionProjectOnSiteIndirectEconomicImpacts,
  ReconversionStakeholders,
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
  };
  reconversionImpactsBreakdown: {
    siteStatuQuoIndirectEconomicImpactsData: z.infer<
      typeof siteStatuQuoImpactsSchema.shape.economicImpacts
    >;
    projectOnSiteIndirectEconomicImpactsData: ReconversionProjectOnSiteIndirectEconomicImpacts;
  };
};
