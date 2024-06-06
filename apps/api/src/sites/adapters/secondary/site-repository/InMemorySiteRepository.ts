import { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { Site } from "src/sites/core/models/site";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";

export class InMemorySitesRepository implements SitesRepository {
  private sites: Site[] = [];

  async save(site: Site) {
    this.sites.push(site);
    await Promise.resolve();
  }

  existsWithId(siteId: string): Promise<boolean> {
    const foundSite = this.sites.find(({ id }) => id === siteId);
    return Promise.resolve(!!foundSite);
  }

  getById(siteId: string): Promise<SiteViewModel | undefined> {
    return Promise.resolve(this.sites.find(({ id }) => id === siteId));
  }

  _getSites() {
    return this.sites;
  }

  _setSites(sites: Site[]) {
    this.sites = sites;
  }
}
