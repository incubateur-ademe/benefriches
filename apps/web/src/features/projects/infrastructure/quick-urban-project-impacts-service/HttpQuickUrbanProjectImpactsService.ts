import {
  ReconversionProjectImpactsResult,
  QuickUrbanProjectImpactsGateway,
} from "../../application/project-impacts/fetchQuickImpactsForUrbanProjectOnFriche.action";

type Input = {
  siteSurfaceArea: number;
  siteCityCode: string;
};

export class HttpQuickUrbanProjectImpactsService implements QuickUrbanProjectImpactsGateway {
  async getImpacts({
    siteSurfaceArea,
    siteCityCode,
  }: Input): Promise<ReconversionProjectImpactsResult> {
    const response = await fetch(
      `/api/reconversion-projects/quick-compute-urban-project-impacts-on-friche?siteSurfaceArea=${siteSurfaceArea}&siteCityCode=${siteCityCode}`,
    );

    if (!response.ok) throw new Error(`Error while fetching impacts`);

    const jsonResponse = (await response.json()) as ReconversionProjectImpactsResult;
    return jsonResponse;
  }
}
