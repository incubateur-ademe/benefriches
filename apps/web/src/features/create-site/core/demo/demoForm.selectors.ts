import { createSelector } from "@reduxjs/toolkit";

import type { SiteFormLens } from "../siteForm.lens";
import { siteCreationLens } from "../siteForm.lens";
import type { DemoSiteCreationStep } from "./demoSteps";
import { selectSiteAddressViewData } from "./steps/address/address.selectors";
import { selectDemoSiteCreationResultViewData } from "./steps/creation-result/creationResult.selectors";
import { selectSiteActivityViewData } from "./steps/site-activity/siteActivity.selectors";
import { selectSiteNatureViewData } from "./steps/site-nature/siteNature.selectors";
import { selectSiteSurfaceAreaFormViewData } from "./steps/surface-area/surfaceArea.selectors";

/**
 * The demo (express) flow's selector bundle. See `core/custom/customForm.selectors.ts` for the
 * same deviation note on leaf ViewData selectors staying singleton-bound for now.
 */
export const createDemoFormSelectors = (lens: SiteFormLens) => {
  const selectCurrentStep = createSelector(
    lens.selectSiteForm,
    (state): DemoSiteCreationStep => state.demo.currentStep,
  );

  const selectSaveState = createSelector(lens.selectSiteForm, (state) => state.demo.saveState);

  return {
    selectCurrentStep,
    selectSaveState,
    selectDemoSiteCreationResultViewData,
    selectSiteAddressViewData,
    selectSiteActivityViewData,
    selectSiteNatureViewData,
    selectSiteSurfaceAreaFormViewData,
  };
};

export const creationDemoFormSelectors = createDemoFormSelectors(siteCreationLens);
