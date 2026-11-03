import type { SiteFeatures, SiteView } from "../site.types";

export interface SiteGateway {
  getSiteFeatures(siteId: string): Promise<SiteFeatures>;
  // Resolves to undefined when no site has this id (unknown or malformed id).
  getSiteView(siteId: string): Promise<SiteView | undefined>;
}
