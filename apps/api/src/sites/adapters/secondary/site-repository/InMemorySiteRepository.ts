import { NonFricheSite } from "src/sites/domain/models/site";
import { SiteRepository } from "src/sites/domain/usecases/createNewSite.usecase";

export class InMemorySiteRepository implements SiteRepository {
  private sites: NonFricheSite[] = [];

  async save(site: NonFricheSite) {
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

  _setSites(sites: NonFricheSite[]) {
    this.sites = sites;
  }
}
