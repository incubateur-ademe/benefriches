import { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { SiteEntity } from "src/sites/core/models/siteEntity";

export class InMemorySitesRepository implements SitesRepository {
  private sites: SiteEntity[] = [];

  async save(site: SiteEntity) {
    this.sites.push(site);
    await Promise.resolve();
  }

  existsWithId(siteId: string): Promise<boolean> {
    const foundSite = this.sites.find(({ id }) => id === siteId);
    return Promise.resolve(!!foundSite);
  }

  _getSites() {
    return this.sites;
  }

  _setSites(sites: SiteEntity[]) {
    this.sites = sites;
  }
}
