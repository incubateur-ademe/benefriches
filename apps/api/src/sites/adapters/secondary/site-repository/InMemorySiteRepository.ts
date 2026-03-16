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

  getCreatedById(siteId: string): Promise<string | undefined> {
    const foundSite = this.sites.find(({ id }) => id === siteId);
    return Promise.resolve(foundSite?.createdBy);
  }

  _getSites() {
    return this.sites;
  }

  _setSites(sites: SiteEntity[]) {
    this.sites = sites;
  }

  async patch(
    siteId: string,
    { status, updatedAt }: { status: "active" | "archived"; updatedAt: Date },
  ) {
    const existing = this.sites.find(({ id }) => id === siteId);
    if (!existing) {
      throw new Error("InMemorySitesRepository > patch: site not found");
    }
    this.sites = this.sites.filter(({ id }) => id !== siteId);
    this.sites.push({ ...existing, status, updatedAt });
    await Promise.resolve();
  }
}
