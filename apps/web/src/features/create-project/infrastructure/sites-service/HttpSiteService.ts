import { GetSitesByIdGateway } from "../../core/actions/urbanProjectCreationInitiated.action";
import { ProjectSite } from "../../core/project.types";

export class HttpSitesService implements GetSitesByIdGateway {
  async getById(siteId: string): Promise<ProjectSite | undefined> {
    const response = await fetch(`/api/sites/${siteId}`);

    if (!response.ok) throw new Error(`Error while fetching site with id ${siteId}`);

    const jsonResponse = (await response.json()) as ProjectSite;
    return jsonResponse;
  }
}
