import { GetReconversionProjectFeaturesResponseDto } from "shared";

import { ProjectFeaturesGateway } from "../../application/project-features/projectFeatures.actions";

export class HttpProjectFeaturesService implements ProjectFeaturesGateway {
  async getById(projectId: string): Promise<GetReconversionProjectFeaturesResponseDto> {
    const response = await fetch(`/api/reconversion-projects/${projectId}/features`);

    if (!response.ok)
      throw new Error(`Error while fetching reconversion project features with id ${projectId}`);

    const jsonResponse = (await response.json()) as GetReconversionProjectFeaturesResponseDto;
    return jsonResponse;
  }
}
