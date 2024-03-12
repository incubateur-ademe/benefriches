import {
  ReconversionProjectImpactsGateway,
  ReconversionProjectImpactsResult,
} from "../../application/fetchReconversionProjectImpacts.action";

export class HttpReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  async getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsResult> {
    const response = await fetch(`/api/reconversion-projects/${reconversionProjectId}/impacts`);

    if (!response.ok) throw new Error(`Error while fetching reconversion projects`);

    const jsonResponse = (await response.json()) as ReconversionProjectImpactsResult;
    return jsonResponse;
  }
}
