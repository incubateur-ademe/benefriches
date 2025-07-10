import { createSelector } from "@reduxjs/toolkit";
import {
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
  typedObjectKeys,
} from "shared";

import {
  selectSiteData,
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
} from "../../createProject.selectors";
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

type FutureSoilsSelectionViewData = {
  initialValues: SoilType[];
  selectableSoils: SoilType[];
  baseSoilsDistribution: SoilsDistribution;
};
export const selectFutureSoilsSelectionViewData = createSelector(
  [selectCreationData, selectSiteSoilsDistribution],
  (creationData, siteSoilsDistribution): FutureSoilsSelectionViewData => {
    const selectableSoils = getSuitableSoilsForTransformation(
      typedObjectKeys(creationData.baseSoilsDistributionForTransformation ?? siteSoilsDistribution),
    );
    const initialValues =
      creationData.futureSoilsSelection ?? REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS;
    return {
      initialValues,
      selectableSoils,
      baseSoilsDistribution: creationData.baseSoilsDistributionForTransformation ?? {},
    };
  },
);

type FutureSoilsSurfaceAreasViewData = {
  initialValues?: SoilsDistribution;
  selectedSoils: SoilType[];
  siteSurfaceArea: number;
  photovoltaicPanelsSurfaceArea: number;
  baseSoilsDistribution: SoilsDistribution;
};
export const selectFutureSoilsSurfaceAreasViewData = createSelector(
  [selectCreationData, selectSiteSurfaceArea, selectSiteSoilsDistribution],
  (creationData, siteSurfaceArea, siteSoilsDistribution): FutureSoilsSurfaceAreasViewData => {
    const initialValues = creationData.soilsDistribution;
    const selectedSoils = creationData.futureSoilsSelection ?? [];
    const photovoltaicPanelsSurfaceArea =
      creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0;

    return {
      initialValues,
      selectedSoils,
      photovoltaicPanelsSurfaceArea,
      siteSurfaceArea,
      baseSoilsDistribution:
        creationData.baseSoilsDistributionForTransformation ?? siteSoilsDistribution,
    };
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
