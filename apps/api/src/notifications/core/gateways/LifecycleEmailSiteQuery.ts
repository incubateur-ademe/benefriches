import type { SiteNature } from "shared";

// The fields a site-scoped lifecycle email needs: the name for the subject, the nature for
// the wording.
export type LifecycleEmailSite = {
  id: string;
  name: string;
  nature: SiteNature;
};

// Used by the retry sweeper, which only has the ledger row (related_entity_id = site id).
export interface LifecycleEmailSiteQuery {
  getById(siteId: string): Promise<LifecycleEmailSite | undefined>;
}
