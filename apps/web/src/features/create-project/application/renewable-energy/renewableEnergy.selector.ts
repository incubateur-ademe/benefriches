import { createSelector } from "@reduxjs/toolkit";
import {
  ProjectSchedule,
  ProjectScheduleBuilder,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import { RootState } from "@/app/application/store";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/domain/reconversionProject";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

import {
  computeDefaultPhotovoltaicOtherAmountExpenses,
  computeDefaultPhotovoltaicTechnicalStudiesAmountExpenses,
  computeDefaultPhotovoltaicWorksAmountExpenses,
  computeDefaultPhotovoltaicYearlyMaintenanceAmount,
  computeDefaultPhotovoltaicYearlyRecurringRevenueAmount,
  computeDefaultPhotovoltaicYearlyRentAmount,
  computeDefaultPhotovoltaicYearlyTaxesAmount,
  getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower,
  getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea,
} from "../../domain/photovoltaic";
import { generateRenewableEnergyProjectName } from "../../domain/projectName";
import {
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
} from "../../domain/soilsTransformation";
import { ProjectCreationState } from "../createProject.reducer";
import {
  selectDefaultSchedule,
  selectSiteData,
  selectSiteSoilsDistribution,
  selectSiteSurfaceArea,
} from "../createProject.selectors";
import { RenewableEneryProjectState } from "./renewableEnergy.reducer";

const selectSelf = (state: RootState) => state.projectCreation;

const selectRenewableEnergyData = createSelector(
  selectSelf,
  (state): ProjectCreationState["renewableEnergyProject"] => state.renewableEnergyProject,
);

export const selectCurrentStep = createSelector(selectRenewableEnergyData, (state) => {
  return state.stepsHistory.at(-1) ?? "RENEWABLE_ENERGY_TYPES";
});

export const selectCreationData = createSelector(
  selectRenewableEnergyData,
  (state): RenewableEneryProjectState["creationData"] => state.creationData,
);

export const selectRenewableEnergyType = createSelector(
  [selectCreationData],
  (creationData): RenewableEnergyDevelopmentPlanType | undefined => {
    return creationData.renewableEnergyType;
  },
);

export const selectProjectSoilsDistribution = createSelector(
  selectRenewableEnergyData,
  (state): SoilsDistribution => state.creationData.soilsDistribution ?? {},
);

export const selectPhotovoltaicPanelsSurfaceArea = createSelector(
  selectRenewableEnergyData,
  (state): number => state.creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0,
);

export const selectSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  selectSiteData,
  (state): number => {
    return getSuitableSurfaceAreaForPhotovoltaicPanels(state?.soilsDistribution ?? {});
  },
);

export const selectNonSuitableSoilsForPhototovoltaicPanels = createSelector(
  selectSiteData,
  (state): SoilsDistribution => {
    return state ? getNonSuitableSoilsForPhotovoltaicPanels(state.soilsDistribution) : {};
  },
);

export const selectMissingSuitableSurfaceAreaForPhotovoltaicPanels = createSelector(
  [selectPhotovoltaicPanelsSurfaceArea, selectSuitableSurfaceAreaForPhotovoltaicPanels],
  (neededSurfaceArea, suitableSurfaceArea): number => {
    return neededSurfaceArea - suitableSurfaceArea;
  },
);

