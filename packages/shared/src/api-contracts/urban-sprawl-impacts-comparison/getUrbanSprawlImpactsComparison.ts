import { z } from "zod";

import {
  ReconversionProjectImpacts,
  SiteImpactsDataView,
} from "../../reconversion-project-impacts";
import { ReconversionProjectImpactsDataView } from "../../reconversion-project-impacts/projectImpactsDataView.types";
import { siteNatureSchema } from "../../site";
import { RouteDef } from "../routeDef";

export type UrbanSprawlImpactsComparisonResult<TSchedule> = {
  projectData: ReconversionProjectImpactsDataView<TSchedule>;
  baseCase: {
    siteData: SiteImpactsDataView;
    impacts: ReconversionProjectImpacts;
  };
  comparisonCase: {
    siteData: SiteImpactsDataView;
    impacts: ReconversionProjectImpacts;
  };
};

export const getUrbanSprawlImpactsComparison = {
  path: "/reconversion-projects/:reconversionProjectId/urban-sprawl-comparison",
  querySchema: z.object({
    comparisonSiteNature: siteNatureSchema,
    evaluationPeriodInYears: z.coerce.number().nonnegative(),
  }),
} as const satisfies RouteDef;
