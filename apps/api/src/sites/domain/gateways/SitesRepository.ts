import { Site } from "../models/site";
import { SiteViewModel } from "../usecases/getSiteById.usecase";

export interface SitesRepository {
  save(site: Site): Promise<void>;
  existsWithId(siteId: Site["id"]): Promise<boolean>;
  getById(siteId: Site["id"]): Promise<SiteViewModel | undefined>;
}
