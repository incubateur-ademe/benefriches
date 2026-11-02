import type { GetSitesByIdGateway } from "../../core/actions/reconversionProjectCreationInitiated.action";
import type { ProjectSite } from "../../core/project.types";

export class InMemorySitesService implements GetSitesByIdGateway {
  sites: Map<string, ProjectSite> = new Map();

  constructor(sites: ProjectSite[] = []) {
    sites.forEach((site) => this.sites.set(site.id, site));
  }

  async getSiteFeaturesById(siteId: string): Promise<ProjectSite | undefined> {
    return Promise.resolve(this.sites.get(siteId));
  }
}
