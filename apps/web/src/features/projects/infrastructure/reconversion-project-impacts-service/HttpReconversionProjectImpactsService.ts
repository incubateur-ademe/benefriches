import {
  ReconversionProjectImpactsGateway,
  ReconversionProjectImpactsResult,
} from "../../application/project-impacts/fetchImpactsForReconversionProject.action";

export class HttpReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  async getReconversionProjectImpacts(
    reconversionProjectId: string,
    evaluationPeriodInYears: number,
  ): Promise<ReconversionProjectImpactsResult> {
    const response = await fetch(
      `/api/reconversion-projects/${reconversionProjectId}/impacts?evaluationPeriodInYears=${evaluationPeriodInYears}`,
    );

    if (!response.ok) throw new Error(`Error while fetching reconversion projects`);

    const jsonResponse = (await response.json()) as ReconversionProjectImpactsResult;
    return jsonResponse;
  }
}
