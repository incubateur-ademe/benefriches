import { createSelector } from "@reduxjs/toolkit";

import { selectCurrentStep, type SiteCreationStep } from "../createSite.reducer";
import { siteCreationLens } from "../siteForm.lens";

/**
 * Kept in its own module (ticket 11): `selectCurrentStep` lives on `createSite.reducer.ts`, so
 * importing it from `createSite.selectors.ts` would create a module cycle — `createSite.reducer
 * .ts` pulls in the custom/urban-zone reducers, which pull in the per-step selector files, which
 * (post ticket 10/11) read the lens-parameterised root selector bundle from `createSite.selectors
 * .ts`. This view is inherently creation-only (`SiteCreationWizard.tsx`'s pre-engine steps have
 * no update-flow equivalent), so it never needed to live in the shared lens-parameterised bundle
 * in the first place.
 */
type SiteCreationWizardViewData = {
  currentStep: SiteCreationStep;
  isFriche: boolean | undefined;
  createMode: "express" | "custom" | undefined;
};

export const selectSiteCreationWizardViewData = createSelector(
  selectCurrentStep,
  siteCreationLens.selectSiteForm,
  (currentStep, siteCreation): SiteCreationWizardViewData => ({
    currentStep,
    isFriche: siteCreation.isFriche,
    createMode: siteCreation.createMode,
  }),
);
