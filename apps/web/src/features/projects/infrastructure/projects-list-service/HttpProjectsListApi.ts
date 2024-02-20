import { ReconversionProjectsListGateway } from "../../application/projectsList.actions";
import { ReconversionProjectsGroupedBySite } from "../../domain/projects.types";

export class HttpReconversionProjectsListApi implements ReconversionProjectsListGateway {
  async getGroupedBySite(): Promise<ReconversionProjectsGroupedBySite> {
    const response = await fetch(`/api/reconversion-projects/list-by-site`);

    if (!response.ok) throw new Error(`Error while fetching reconversion projects`);

    const jsonResponse = (await response.json()) as ReconversionProjectsGroupedBySite;
    return jsonResponse;
  }
}
