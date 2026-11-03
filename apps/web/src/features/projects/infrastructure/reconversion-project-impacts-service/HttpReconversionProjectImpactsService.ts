import type { GetReconversionProjectImpactsResultDto } from "shared";

import type { ReconversionProjectImpactsGateway } from "../../application/project-impacts/actions";

export class HttpReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  async getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<GetReconversionProjectImpactsResultDto | undefined> {
    const response = await fetch(`/api/reconversion-projects/${reconversionProjectId}/impacts`);

    // 404: unknown project id, 400: malformed project id
    if (response.status === 404 || response.status === 400) return undefined;

    if (!response.ok)
      throw new Error(`Error while fetching reconversion projects break even level`);

    const jsonResponse = (await response.json()) as GetReconversionProjectImpactsResultDto;
    return jsonResponse;
  }
}
