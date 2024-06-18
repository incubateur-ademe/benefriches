import { SiteViewModel } from "../usecases/getSiteById.usecase";

export interface SitesReadRepository {
  getById(siteId: SiteViewModel["id"]): Promise<SiteViewModel | undefined>;
}
