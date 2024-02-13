import { Site } from "../models/site";

export interface SitesRepository {
  save(site: Site): Promise<void>;
  existsWithId(siteId: Site["id"]): Promise<boolean>;
}
