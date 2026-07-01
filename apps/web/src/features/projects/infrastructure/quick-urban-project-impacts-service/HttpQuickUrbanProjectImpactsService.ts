import { GetReconversionProjectImpactsResultDto } from "shared";

import { QuickUrbanProjectImpactsGateway } from "../../application/project-impacts/actions/fetchQuickImpactsForUrbanProjectOnFriche.action";

type Input = {
  siteSurfaceArea: number;
  siteCityCode: string;
};

export class HttpQuickUrbanProjectImpactsService implements QuickUrbanProjectImpactsGateway {
  async getImpacts({
    siteSurfaceArea,
    siteCityCode,
  }: Input): Promise<GetReconversionProjectImpactsResultDto> {
    const response = await fetch(
      `/api/reconversion-projects/quick-compute-urban-project-impacts-on-friche?siteSurfaceArea=${siteSurfaceArea}&siteCityCode=${siteCityCode}`,
    );

    if (!response.ok) throw new Error(`Error while fetching impacts`);

    const jsonResponse = (await response.json()) as GetReconversionProjectImpactsResultDto;
    return jsonResponse;
  }
}
