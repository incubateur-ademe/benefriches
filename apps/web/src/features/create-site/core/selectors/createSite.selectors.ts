import { createSelector } from "@reduxjs/toolkit";
import { Address, SoilsDistribution } from "shared";

import { selectAppSettings } from "@/features/app-settings/core/appSettings";
import { RootState } from "@/shared/core/store-config/store";

import { shouldConfirmStepRevert } from "../stepRevert";

const selectSelf = (state: RootState) => state.siteCreation;

export const selectSiteAddress = createSelector(
  selectSelf,
  (state): Address | undefined => state.siteData.address,
);

export const selectSiteSoilsDistribution = createSelector(
  selectSelf,
  (state): SoilsDistribution => state.siteData.soilsDistribution ?? {},
);

export const selectFricheActivity = createSelector(
  selectSelf,
  (state) => state.siteData.fricheActivity,
);

export const selectSiteSurfaceArea = createSelector(
  selectSelf,
  (state) => state.siteData.surfaceArea,
);

export const selectSiteSoils = createSelector(selectSelf, (state) => state.siteData.soils);

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

export const selectSiteOwner = createSelector(selectSelf, (state) => state.siteData.owner);

export const selectShouldConfirmStepRevert = createSelector(
  selectSelf,
  selectAppSettings,
  (siteCreation, appSettings) => {
    return (
      appSettings.askForConfirmationOnStepRevert &&
      shouldConfirmStepRevert(siteCreation.consecutiveStepsReverted)
    );
  },
);
