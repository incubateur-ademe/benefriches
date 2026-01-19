import { SitesQuery, SiteSurfaceAreaAndCityCode } from "src/sites/core/gateways/SitesQuery";
import { SiteFeaturesView, SiteView } from "src/sites/core/models/views";

export class InMemorySitesQuery implements SitesQuery {
  sites: SiteFeaturesView[] = [];
  sitesWithProjects: SiteView[] = [];
  mutafrichesIds: Map<string, string | null> = new Map();
  siteSurfaceAreaAndCityCodes: Map<string, SiteSurfaceAreaAndCityCode> = new Map();

  _setSites(sites: SiteFeaturesView[]) {
    this.sites = sites;
  }

  _setSitesWithProjects(sitesWithProjects: SiteView[]) {
    this.sitesWithProjects = sitesWithProjects;
  }

  _setMutafrichesId(siteId: string, mutafrichesId: string | null) {
    this.mutafrichesIds.set(siteId, mutafrichesId);
  }

  _setSiteSurfaceAreaAndCityCode(siteId: string, data: SiteSurfaceAreaAndCityCode) {
    this.siteSurfaceAreaAndCityCodes.set(siteId, data);
  }

  getSiteFeaturesById(siteId: string): Promise<SiteFeaturesView | undefined> {
    return Promise.resolve(this.sites.find(({ id }) => id === siteId));
  }

  getViewById(siteId: string): Promise<SiteView | undefined> {
    return Promise.resolve(this.sitesWithProjects.find(({ id }) => id === siteId));
  }

  getMutafrichesIdBySiteId(siteId: string): Promise<string | null> {
    return Promise.resolve(this.mutafrichesIds.get(siteId) ?? null);
  }

  getSiteSurfaceAreaAndCityCode(siteId: string): Promise<SiteSurfaceAreaAndCityCode | undefined> {
    return Promise.resolve(this.siteSurfaceAreaAndCityCodes.get(siteId));
  }
}
