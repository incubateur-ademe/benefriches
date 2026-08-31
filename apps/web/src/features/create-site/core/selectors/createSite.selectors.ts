import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature, SoilType, SoilsDistribution } from "shared";
import { SurfaceAreaDistribution, typedObjectEntries } from "shared";

import { RootState } from "@/app/store/store";

import { selectCurrentStep, type SiteCreationStep } from "../createSite.reducer";
import { deriveSiteDataFromCustomSteps } from "../custom/customSteps";
import type { SiteCreationData } from "../siteFoncier.types";
import { getSelectedParcelTypes, ReadStateHelper } from "../urban-zone/stateHelpers";
import { getParcelStepIds } from "../urban-zone/steps/per-parcel-soils/parcelStepMapping";

const selectSelf = (state: RootState) => state.siteCreation;

/**
 * The custom flow's `SiteCreationData`, folded from the per-step answers map plus the
 * pre-engine-set `isFriche`/`nature` fields (see custom/customSteps.ts). This is the single
 * choke point every other selector below reads `siteData`-shaped fields through — no selector
 * or view should read `state.siteCreation.custom.steps` or `initialSiteData` directly.
 */
export const selectDerivedSiteData = createSelector(
  selectSelf,
  (state): SiteCreationData =>
    deriveSiteDataFromCustomSteps(
      { ...state.initialSiteData, isFriche: state.isFriche, nature: state.nature },
      state.custom.steps,
    ),
);

export const selectSiteAddress = createSelector(
  selectDerivedSiteData,
  (siteData): Address | undefined => siteData.address,
);

export const selectSiteSoilsDistribution = createSelector(
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

export const selectFricheActivity = createSelector(
  selectDerivedSiteData,
  (siteData) => siteData.fricheActivity,
);

export const selectSiteSurfaceArea = createSelector(
  selectDerivedSiteData,
  (siteData) => siteData.surfaceArea,
);

export const selectSiteNature = createSelector(
  selectDerivedSiteData,
  (siteData): SiteNature | undefined => siteData.nature,
);

export const selectSiteSoils = createSelector(
  selectDerivedSiteData,
  (siteData): SoilType[] | undefined => siteData.soils,
);

export const selectSiteSoilsContamination = createSelector(selectDerivedSiteData, (siteData) => {
  return {
    hasContaminatedSoils: siteData.hasContaminatedSoils,
    contaminatedSoilSurface: siteData.contaminatedSoilSurface,
  };
});

export const selectSiteAccidentsData = createSelector(selectDerivedSiteData, (siteData) => {
  return {
    hasRecentAccidents: siteData.hasRecentAccidents,
    accidentsMinorInjuries: siteData.accidentsMinorInjuries,
    accidentsSevereInjuries: siteData.accidentsSevereInjuries,
    accidentsDeaths: siteData.accidentsDeaths,
  };
});

export const selectSurfaceAreaInputMode = createSelector(
  selectSelf,
  (state) => state.surfaceAreaInputMode,
);

export const selectSiteOwner = createSelector(selectDerivedSiteData, (siteData) => siteData.owner);

export const selectCreateMode = createSelector(
  selectSelf,
  (state): "express" | "custom" | undefined => state.createMode,
);

type ExpressAddressFormViewData = {
  address: Address | undefined;
  siteNature: SiteNature | undefined;
};

export const selectExpressAddressFormViewData = createSelector(
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

export const selectSiteCreationWizardViewData = createSelector(
  selectCurrentStep,
  selectSelf,
  (currentStep, siteCreation): SiteCreationWizardViewData => ({
    currentStep,
    isFriche: siteCreation.isFriche,
    createMode: siteCreation.createMode,
  }),
);
