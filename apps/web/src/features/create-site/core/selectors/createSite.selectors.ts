import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature, SoilType, SoilsDistribution } from "shared";
import { SurfaceAreaDistribution, typedObjectEntries } from "shared";

import { selectCurrentStep, type SiteCreationStep } from "../createSite.reducer";
import { deriveSiteDataFromCustomSteps } from "../custom/customSteps";
import type { SiteCreationData } from "../siteFoncier.types";
import { siteCreationLens, type SiteFormLens } from "../siteForm.lens";
import { getSelectedParcelTypes, ReadStateHelper } from "../urban-zone/stateHelpers";
import { getParcelStepIds } from "../urban-zone/steps/per-parcel-soils/parcelStepMapping";

/**
 * Lens-parameterised root selector bundle — the single choke point every other create-site
 * selector should read the flow's site data through. `selectCurrentStep` is NOT included here:
 * it lives on `createSite.reducer.ts` and is creation-specific (gates on
 * `createMode`/`customFlowStarted`); each per-flow bundle (custom/urban-zone/demo) exposes its
 * own flow-local `selectCurrentStep` instead (see e.g. `core/custom/customForm.selectors.ts`).
 */
export const createSiteFormRootSelectors = (lens: SiteFormLens) => {
  const selectSelf = lens.selectSiteForm;

  /**
   * The custom flow's `SiteCreationData`, folded from the per-step answers map plus the
   * pre-engine-set `isFriche`/`nature` fields (see custom/customSteps.ts). This is the single
   * choke point every other selector below reads `siteData`-shaped fields through — no selector
   * or view should read `state.siteCreation.custom.steps` or `initialSiteData` directly.
   */
  const selectDerivedSiteData = createSelector(
    selectSelf,
    (state): SiteCreationData =>
      deriveSiteDataFromCustomSteps(
        { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
        state.custom.steps,
      ),
  );

  const selectSiteAddress = createSelector(
    selectDerivedSiteData,
    (siteData): Address | undefined => siteData.address,
  );

  const selectSiteSoilsDistribution = createSelector(
    selectSelf,
    selectDerivedSiteData,
    (state, siteData): SoilsDistribution => {
      if (siteData.nature === "URBAN_ZONE") {
        const aggregated = new SurfaceAreaDistribution<SoilType>();
        for (const parcelType of getSelectedParcelTypes(state.urbanZone.steps)) {
          const stepId = getParcelStepIds(parcelType).soilsDistribution;
          const stepAnswers = ReadStateHelper.getStepAnswers(state.urbanZone.steps, stepId);
          const soilsDistribution = (
            stepAnswers as { soilsDistribution?: SoilsDistribution } | undefined
          )?.soilsDistribution;
          if (soilsDistribution) {
            for (const [soilType, area] of typedObjectEntries(soilsDistribution)) {
              aggregated.addSurface(soilType, area ?? 0);
            }
          }
        }
        return aggregated.toJSON();
      }
      return siteData.soilsDistribution ?? {};
    },
  );

  const selectFricheActivity = createSelector(
    selectDerivedSiteData,
    (siteData) => siteData.fricheActivity,
  );

  const selectSiteSurfaceArea = createSelector(
    selectDerivedSiteData,
    (siteData) => siteData.surfaceArea,
  );

  const selectSiteNature = createSelector(
    selectDerivedSiteData,
    (siteData): SiteNature | undefined => siteData.nature,
  );

  const selectSiteSoils = createSelector(
    selectDerivedSiteData,
    (siteData): SoilType[] | undefined => siteData.soils,
  );

  const selectSiteSoilsContamination = createSelector(selectDerivedSiteData, (siteData) => {
    return {
      hasContaminatedSoils: siteData.hasContaminatedSoils,
      contaminatedSoilSurface: siteData.contaminatedSoilSurface,
    };
  });

  const selectSiteAccidentsData = createSelector(selectDerivedSiteData, (siteData) => {
    return {
      hasRecentAccidents: siteData.hasRecentAccidents,
      accidentsMinorInjuries: siteData.accidentsMinorInjuries,
      accidentsSevereInjuries: siteData.accidentsSevereInjuries,
      accidentsDeaths: siteData.accidentsDeaths,
    };
  });

  const selectSurfaceAreaInputMode = createSelector(
    selectSelf,
    (state) => state.surfaceAreaInputMode,
  );

  const selectSiteOwner = createSelector(selectDerivedSiteData, (siteData) => siteData.owner);

  const selectCreateMode = createSelector(
    selectSelf,
    (state): "express" | "custom" | undefined => state.createMode,
  );

  type ExpressAddressFormViewData = {
    address: Address | undefined;
    siteNature: SiteNature | undefined;
  };

  const selectExpressAddressFormViewData = createSelector(
    selectSiteAddress,
    selectSiteNature,
    (address, siteNature): ExpressAddressFormViewData => ({
      address,
      siteNature,
    }),
  );

  type SiteCreationWizardViewData = {
    currentStep: SiteCreationStep;
    isFriche: boolean | undefined;
    createMode: "express" | "custom" | undefined;
  };

  // `selectCurrentStep` here is the creation-specific one from createSite.reducer.ts — kept only
  // for this wizard-chrome view (SiteCreationWizard.tsx), which is inherently a creation-only
  // component (the pre-engine steps it renders have no update-flow equivalent).
  const selectSiteCreationWizardViewData = createSelector(
    selectCurrentStep,
    selectSelf,
    (currentStep, siteCreation): SiteCreationWizardViewData => ({
      currentStep,
      isFriche: siteCreation.isFriche,
      createMode: siteCreation.createMode,
    }),
  );

  return {
    selectDerivedSiteData,
    selectSiteAddress,
    selectSiteSoilsDistribution,
    selectFricheActivity,
    selectSiteSurfaceArea,
    selectSiteNature,
    selectSiteSoils,
    selectSiteSoilsContamination,
    selectSiteAccidentsData,
    selectSurfaceAreaInputMode,
    selectSiteOwner,
    selectCreateMode,
    selectExpressAddressFormViewData,
    selectSiteCreationWizardViewData,
  };
};

export const siteCreationRootSelectors = createSiteFormRootSelectors(siteCreationLens);

export const selectDerivedSiteData = siteCreationRootSelectors.selectDerivedSiteData;
export const selectSiteAddress = siteCreationRootSelectors.selectSiteAddress;
export const selectSiteSoilsDistribution = siteCreationRootSelectors.selectSiteSoilsDistribution;
export const selectFricheActivity = siteCreationRootSelectors.selectFricheActivity;
export const selectSiteSurfaceArea = siteCreationRootSelectors.selectSiteSurfaceArea;
export const selectSiteNature = siteCreationRootSelectors.selectSiteNature;
export const selectSiteSoils = siteCreationRootSelectors.selectSiteSoils;
export const selectSiteSoilsContamination = siteCreationRootSelectors.selectSiteSoilsContamination;
export const selectSiteAccidentsData = siteCreationRootSelectors.selectSiteAccidentsData;
export const selectSurfaceAreaInputMode = siteCreationRootSelectors.selectSurfaceAreaInputMode;
export const selectSiteOwner = siteCreationRootSelectors.selectSiteOwner;
export const selectCreateMode = siteCreationRootSelectors.selectCreateMode;
export const selectExpressAddressFormViewData =
  siteCreationRootSelectors.selectExpressAddressFormViewData;
export const selectSiteCreationWizardViewData =
  siteCreationRootSelectors.selectSiteCreationWizardViewData;
