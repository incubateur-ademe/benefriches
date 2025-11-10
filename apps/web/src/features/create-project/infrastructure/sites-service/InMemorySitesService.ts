import { GetSitesByIdGateway } from "../../core/actions/reconversionProjectCreationInitiated.action";
import { ProjectSite } from "../../core/project.types";

export class InMemorySitesService implements GetSitesByIdGateway {
  sites: Map<string, ProjectSite> = new Map();

  constructor(sites: ProjectSite[] = []) {
    sites.forEach((site) => this.sites.set(site.id, site));
  }

  async getById(siteId: string): Promise<ProjectSite | undefined> {
    const siteFound = this.sites.get(siteId);

    if (!siteFound) throw new Error("InMemorySitesService: site not found");
    return Promise.resolve(siteFound);
  }
}
