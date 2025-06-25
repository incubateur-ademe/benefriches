import { z } from "zod";

import {
  ReconversionProjectImpacts,
  SiteImpactsDataView,
} from "../../reconversion-project-impacts";
import { ReconversionProjectImpactsDataView } from "../../reconversion-project-impacts/projectImpactsDataView.types";
import { siteNatureSchema, StatuQuoSiteImpacts } from "../../site";
import { UrbanSprawlComparisonImpacts } from "../../urban-sprawl-impacts-comparison/types";
import { RouteDef } from "../routeDef";

export type UrbanSprawlImpactsComparisonResult<TSchedule> = {
  projectData: ReconversionProjectImpactsDataView<TSchedule>;
  baseCase: {
    statuQuoSiteImpacts: StatuQuoSiteImpacts;
    conversionSiteData: SiteImpactsDataView;
    projectImpacts: ReconversionProjectImpacts;
    comparisonImpacts: UrbanSprawlComparisonImpacts;
  };
  comparisonCase: {
    statuQuoSiteImpacts: StatuQuoSiteImpacts;
    conversionSiteData: SiteImpactsDataView;
    projectImpacts: ReconversionProjectImpacts;
    comparisonImpacts: UrbanSprawlComparisonImpacts;
  };
};

export const getUrbanSprawlImpactsComparison = {
  path: "/reconversion-projects/:reconversionProjectId/urban-sprawl-comparison",
  querySchema: z.object({
    comparisonSiteNature: siteNatureSchema,
    evaluationPeriodInYears: z.coerce.number().nonnegative(),
  }),
} as const satisfies RouteDef;
