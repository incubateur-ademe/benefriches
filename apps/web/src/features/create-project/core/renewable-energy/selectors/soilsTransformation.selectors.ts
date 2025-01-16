import { createSelector } from "@reduxjs/toolkit";
import { SoilsDistribution, SoilType, sumSoilsSurfaceAreasWhere } from "shared";

import { typedObjectKeys } from "@/shared/core/object-keys/objectKeys";

import { selectSiteData, selectSiteSoilsDistribution } from "../../createProject.selectors";
import {
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
} from "../soilsTransformation";
import { selectPhotovoltaicPanelsSurfaceArea } from "./photovoltaicPowerStation.selectors";
import { selectCreationData, selectProjectSoilsDistribution } from "./renewableEnergy.selector";

export const selectSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  selectSiteData,
  (state): number => {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(state?.soilsDistribution ?? {});
  },
);

const selectMissingSuitableSurfaceArea = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSiteSoilsDistribution],
  (neededSurfaceArea, siteSoilsDistribution): number => {
    return neededSurfaceArea - getSuitableSurfaceAreaForPhotovoltaicPanels(siteSoilsDistribution);
  },
);

type NonSuitableSoilsSelectionViewData = {
  initialValues: { soils: SoilType[] };
  nonSuitableSoils: SoilsDistribution;
  missingSuitableSurfaceArea: number;
};
export const selectNonSuitableSelectionViewData = createSelector(
  [selectCreationData, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (
    creationData,
    siteSoilsDistribution,
    missingSuitableSurfaceArea,
  ): NonSuitableSoilsSelectionViewData => {
    const nonSuitableSoils = getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    return {
      initialValues: { soils: creationData.nonSuitableSoilsToTransform ?? [] },
      nonSuitableSoils,
      missingSuitableSurfaceArea,
    };
  },
);

type NonSuitableSoilsSurfaceAreaToTransformViewData = {
  initialValues: SoilsDistribution;
  soilsToTransform: { soilType: SoilType; currentSurfaceArea: number }[];
  missingSuitableSurfaceArea: number;
};
export const selectNonSuitableSoilsSurfaceAreaToTransformViewData = createSelector(
  [selectCreationData, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (
    creationData,
    siteSoilsDistribution,
    missingSuitableSurfaceArea,
  ): NonSuitableSoilsSurfaceAreaToTransformViewData => {
    const nonSuitableSoilsSurfaceAreas =
      getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    // set every surface area to 0 if user hasn't entered data
    const initialValues =
      creationData.nonSuitableSoilsSurfaceAreaToTransform ??
      typedObjectKeys(nonSuitableSoilsSurfaceAreas).reduce<SoilsDistribution>((acc, soilType) => {
        acc[soilType] = 0;
        return acc;
      }, {});

    const soilsToTransform = (creationData.nonSuitableSoilsToTransform ?? []).map((soilType) => {
      return { soilType, currentSurfaceArea: nonSuitableSoilsSurfaceAreas[soilType] ?? 0 };
    });
    return {
      initialValues,
      missingSuitableSurfaceArea,
      soilsToTransform,
    };
  },
);

export const selectFutureSoils = createSelector(selectCreationData, (creationData): SoilType[] => {
  return creationData.futureSoilsSelection ?? [];
});

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

export const selectBaseSoilsDistributionForTransformation = createSelector(
  selectCreationData,
  selectSiteData,
  (creationData, siteData): SoilsDistribution => {
    return creationData.baseSoilsDistributionForTransformation ?? siteData?.soilsDistribution ?? {};
  },
);

export const selectTransformableSoils = createSelector(
  selectBaseSoilsDistributionForTransformation,
  (baseSoilsDistributionForTransformation): SoilType[] => {
    const currentSoils = typedObjectKeys(baseSoilsDistributionForTransformation);
    return getSuitableSoilsForTransformation(currentSoils);
  },
);
