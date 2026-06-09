import { SiteNature, UrbanSprawlImpactsComparisonResultDto } from "shared";

import { createAppAsyncThunk } from "@/app/store/appAsyncThunk";

type Props = {
  reconversionProjectId: string;
  comparisonSiteNature: SiteNature;
};

export type UrbanSprawlImpactsComparisonObj = UrbanSprawlImpactsComparisonResultDto;
export interface UrbanSprawlImpactsComparisonGateway {
  getImpactsUrbanSprawlComparison(props: Props): Promise<UrbanSprawlImpactsComparisonObj>;
}

export const urbanSprawlImpactsComparisonRequested = createAppAsyncThunk<
  UrbanSprawlImpactsComparisonObj,
  { projectId: string; comparisonSiteNature: SiteNature }
>(
  "projectImpacts/urbanSprawlImpactsComparisonRequested",
  async ({ projectId, comparisonSiteNature }, { extra }) => {
    const data = await extra.urbanSprawlImpactsComparisonService.getImpactsUrbanSprawlComparison({
      reconversionProjectId: projectId,
      comparisonSiteNature,
    });

    return data;
  },
);
