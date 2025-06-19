import { SiteNature, UrbanSprawlImpactsComparisonResult } from "shared";

import { createAppAsyncThunk } from "@/shared/core/store-config/appAsyncThunk";

type Props = {
  reconversionProjectId: string;
  evaluationPeriodInYears: number;
  comparisonSiteNature: SiteNature;
};

export type UrbanSprawlImpactsComparisonObj = UrbanSprawlImpactsComparisonResult<{
  startDate: string;
  endDate: string;
}>;
export interface UrbanSprawlImpactsComparisonGateway {
  getImpactsUrbanSprawlComparison(props: Props): Promise<UrbanSprawlImpactsComparisonObj>;
}

export const fetchUrbanSprawlImpactsComparison = createAppAsyncThunk<
  UrbanSprawlImpactsComparisonObj,
  { evaluationPeriod: number; projectId: string; comparisonSiteNature: SiteNature }
>(
  "urbanSprawlComparison/fetchImpactsUrbanSprawlComparison",
  async ({ projectId, evaluationPeriod, comparisonSiteNature }, { extra }) => {
    const data = await extra.urbanSprawlImpactsComparisonService.getImpactsUrbanSprawlComparison({
      reconversionProjectId: projectId,
      evaluationPeriodInYears: evaluationPeriod,
      comparisonSiteNature,
    });

    return data;
  },
);
