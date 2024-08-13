import { SitesQuery } from "src/sites/core/gateways/SitesQuery";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";

export class InMemorySitesQuery implements SitesQuery {
  sites: SiteViewModel[] = [];

  _setSites(sites: SiteViewModel[]) {
    this.sites = sites;
  }

  getById(siteId: string): Promise<SiteViewModel | undefined> {
    return Promise.resolve(this.sites.find(({ id }) => id === siteId));
  }
}
