import { SiteEntity } from "../models/siteEntity";

export interface SitesRepository {
  save(site: SiteEntity): Promise<void>;
  existsWithId(siteId: SiteEntity["id"]): Promise<boolean>;
}
