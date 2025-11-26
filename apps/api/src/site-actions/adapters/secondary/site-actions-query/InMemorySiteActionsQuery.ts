import type { SiteActionsQuery } from "src/site-actions/core/gateways/SiteActionsQuery";
import type { SiteAction } from "src/site-actions/core/models/siteAction";

export class InMemorySiteActionsQuery implements SiteActionsQuery {
  private siteActionsMap: Map<string, SiteAction[]> = new Map();

  constructor(siteActions: SiteAction[] = []) {
    this._setSiteActions(siteActions);
  }

  getBySiteId(siteId: string): Promise<SiteAction[]> {
    return Promise.resolve(this.siteActionsMap.get(siteId) ?? []);
  }

  _setSiteActions(actions: SiteAction[]): void {
    this.siteActionsMap.clear();
    for (const action of actions) {
      const existing = this.siteActionsMap.get(action.siteId) ?? [];
      this.siteActionsMap.set(action.siteId, [...existing, action]);
    }
  }
}
