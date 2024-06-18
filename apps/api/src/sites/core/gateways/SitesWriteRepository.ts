import { Site } from "../models/site";

export interface SitesWriteRepository {
  save(site: Site): Promise<void>;
  existsWithId(siteId: Site["id"]): Promise<boolean>;
}