const selectNonSuitableSoilsSelected = createSelector(
  selectRenewableEnergyData,
  (state): SoilType[] => state.creationData.nonSuitableSoilsToTransform ?? [],
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

export const selectFutureSoils = createSelector(selectRenewableEnergyData, (state): SoilType[] => {
  return state.creationData.futureSoilsSelection ?? [];
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

export const getDefaultValuesForYearlyProjectedExpenses = createSelector(
  selectCreationData,
  (creationData): { rent: number; maintenance: number; taxes: number } | undefined => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = creationData;
    return electricalPowerKWc
      ? {
          rent: computeDefaultPhotovoltaicYearlyRentAmount(electricalPowerKWc),
          maintenance: computeDefaultPhotovoltaicYearlyMaintenanceAmount(electricalPowerKWc),
          taxes: computeDefaultPhotovoltaicYearlyTaxesAmount(electricalPowerKWc),
        }
      : undefined;
  },
);

export const getDefaultValuesForPhotovoltaicInstallationExpenses = createSelector(
  selectCreationData,
  (creationData): { works: number; technicalStudy: number; other: number } | undefined => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = creationData;
    return electricalPowerKWc
      ? {
          works: computeDefaultPhotovoltaicWorksAmountExpenses(electricalPowerKWc),
          technicalStudy:
            computeDefaultPhotovoltaicTechnicalStudiesAmountExpenses(electricalPowerKWc),
          other: computeDefaultPhotovoltaicOtherAmountExpenses(electricalPowerKWc),
        }
      : undefined;
  },
);

export const getDefaultValuesForYearlyProjectedRecurringRevenue = createSelector(
  selectCreationData,
  (creationData): number | undefined => {
    const { photovoltaicExpectedAnnualProduction } = creationData;

    return photovoltaicExpectedAnnualProduction
      ? computeDefaultPhotovoltaicYearlyRecurringRevenueAmount(photovoltaicExpectedAnnualProduction)
      : undefined;
  },
);

export const selectPhotovoltaicPlantFeaturesKeyParameter = createSelector(
  selectCreationData,
  (creationData) => creationData.photovoltaicKeyParameter,
);

type PhotovoltaicPowerViewData =
  | {
      keyParameter: "SURFACE";
      initialValue: number;
      photovoltaicInstallationSurfaceArea: number;
      recommendedPowerKWc: number;
      siteSurfaceArea: number;
    }
  | {
      keyParameter: "POWER";
      initialValue: number | undefined;
      recommendedPowerKWc: number;
      photovoltaicInstallationSurfaceArea: undefined;
      siteSurfaceArea: number;
    };
export const selectPhotovoltaicPowerViewData = createSelector(
  [selectCreationData, selectSiteSurfaceArea],
  (creationData, siteSurfaceArea): PhotovoltaicPowerViewData => {
    if (creationData.photovoltaicKeyParameter === "SURFACE") {
      const installationSurfaceArea = creationData.photovoltaicInstallationSurfaceSquareMeters ?? 0;
      const recommendedPowerKWc =
        getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(installationSurfaceArea);
      const initialValue =
        creationData.photovoltaicInstallationElectricalPowerKWc ?? recommendedPowerKWc;
      return {
        initialValue,
        keyParameter: "SURFACE",
        photovoltaicInstallationSurfaceArea: installationSurfaceArea,
        recommendedPowerKWc,
        siteSurfaceArea,
      };
    }
    const recommendedPowerKWc =
      getRecommendedPowerKWcFromPhotovoltaicPanelsSurfaceArea(siteSurfaceArea);
    return {
      initialValue: creationData.photovoltaicInstallationElectricalPowerKWc,
      keyParameter: "POWER",
      recommendedPowerKWc,
      photovoltaicInstallationSurfaceArea: undefined,
      siteSurfaceArea,
    };
  },
);

type PhotovoltaicSurfaceAreaViewData =
  | {
      keyParameter: "SURFACE";
      initialValue: number | undefined;
      siteSurfaceArea: number;
      recommendedSurfaceArea: undefined;
      electricalPowerKWc: undefined;
    }
  | {
      keyParameter: "POWER";
      initialValue: number;
      siteSurfaceArea: number;
      recommendedSurfaceArea: number;
      electricalPowerKWc: number;
    };

export const selectPhotovoltaicSurfaceViewData = createSelector(
  [selectCreationData, selectSiteSurfaceArea],
  (creationData, siteSurfaceArea): PhotovoltaicSurfaceAreaViewData => {
    if (creationData.photovoltaicKeyParameter === "SURFACE") {
      return {
        keyParameter: "SURFACE",
        initialValue: creationData.photovoltaicInstallationSurfaceSquareMeters,
        siteSurfaceArea,
        electricalPowerKWc: undefined,
        recommendedSurfaceArea: undefined,
      };
    }

    const electricalPowerKWc = creationData.photovoltaicInstallationElectricalPowerKWc ?? 0;
    // photovoltaic plant can't be bigger than site
    const recommendedSurfaceArea = Math.min(
      getRecommendedPhotovoltaicPanelsSurfaceAreaFromElectricalPower(electricalPowerKWc),
      siteSurfaceArea,
    );
    const initialValue =
      creationData.photovoltaicInstallationSurfaceSquareMeters ?? recommendedSurfaceArea;
    return {
      keyParameter: "POWER",
      initialValue,
      recommendedSurfaceArea,
      siteSurfaceArea,
      electricalPowerKWc,
    };
  },
);

export const selectPhotovoltaicInstallationExpenses = createSelector(
  [selectCreationData, selectDefaultSchedule],
  (creationData, defaultSchedule): ProjectSchedule => {
    if (creationData.photovoltaicInstallationSchedule && creationData.firstYearOfOperation) {
      return new ProjectScheduleBuilder()
        .withInstallation(creationData.photovoltaicInstallationSchedule)
        .withFirstYearOfOperations(creationData.firstYearOfOperation)
        .withReinstatement(creationData.reinstatementSchedule)
        .build();
    }

    return defaultSchedule;
  },
);

export const selectNameAndDescriptionInitialValues = createSelector(
  selectCreationData,
  (creationData) => {
    if (creationData.name) {
      return { name: creationData.name, description: creationData.description };
    }
    if (creationData.renewableEnergyType) {
      return { name: generateRenewableEnergyProjectName(creationData.renewableEnergyType) };
    }
    return undefined;
  },
);
