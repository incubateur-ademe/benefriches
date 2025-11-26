import type { SiteActionsRepository } from "src/site-actions/core/gateways/SiteActionsRepository";
import type { SiteAction } from "src/site-actions/core/models/siteAction";

export class InMemorySiteActionsRepository implements SiteActionsRepository {
  private siteActions: SiteAction[] = [];

  async save(actions: SiteAction[]): Promise<void> {
    this.siteActions.push(...actions);
    await Promise.resolve();
  }

  async updateStatus(params: {
    siteId: string;
    actionType: SiteAction["actionType"];
    status: SiteAction["status"];
    completedAt?: Date;
  }): Promise<void> {
    const action = this.siteActions.find(
      (a) => a.siteId === params.siteId && a.actionType === params.actionType,
    );
    if (!action) {
      throw new Error("InMemorySiteActionsRepository > updateStatus: site action not found");
    }
    action.status = params.status;
    if (params.completedAt) {
      action.completedAt = params.completedAt;
    }
    await Promise.resolve();
  }

  _getSiteActions(): SiteAction[] {
    return this.siteActions;
  }

  _setSiteActions(actions: SiteAction[]): void {
    this.siteActions = actions;
  }
}
