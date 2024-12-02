import { createSelector } from "@reduxjs/toolkit";
import { SoilsDistribution } from "shared";

import { RootState } from "@/app/application/store";

import { Address } from "../domain/siteFoncier.types";

const selectSelf = (state: RootState) => state.siteCreation;

export const selectSiteAddress = createSelector(
  selectSelf,
  (state): Address | undefined => state.siteData.address,
);

export const selectSiteSoilsDistribution = createSelector(
  selectSelf,
  (state): SoilsDistribution => state.siteData.soilsDistribution ?? {},
);

export const selectIsFriche = createSelector(selectSelf, (state) => state.siteData.isFriche);

export const selectFricheActivity = createSelector(
  selectSelf,
  (state) => state.siteData.fricheActivity,
);

export const selectSiteSurfaceArea = createSelector(
  selectSelf,
  (state) => state.siteData.surfaceArea,
);
