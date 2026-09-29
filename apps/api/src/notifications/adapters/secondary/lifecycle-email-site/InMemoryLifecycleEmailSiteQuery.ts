import type {
  LifecycleEmailSite,
  LifecycleEmailSiteQuery,
} from "src/notifications/core/gateways/LifecycleEmailSiteQuery";

export class InMemoryLifecycleEmailSiteQuery implements LifecycleEmailSiteQuery {
  private sites: LifecycleEmailSite[] = [];

  _setSites(sites: LifecycleEmailSite[]): void {
    this.sites = sites;
  }

  getById(siteId: string): Promise<LifecycleEmailSite | undefined> {
    return Promise.resolve(this.sites.find((site) => site.id === siteId));
  }
}
