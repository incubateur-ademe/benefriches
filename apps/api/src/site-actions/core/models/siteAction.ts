import type { SiteActionStatus, SiteActionType } from "shared";

export type SiteAction = {
  id: string;
  siteId: string;
  actionType: SiteActionType;
  status: SiteActionStatus;
  createdAt: Date;
  completedAt?: Date;
};
