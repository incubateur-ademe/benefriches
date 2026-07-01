import { GetReconversionProjectImpactsResultDto } from "shared";

import { ReconversionProjectImpactsGateway } from "../../application/project-impacts/actions";

export class HttpReconversionProjectImpactsApi implements ReconversionProjectImpactsGateway {
  async getReconversionProjectImpacts(
    reconversionProjectId: string,
  ): Promise<GetReconversionProjectImpactsResultDto> {
    const response = await fetch(`/api/reconversion-projects/${reconversionProjectId}/impacts`);

    if (!response.ok)
      throw new Error(`Error while fetching reconversion projects break even level`);

    const jsonResponse = (await response.json()) as GetReconversionProjectImpactsResultDto;
    return jsonResponse;
  }
}
