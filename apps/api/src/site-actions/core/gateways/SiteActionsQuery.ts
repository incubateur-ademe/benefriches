import type { SiteAction } from "../models/siteAction";

export interface SiteActionsQuery {
  getBySiteId(siteId: string): Promise<SiteAction[]>;
}
