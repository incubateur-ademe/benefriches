import { GetSitesByIdGateway } from "../../core/actions/reconversionProjectCreationInitiated.action";
import { ProjectSite } from "../../core/project.types";

export class HttpSitesService implements GetSitesByIdGateway {
  async getSiteFeaturesById(siteId: string): Promise<ProjectSite | undefined> {
    const response = await fetch(`/api/sites/${siteId}/features`);

    if (!response.ok) throw new Error(`Error while fetching site with id ${siteId}`);

    const jsonResponse = (await response.json()) as ProjectSite;
    return jsonResponse;
  }
}
