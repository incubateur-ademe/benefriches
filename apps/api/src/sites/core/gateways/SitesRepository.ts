import { SiteEntity } from "../models/siteEntity";

export type SiteMetadata = Pick<
  SiteEntity,
  "nature" | "createdBy" | "creationMode" | "createdAt" | "status"
>;

export interface SitesRepository {
  save(site: SiteEntity): Promise<void>;
  update(site: SiteEntity): Promise<void>;
  existsWithId(siteId: SiteEntity["id"]): Promise<boolean>;
  getCreatedById(siteId: SiteEntity["id"]): Promise<string | undefined>;
  getMetadataById(siteId: SiteEntity["id"]): Promise<SiteMetadata | undefined>;
  hasActiveReconversionProject(siteId: SiteEntity["id"]): Promise<boolean>;
  patch(
    siteId: string,
    { status, updatedAt }: { status: "active" | "archived"; updatedAt: Date },
  ): Promise<void>;
}
