import { SiteViewModel } from "../usecases/getSiteById.usecase";

export interface SitesQuery {
  getById(siteId: SiteViewModel["id"]): Promise<SiteViewModel | undefined>;
}
