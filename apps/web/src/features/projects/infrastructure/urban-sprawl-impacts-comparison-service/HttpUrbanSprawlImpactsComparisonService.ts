import { API_ROUTES, SiteNature } from "shared";

import {
  UrbanSprawlImpactsComparisonGateway,
  UrbanSprawlImpactsComparisonObj,
} from "../../application/project-impacts-urban-sprawl-comparison/fetchUrbanSprawlImpactsComparison.action";

type Props = {
  reconversionProjectId: string;
  evaluationPeriodInYears: number;
  comparisonSiteNature: SiteNature;
};

export class HttpUrbanSprawlImpactsComparisonService
  implements UrbanSprawlImpactsComparisonGateway
{
  async getImpactsUrbanSprawlComparison({
    reconversionProjectId,
    evaluationPeriodInYears,
    comparisonSiteNature,
  }: Props): Promise<UrbanSprawlImpactsComparisonObj> {
    const queryParams = new URLSearchParams();
    queryParams.append("evaluationPeriodInYears", evaluationPeriodInYears.toString());
    queryParams.append("comparisonSiteNature", comparisonSiteNature);

    const response = await fetch(
      `/api${API_ROUTES.URBAN_SPRAWL_IMPACTS_COMPARISON.GET.path.replace(":reconversionProjectId", reconversionProjectId)}?${queryParams.toString()}`,
    );

    if (!response.ok)
      throw new Error(`Error while fetching project urban sprawl comparison impacts`);

    const jsonResponse = (await response.json()) as UrbanSprawlImpactsComparisonObj;
    return jsonResponse;
  }
}
