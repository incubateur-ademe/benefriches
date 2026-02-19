import { createSelector } from "@reduxjs/toolkit";
import type { Address, SiteNature, SoilType } from "shared";

import { RootState } from "@/shared/core/store-config/store";

const selectSelf = (state: RootState) => state.siteCreation;

export const selectSiteAddress = createSelector(
  selectSelf,
  (state): Address | undefined => state.siteData.address,
);

export const selectSiteSoilsDistribution = createSelector(
  selectSelf,
  (state) => state.siteData.soilsDistribution ?? {},
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
