import { SiteEntity } from "../models/siteEntity";

export interface SitesRepository {
  save(site: SiteEntity): Promise<void>;
  existsWithId(siteId: SiteEntity["id"]): Promise<boolean>;
  getCreatedById(siteId: SiteEntity["id"]): Promise<string | undefined>;
  patch(
    siteId: string,
    { status, updatedAt }: { status: "active" | "archived"; updatedAt: Date },
  ): Promise<void>;
}
