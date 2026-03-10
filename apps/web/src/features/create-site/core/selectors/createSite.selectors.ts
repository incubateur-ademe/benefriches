import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature, SoilType, SoilsDistribution } from "shared";
import { SurfaceAreaDistribution, typedObjectEntries } from "shared";

import { RootState } from "@/app/store/store";

import { selectCurrentStep, type SiteCreationStep } from "../createSite.reducer";
import { getSelectedParcelTypes, ReadStateHelper } from "../urban-zone/helpers/stateHelpers";
import { getParcelStepIds } from "../urban-zone/steps/per-parcel-soils/parcelStepMapping";

const selectSelf = (state: RootState) => state.siteCreation;

export const selectSiteAddress = createSelector(
  selectSelf,
  (state): Address | undefined => state.siteData.address,
);

export const selectSiteSoilsDistribution = createSelector(
  selectSelf,
  (state): SoilsDistribution => {
    if (state.siteData.nature === "URBAN_ZONE") {
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
    return state.siteData.soilsDistribution ?? {};
  },
);

export const selectFricheActivity = createSelector(
  selectSelf,
  (state) => state.siteData.fricheActivity,
);

export const selectSiteSurfaceArea = createSelector(
  selectSelf,
  (state) => state.siteData.surfaceArea,
);

export const selectSiteNature = createSelector(
  selectSelf,
  (state): SiteNature | undefined => state.siteData.nature,
);

export const selectSiteSoils = createSelector(
  selectSelf,
  (state): SoilType[] | undefined => state.siteData.soils,
);

export const selectSiteSoilsContamination = createSelector(selectSelf, (state) => {
  return {
    hasContaminatedSoils: state.siteData.hasContaminatedSoils,
    contaminatedSoilSurface: state.siteData.contaminatedSoilSurface,
  };
});

export const selectSiteAccidentsData = createSelector(selectSelf, (state) => {
  return {
    hasRecentAccidents: state.siteData.hasRecentAccidents,
    accidentsMinorInjuries: state.siteData.accidentsMinorInjuries,
    accidentsSevereInjuries: state.siteData.accidentsSevereInjuries,
    accidentsDeaths: state.siteData.accidentsDeaths,
  };
});

export const selectSurfaceAreaInputMode = createSelector(
  selectSelf,
  (state) => state.surfaceAreaInputMode,
);

export const selectSiteOwner = createSelector(selectSelf, (state) => state.siteData.owner);

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
    isFriche: siteCreation.siteData.isFriche,
    createMode: siteCreation.createMode,
  }),
);
