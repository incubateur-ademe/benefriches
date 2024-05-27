import { createSelector } from "@reduxjs/toolkit";
import { SoilsDistribution, SoilType, sumSoilsSurfaceAreasWhere } from "shared";
import {
  getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea,
  getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea,
} from "../domain/photovoltaic";
import {
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
} from "../domain/soilsTransformation";

import { RootState } from "@/app/application/store";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

const selectSelf = (state: RootState) => state.projectCreation;

export const selectBaseSoilsDistributionForTransformation = createSelector(
  selectSelf,
  (state): SoilsDistribution => {
    return (
      state.projectData.baseSoilsDistributionForTransformation ??
      state.siteData?.soilsDistribution ??
      {}
    );
  },
);

export const selectSiteSoilsDistribution = createSelector(
  selectSelf,
  (state): SoilsDistribution => state.siteData?.soilsDistribution ?? {},
);

export const selectProjectSoilsDistribution = createSelector(
  selectSelf,
  (state): SoilsDistribution => state.projectData.soilsDistribution ?? {},
);

export const selectSiteSurfaceArea = createSelector(
  selectSelf,
  (state): number => state.siteData?.surfaceArea ?? 0,
);

export const selectPhotovoltaicPanelsSurfaceArea = createSelector(
  selectSelf,
  (state): number => state.projectData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
);

export const selectSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  selectSelf,
  (state): number => {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(state.siteData?.soilsDistribution ?? {});
  },
);

export const selectNonSuitableSoilsForPhototovoltaicPanels = createSelector(
  selectSelf,
  (state): SoilsDistribution => {
    return state.siteData
      ? getNonSuitableSoilsForPhotovoltaicPanels(state.siteData.soilsDistribution)
      : {};
  },
);

export const selectMissingSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSuitableSurfaceAreaForPhotovoltaicPanels],
  (neededSurfaceArea, suitableSurfaceArea): number => {
    return neededSurfaceArea - suitableSurfaceArea;
  },
);

const selectNonSuitableSoilsSelected = createSelector(
  selectSelf,
  (state): SoilType[] => state.projectData.nonSuitableSoilsToTransform ?? [],
);

export const selectNonSuitableSoilsForPhototovoltaicPanelsToTransform = createSelector(
  [selectNonSuitableSoilsForPhototovoltaicPanels, selectNonSuitableSoilsSelected],
  (nonSuitableSoils, selectedNonSuitableSoilsToTransform): SoilsDistribution => {
    return typedObjectKeys(nonSuitableSoils)
      .filter((soilType) => selectedNonSuitableSoilsToTransform.includes(soilType))
      .reduce((soilsDistribution, soilType) => {
        return { ...soilsDistribution, [soilType]: nonSuitableSoils[soilType] };
      }, {});
  },
);

export const selectTransformableSoils = createSelector(
  selectBaseSoilsDistributionForTransformation,
  (baseSoilsDistributionForTransformation): SoilType[] => {
    const currentSoils = typedObjectKeys(baseSoilsDistributionForTransformation);
    return getSuitableSoilsForTransformation(currentSoils);
  },
);

export const selectFutureSoils = createSelector(selectSelf, (state): SoilType[] => {
  return state.projectData.futureSoilsSelection ?? [];
});

const selectPhotovoltaicInstallationElectricalPowerKWc = createSelector(
  selectSelf,
  (state): number => state.projectData.photovoltaicInstallationElectricalPowerKWc ?? 0,
);

export const selectRecommendedMineralSurfaceArea = createSelector(
  selectPhotovoltaicInstallationElectricalPowerKWc,
  (photovoltaicInstallationElectricalPowerKwC): number => {
    return getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea(
      photovoltaicInstallationElectricalPowerKwC,
    );
  },
);

export const selectRecommendedImpermeableSurfaceArea = createSelector(
  selectPhotovoltaicInstallationElectricalPowerKWc,
  (photovoltaicInstallationElectricalPowerKwC): number => {
    return getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea(
      photovoltaicInstallationElectricalPowerKwC,
    );
  },
);

export const selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed = createSelector(
  [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
  (siteSoilsDistribution, projectSoilsDistribution): number => {
    return getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed(
      siteSoilsDistribution,
      projectSoilsDistribution,
    );
  },
);

export const selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate =
  createSelector(
    [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
    (siteSoilsDistribution, projectSoilsDistribution): boolean => {
      return willTransformationNoticeablyImpactBiodiversityAndClimate(
        siteSoilsDistribution,
        projectSoilsDistribution,
      );
    },
  );

export const selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea = createSelector(
  selectProjectSoilsDistribution,
  (futureSoilsDistribution): number => {
    return sumSoilsSurfaceAreasWhere(futureSoilsDistribution, isBiodiversityAndClimateSensibleSoil);
  },
);
