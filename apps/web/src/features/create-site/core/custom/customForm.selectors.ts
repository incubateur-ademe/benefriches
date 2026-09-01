import { createSelector } from "@reduxjs/toolkit";

import { createSiteFormRootSelectors } from "../selectors/createSite.selectors";
import type { SiteFormLens } from "../siteForm.lens";
import { siteCreationLens } from "../siteForm.lens";
import { createAddressSelectors } from "../steps/address/address.selectors";
import { createContaminationAndAccidentsSelectors } from "../steps/contamination-and-accidents/contaminationAndAccidents.selectors";
import { createFinalSelectors } from "../steps/final/final.selectors";
import { createSiteManagementSelectors } from "../steps/site-management/siteManagement.selectors";
import { createSpacesSelectors } from "../steps/spaces/spaces.selectors";
import { createUrbanZoneTypeSelectors } from "../steps/urban-zone/urbanZoneType.selectors";
import { computeCustomStepperGroups, type CustomStepperGroup } from "./customStepperConfig";
import type { SiteCreationCustomStep } from "./customSteps";

/**
 * The custom flow's selector bundle, mirroring `createUrbanProjectFormSelectors` on the project
 * side. Fully lens-parameterised (ticket 10): the whole bundle — including every leaf ViewData
 * selector reused from `steps/**` — is built from `createSiteFormRootSelectors(lens)` plus the
 * step-local factories, so a second instance (the update flow's `siteUpdateLens`) resolves its
 * own flow's data end to end, not creation's.
 *
 * Every step container consumes these selectors through `useCustomSiteForm()` (this bundle,
 * exposed on `CustomSiteFormContextValue`) rather than importing the selector modules directly.
 */
export const createCustomFormSelectors = (lens: SiteFormLens) => {
  const rootSelectors = createSiteFormRootSelectors(lens);
  const { selectAddressFormViewData } = createAddressSelectors(rootSelectors);
  const { selectSoilContaminationFormViewData } =
    createContaminationAndAccidentsSelectors(rootSelectors);
  const { selectSiteCreationResultViewData } = createFinalSelectors(lens, rootSelectors);
  const {
    selectSiteOwnerFormViewData,
    selectSiteTenantFormViewData,
    selectSiteOperatorFormViewData,
    selectIsSiteOperatedFormViewData,
    selectSiteYearlyExpensesViewData,
    selectYearlyIncomeFormViewData,
  } = createSiteManagementSelectors(rootSelectors);
  const {
    selectSiteSoilsDistributionViewData,
    selectSiteSoilsSummaryViewData,
    selectSiteSurfaceAreaFormViewData,
    selectSpacesSelectionFormViewData,
  } = createSpacesSelectors(rootSelectors);
  const { selectUrbanZoneTypeViewData } = createUrbanZoneTypeSelectors(rootSelectors);

  const selectCurrentStep = createSelector(
    lens.selectSiteForm,
    (state): SiteCreationCustomStep => state.custom.currentStep,
  );

  // Exposes the engine's parked cascading changes (see customForm.reducer.ts) so a view can
  // render a confirmation dialog before an address change discards a stakeholder answer.
  const selectPendingStepCompletion = createSelector(
    lens.selectSiteForm,
    (state) => state.custom.pendingStepCompletion,
  );

  const selectSaveState = createSelector(lens.selectSiteForm, (state) => state.custom.saveState);

  const selectCustomStepperGroups = createSelector(
    lens.selectSiteForm,
    (state): CustomStepperGroup[] =>
      computeCustomStepperGroups({
        currentStep: state.custom.currentStep,
        steps: state.custom.steps,
        stepsSequence: state.custom.stepsSequence,
      }),
  );

  return {
    selectCurrentStep,
    selectPendingStepCompletion,
    selectCustomStepperGroups,
    selectSaveState,
    selectDerivedSiteData: rootSelectors.selectDerivedSiteData,
    selectFricheActivity: rootSelectors.selectFricheActivity,
    selectSiteNature: rootSelectors.selectSiteNature,
    selectSiteAccidentsData: rootSelectors.selectSiteAccidentsData,
    selectSurfaceAreaInputMode: rootSelectors.selectSurfaceAreaInputMode,
    selectAddressFormViewData,
    selectSoilContaminationFormViewData,
    selectSiteCreationResultViewData,
    selectSiteOwnerFormViewData,
    selectSiteTenantFormViewData,
    selectSiteOperatorFormViewData,
    selectIsSiteOperatedFormViewData,
    selectSiteYearlyExpensesViewData,
    selectYearlyIncomeFormViewData,
    selectSiteSoilsDistributionViewData,
    selectSiteSoilsSummaryViewData,
    selectSiteSurfaceAreaFormViewData,
    selectSpacesSelectionFormViewData,
    selectUrbanZoneTypeViewData,
  };
};

export const creationCustomFormSelectors = createCustomFormSelectors(siteCreationLens);
