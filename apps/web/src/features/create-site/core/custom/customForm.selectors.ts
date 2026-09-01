import { createSelector } from "@reduxjs/toolkit";

import {
  selectDerivedSiteData,
  selectFricheActivity,
  selectSiteAccidentsData,
  selectSiteNature,
  selectSurfaceAreaInputMode,
} from "../selectors/createSite.selectors";
import type { SiteFormLens } from "../siteForm.lens";
import { siteCreationLens } from "../siteForm.lens";
import { selectAddressFormViewData } from "../steps/address/address.selectors";
import { selectSoilContaminationFormViewData } from "../steps/contamination-and-accidents/contaminationAndAccidents.selectors";
import { selectSiteCreationResultViewData } from "../steps/final/final.selectors";
import {
  selectIsSiteOperatedFormViewData,
  selectSiteOperatorFormViewData,
  selectSiteOwnerFormViewData,
  selectSiteTenantFormViewData,
  selectSiteYearlyExpensesViewData,
  selectYearlyIncomeFormViewData,
} from "../steps/site-management/siteManagement.selectors";
import {
  selectSiteSoilsDistributionViewData,
  selectSiteSoilsSummaryViewData,
  selectSiteSurfaceAreaFormViewData,
  selectSpacesSelectionFormViewData,
} from "../steps/spaces/spaces.selectors";
import { selectUrbanZoneTypeViewData } from "../steps/urban-zone/urbanZoneType.selectors";
import type { SiteCreationCustomStep } from "./customSteps";

/**
 * The custom flow's selector bundle, mirroring `createUrbanProjectFormSelectors` on the project
 * side. Deviation from the ticket's plan: the leaf ViewData selectors above (address, spaces,
 * site-management, ...) are NOT individually lens-parameterised in this ticket — they still read
 * `state.siteCreation` through the root-selector re-exports. Only `selectCurrentStep` (this
 * bundle's flow-local piece, gated on nothing but `custom.currentStep`) is derived from the
 * injected lens. There is exactly one instance of this bundle today
 * (`creationCustomFormSelectors`, built from `siteCreationLens`), so this is behaviourally
 * identical to full parameterisation; the update flow (tickets 10/11) will need to convert the
 * specific leaf selectors it reuses into lens-aware factories at that point — a natural
 * incremental extension of the pattern established here, not a redo of it.
 *
 * Every step container consumes these selectors through `useCustomSiteForm()` (this bundle,
 * exposed on `CustomSiteFormContextValue`) rather than importing the selector modules directly —
 * so once the leaf selectors above are converted to lens-aware factories, every consumer picks up
 * the fix here, with no per-container changes required.
 */
export const createCustomFormSelectors = (lens: SiteFormLens) => {
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

  return {
    selectCurrentStep,
    selectPendingStepCompletion,
    selectDerivedSiteData,
    selectFricheActivity,
    selectSiteNature,
    selectSiteAccidentsData,
    selectSurfaceAreaInputMode,
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
