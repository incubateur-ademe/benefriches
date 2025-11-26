import type { SiteAction } from "../models/siteAction";

export interface SiteActionsRepository {
  save(actions: SiteAction[]): Promise<void>;
  updateStatus(params: {
    siteId: string;
    actionType: SiteAction["actionType"];
    status: SiteAction["status"];
    completedAt?: Date;
  }): Promise<void>;
}
