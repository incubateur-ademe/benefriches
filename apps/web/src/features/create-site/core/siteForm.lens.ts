import { RootState } from "@/app/store/store";

import { SiteCreationState } from "./createSite.reducer";

/**
 * Function lens (not the project side's `entityName` string key). `SiteFormLens` is typed
 * against `SiteCreationState` itself (not a generic host-state constraint) — both `state
 * .siteCreation` and `state.siteUpdate` (a structural superset, see
 * features/update-site/core/updateSite.reducer.ts) satisfy it.
 */
export type SiteFormLens = {
  selectSiteForm: (state: RootState) => SiteCreationState;
};

export const siteCreationLens: SiteFormLens = {
  selectSiteForm: (state) => state.siteCreation,
};

// The update flow's lens (ticket 10): same engine, same handlers/selectors, distinct sub-state.
export const siteUpdateLens: SiteFormLens = {
  selectSiteForm: (state) => state.siteUpdate,
};
