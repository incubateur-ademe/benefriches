import { SitesQuery } from "src/sites/core/gateways/SitesQuery";
import { SiteFeaturesView, SiteView } from "src/sites/core/models/views";

export class InMemorySitesQuery implements SitesQuery {
  sites: SiteFeaturesView[] = [];
  sitesWithProjects: SiteView[] = [];

  _setSites(sites: SiteFeaturesView[]) {
    this.sites = sites;
  }

  _setSitesWithProjects(sitesWithProjects: SiteView[]) {
    this.sitesWithProjects = sitesWithProjects;
  }

  getSiteFeaturesById(siteId: string): Promise<SiteFeaturesView | undefined> {
    return Promise.resolve(this.sites.find(({ id }) => id === siteId));
  }

  getViewById(siteId: string): Promise<SiteView | undefined> {
    return Promise.resolve(this.sitesWithProjects.find(({ id }) => id === siteId));
  }
}
