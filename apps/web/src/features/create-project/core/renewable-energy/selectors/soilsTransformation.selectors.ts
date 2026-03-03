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
import { ReadStateHelper } from "../helpers/readState";
import { selectPhotovoltaicPanelsSurfaceArea } from "./photovoltaicPowerStation.selectors";
import { selectProjectSoilsDistribution, selectSteps } from "./renewableEnergy.selector";

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
  [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (steps, siteSoilsDistribution, missingSuitableSurfaceArea): NonSuitableSoilsSelectionViewData => {
    const nonSuitableSoils = getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    const selection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    );
    return {
      initialValues: { soils: selection?.nonSuitableSoilsToTransform ?? [] },
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
  [selectSteps, selectSiteSoilsDistribution, selectMissingSuitableSurfaceArea],
  (
    steps,
    siteSoilsDistribution,
    missingSuitableSurfaceArea,
  ): NonSuitableSoilsSurfaceAreaToTransformViewData => {
    const nonSuitableSoilsSurfaceAreas =
      getNonSuitableSoilsForPhotovoltaicPanels(siteSoilsDistribution);
    const surfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const selectionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
    );
    const initialValues =
      surfaceStep?.nonSuitableSoilsSurfaceAreaToTransform ??
      typedObjectKeys(nonSuitableSoilsSurfaceAreas).reduce<SoilsDistribution>((acc, soilType) => {
        acc[soilType] = 0;
        return acc;
      }, {});

    const soilsToTransform = (selectionStep?.nonSuitableSoilsToTransform ?? []).map((soilType) => {
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
  [selectSteps, selectSiteSoilsDistribution],
  (steps, siteSoilsDistribution): FutureSoilsSelectionViewData => {
    const nonSuitableSoilsSurfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const customSoilsSelectionStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );
    const baseSoilsDistribution =
      nonSuitableSoilsSurfaceStep?.baseSoilsDistributionForTransformation ?? siteSoilsDistribution;
    const selectableSoils = getSuitableSoilsForTransformation(
      typedObjectKeys(baseSoilsDistribution),
    );
    const initialValues =
      customSoilsSelectionStep?.futureSoilsSelection ?? REQUIRED_SOILS_FOR_PHOTOVOLTAIC_PANELS;
    return {
      initialValues,
      selectableSoils,
      baseSoilsDistribution,
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
  [selectSteps, selectSiteSurfaceArea, selectSiteSoilsDistribution],
  (steps, siteSurfaceArea, siteSoilsDistribution): FutureSoilsSurfaceAreasViewData => {
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    const customSoilsSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );
    const nonSuitableSoilsSurface = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
    );
    const surfaceStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    );

    const initialValues = customAllocation?.soilsDistribution;
    const selectedSoils = customSoilsSelection?.futureSoilsSelection ?? [];
    const photovoltaicPanelsSurfaceArea =
      surfaceStep?.photovoltaicInstallationSurfaceSquareMeters ?? 0;

    return {
      initialValues,
      selectedSoils,
      photovoltaicPanelsSurfaceArea,
      siteSurfaceArea,
      baseSoilsDistribution:
        nonSuitableSoilsSurface?.baseSoilsDistributionForTransformation ?? siteSoilsDistribution,
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

type PVSoilsSummaryViewData = {
  siteSoilsDistribution: SoilsDistribution;
  projectSoilsDistribution: SoilsDistribution;
};

export const selectPVSoilsSummaryViewData = createSelector(
  [selectSiteSoilsDistribution, selectProjectSoilsDistribution],
  (siteSoilsDistribution, projectSoilsDistribution): PVSoilsSummaryViewData => ({
    siteSoilsDistribution,
    projectSoilsDistribution,
  }),
);

type PVNonSuitableSoilsNoticeViewData = {
  photovoltaicPanelsSurfaceArea: number;
  suitableSurfaceArea: number;
};

export const selectPVNonSuitableSoilsNoticeViewData = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSuitableSurfaceAreaForPhotovoltaicPanels],
  (photovoltaicPanelsSurfaceArea, suitableSurfaceArea): PVNonSuitableSoilsNoticeViewData => ({
    photovoltaicPanelsSurfaceArea,
    suitableSurfaceArea,
  }),
);

type PVClimateAndBiodiversityImpactNoticeViewData = {
  hasTransformationNegativeImpact: boolean;
  biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed: number;
  futureBiodiversityAndClimateSensitiveSoilsSurfaceArea: number;
};

export const selectPVClimateAndBiodiversityImpactNoticeViewData = createSelector(
  [
    selectWillSoilsTransformationHaveNegativeImpactOnBiodiversityAndClimate,
    selectBiodiversityAndClimateSensibleSoilsSurfaceAreaDestroyed,
    selectFutureBiodiversityAndClimateSensibleSoilsSurfaceArea,
  ],
  (
    hasTransformationNegativeImpact,
    biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
    futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
  ): PVClimateAndBiodiversityImpactNoticeViewData => ({
    hasTransformationNegativeImpact,
    biodiversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
    futureBiodiversityAndClimateSensitiveSoilsSurfaceArea,
  }),
);
