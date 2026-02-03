import type { SiteFeatures, SiteView } from "../site.types";

export interface SiteGateway {
  getSiteFeatures(siteId: string): Promise<SiteFeatures>;
  getSiteView(siteId: string): Promise<SiteView>;
}
