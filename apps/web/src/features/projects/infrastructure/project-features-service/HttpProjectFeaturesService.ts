import { ProjectFeaturesGateway } from "../../application/project-features/projectFeatures.actions";
import { ProjectFeatures } from "../../domain/projects.types";

export class HttpProjectFeaturesService implements ProjectFeaturesGateway {
  async getById(projectId: string): Promise<ProjectFeatures> {
    const response = await fetch(`/api/reconversion-projects/${projectId}/features`);

    if (!response.ok)
      throw new Error(`Error while fetching reconversion project features with id ${projectId}`);

    const jsonResponse = (await response.json()) as ProjectFeatures;
    return jsonResponse;
  }
}
