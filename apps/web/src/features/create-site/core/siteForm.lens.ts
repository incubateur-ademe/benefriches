import { RootState } from "@/app/store/store";

import { SiteCreationState } from "./createSite.reducer";

/**
 * Function lens (not the project side's `entityName` string key): there is no `state.siteUpdate`
 * key in `RootState` yet, so a string key would not typecheck here. The update flow (tickets
 * 10/11) instantiates a second lens with `selectSiteForm: (state) => state.siteUpdate`.
 */
export type SiteFormLens = {
  selectSiteForm: (state: RootState) => SiteCreationState;
};

export const siteCreationLens: SiteFormLens = {
  selectSiteForm: (state) => state.siteCreation,
};
