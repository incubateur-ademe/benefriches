import { SiteMetadata, SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { SiteEntity } from "src/sites/core/models/siteEntity";

export class InMemorySitesRepository implements SitesRepository {
  private sites: SiteEntity[] = [];
  private sitesWithActiveReconversionProjects = new Set<string>();

  async save(site: SiteEntity) {
    this.sites.push(site);
    await Promise.resolve();
  }

  async update(site: SiteEntity) {
    const existing = this.sites.find(({ id }) => id === site.id);
    if (!existing) {
      throw new Error("InMemorySitesRepository > update: site not found");
    }
    this.sites = this.sites.map((existingSite) =>
      existingSite.id === site.id ? site : existingSite,
    );
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

  getMetadataById(siteId: string): Promise<SiteMetadata | undefined> {
    const foundSite = this.sites.find(({ id }) => id === siteId);
    if (!foundSite) return Promise.resolve(undefined);
    const { nature, createdBy, creationMode, createdAt, status } = foundSite;
    return Promise.resolve({ nature, createdBy, creationMode, createdAt, status });
  }

  hasActiveReconversionProject(siteId: string): Promise<boolean> {
    return Promise.resolve(this.sitesWithActiveReconversionProjects.has(siteId));
  }

  _getSites() {
    return this.sites;
  }

  _setSites(sites: SiteEntity[]) {
    this.sites = sites;
  }

  _setSitesWithActiveReconversionProjects(siteIds: string[]) {
    this.sitesWithActiveReconversionProjects = new Set(siteIds);
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
