import { SiteEntity } from "../models/site";

export interface SitesRepository {
  save(site: SiteEntity): Promise<void>;
  existsWithId(siteId: SiteEntity["id"]): Promise<boolean>;
}
