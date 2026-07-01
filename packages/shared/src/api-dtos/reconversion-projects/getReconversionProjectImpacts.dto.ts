import { z } from "zod";

import {
  AggregatedReconversionIndirectEconomicImpacts,
  AggregatedProjectImpactMetric,
  ProjectEconomicBalance,
  ReconversionProjectOnSiteIndirectEconomicImpacts,
  ReconversionStakeholders,
  ProjectOnSiteImpactMetric,
} from "../../reconversion-project-impacts";
import { BuildingsUseDistribution } from "../../reconversion-projects";
import { FricheActivity, SiteNature, siteStatuQuoImpactsSchema } from "../../site";

export type GetReconversionProjectImpactsResultDto = {
  contextData: {
    projectId: string;
    projectName: string;
    relatedSiteId: string;
    relatedSiteName: string;
    isExpressSite: boolean;
    isExpressProject: boolean;
    projectDevelopmentPlan:
      | {
          type: "PHOTOVOLTAIC_POWER_PLANT";
          installationElectricalPowerKWc: number;
          installationSurfaceArea: number;
        }
      | {
          type: "URBAN_PROJECT";
          buildingsFloorAreaDistribution: BuildingsUseDistribution;
        };
    siteAddress: {
      lat: number;
      long: number;
      label: string;
    };
    siteNature: SiteNature;
    siteSurfaceArea: number;
    fricheActivity?: FricheActivity;
  };
  impacts: {
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
};
