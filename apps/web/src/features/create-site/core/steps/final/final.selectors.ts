import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../selectors/createSite.selectors";
import { siteCreationLens, type SiteFormLens } from "../../siteForm.lens";

// Creation Result ViewData
type SiteCreationResultViewData = {
  siteId: string;
  siteName: string;
  loadingState: "idle" | "loading" | "success" | "error";
};

// Express Result ViewData
type ExpressResultViewData = {
  siteId: string;
  saveLoadingState: "idle" | "loading" | "success" | "error";
};

/**
 * Only `selectSiteCreationResultViewData` is exposed through the flow-agnostic factory: it's the
 * only leaf here consumed by the shared `customStepToComponent` map (CREATION_RESULT). Its
 * `selectSelf` now goes through `lens` instead of reading `state.siteCreation` directly.
 * `selectExpressResultViewData` stays creation-only (the express flow has no update-flow
 * equivalent) and is kept as a plain export off the creation lens.
 */
export const createFinalSelectors = (
  lens: SiteFormLens,
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectSelf = lens.selectSiteForm;

  const selectSiteCreationResultViewData = createSelector(
    [selectSelf, rootSelectors.selectDerivedSiteData],
    (siteForm, siteData): SiteCreationResultViewData => ({
      siteId: siteData.id,
      siteName: siteData.name ?? "",
      loadingState: siteForm.saveLoadingState,
    }),
  );

  return { selectSiteCreationResultViewData };
};

export const { selectSiteCreationResultViewData } = createFinalSelectors(
  siteCreationLens,
  siteCreationRootSelectors,
);

export const selectExpressResultViewData = createSelector(
  siteCreationLens.selectSiteForm,
  (siteCreation): ExpressResultViewData => ({
    siteId: siteCreation.initialSiteData.id,
    saveLoadingState: siteCreation.saveLoadingState,
  }),
);
