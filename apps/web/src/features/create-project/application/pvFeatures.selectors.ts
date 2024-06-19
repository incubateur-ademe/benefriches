import { createSelector } from "@reduxjs/toolkit";
import { PHOTOVOLTAIC_RATIO_M2_PER_KWC } from "../domain/photovoltaic";

import { RootState } from "@/app/application/store";

const selectProjectCreationState = (state: RootState) => state.projectCreation;
const selectProjectCreationData = createSelector(
  selectProjectCreationState,
  (state) => state.projectData,
);
const selectProjectCreationSiteData = createSelector(
  selectProjectCreationState,
  (state) => state.siteData,
);

export const selectPhotovoltaicPlantFeaturesKeyParameter = createSelector(
  selectProjectCreationData,
  (projectData) => projectData.photovoltaicKeyParameter,
);

export const selectRecommendedPowerKWcFromPhotovoltaicPlantSurfaceArea = createSelector(
  selectProjectCreationData,
  (projectData): number => {
    if (!projectData.photovoltaicInstallationSurfaceSquareMeters) return 0;
    return Math.round(
      projectData.photovoltaicInstallationSurfaceSquareMeters / PHOTOVOLTAIC_RATIO_M2_PER_KWC,
    );
  },
);

export const selectRecommendedPowerKWcFromSiteSurfaceArea = createSelector(
  selectProjectCreationSiteData,
  (siteData): number => {
    if (!siteData?.surfaceArea) return 0;
    return Math.round(siteData.surfaceArea / PHOTOVOLTAIC_RATIO_M2_PER_KWC);
  },
);

export const selectRecommendedPhotovoltaicPlantSurfaceFromElectricalPower = createSelector(
  selectProjectCreationData,
  (projectData): number => {
    if (!projectData.photovoltaicInstallationElectricalPowerKWc) return 0;
    return Math.round(
      projectData.photovoltaicInstallationElectricalPowerKWc * PHOTOVOLTAIC_RATIO_M2_PER_KWC,
    );
  },
);

export const selectPhotovoltaicPlantElectricalPowerKWc = createSelector(
  selectProjectCreationData,
  (projectData): number => projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
);
