import { z } from "zod";

import {
  ReconversionProjectImpacts,
  SiteImpactsDataView,
} from "../../reconversion-project-impacts";
import { ReconversionProjectImpactsDataView } from "../../reconversion-project-impacts/projectImpactsDataView.types";
import { siteNatureSchema, StatuQuoSiteImpacts } from "../../site";
import { UrbanSprawlComparisonImpacts } from "../../urban-sprawl-impacts-comparison/types";

export type UrbanSprawlImpactsComparisonResultDto<TSchedule> = {
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

export const getUrbanSprawlImpactsComparisonDtoSchema = z.object({
  comparisonSiteNature: siteNatureSchema,
  evaluationPeriodInYears: z.coerce.number().nonnegative(),
});
