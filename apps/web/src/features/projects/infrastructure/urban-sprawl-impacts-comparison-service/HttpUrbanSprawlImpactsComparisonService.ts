import { SiteNature } from "shared";

import {
  UrbanSprawlImpactsComparisonGateway,
  UrbanSprawlImpactsComparisonObj,
} from "../../application/project-impacts/actions/urbanSprawlImpactsComparisonRequested.action";

type Props = {
  reconversionProjectId: string;
  comparisonSiteNature: SiteNature;
};

export class HttpUrbanSprawlImpactsComparisonService implements UrbanSprawlImpactsComparisonGateway {
  async getImpactsUrbanSprawlComparison({
    reconversionProjectId,
    comparisonSiteNature,
  }: Props): Promise<UrbanSprawlImpactsComparisonObj> {
    const queryParams = new URLSearchParams();
    queryParams.append("comparisonSiteNature", comparisonSiteNature);

    const response = await fetch(
      `/api/reconversion-projects/${reconversionProjectId}/urban-sprawl-comparison?${queryParams.toString()}`,
    );

    if (!response.ok)
      throw new Error(`Error while fetching project urban sprawl comparison impacts`);

    const jsonResponse = (await response.json()) as UrbanSprawlImpactsComparisonObj;
    return jsonResponse;
  }
}
