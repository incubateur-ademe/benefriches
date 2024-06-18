import { SitesReadRepository } from "src/sites/core/gateways/SitesReadRepository";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";

export class InMemorySiteReadRepository implements SitesReadRepository {
  sites: SiteViewModel[] = [];

  _setSites(sites: SiteViewModel[]) {
    this.sites = sites;
  }

  getById(siteId: string): Promise<SiteViewModel | undefined> {
    return Promise.resolve(this.sites.find(({ id }) => id === siteId));
  }
}
