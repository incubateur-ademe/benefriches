import { createSelector } from "@reduxjs/toolkit";
import {
  computeReinstatementFullTimeJobs,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
} from "shared";

import { RootState } from "@/app/application/store";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

import {
  computeDefaultPhotovoltaicConversionFullTimeJobs,
  computeDefaultPhotovoltaicOperationsFullTimeJobs,
  computeDefaultPhotovoltaicOtherAmountExpenses,
  computeDefaultPhotovoltaicTechnicalStudiesAmountExpenses,
  computeDefaultPhotovoltaicWorksAmountExpenses,
  computeDefaultPhotovoltaicYearlyMaintenanceAmount,
  computeDefaultPhotovoltaicYearlyRecurringRevenueAmount,
  computeDefaultPhotovoltaicYearlyRentAmount,
  computeDefaultPhotovoltaicYearlyTaxesAmount,
  PHOTOVOLTAIC_RATIO_M2_PER_KWC,
} from "../../domain/photovoltaic";
import {
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
} from "../../domain/soilsTransformation";
import { ProjectCreationState } from "../createProject.reducer";
import { selectSiteData, selectSiteSoilsDistribution } from "../createProject.selectors";
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

export const getDefaultValuesForFullTimeConversionJobsInvolved = createSelector(
  selectCreationData,
  selectSiteData,
  (creationData, siteData): { fullTimeJobs?: number; reinstatementFullTimeJobs?: number } => {
    const {
      photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc,
      renewableEnergyType,
      reinstatementExpenses,
    } = creationData;

    const isPhotovoltaicProject = renewableEnergyType === "PHOTOVOLTAIC_POWER_PLANT";

    const fullTimeJobs =
      isPhotovoltaicProject && electricalPowerKWc
        ? computeDefaultPhotovoltaicConversionFullTimeJobs(electricalPowerKWc)
        : undefined;

    const reinstatementFullTimeJobs =
      siteData?.isFriche && reinstatementExpenses
        ? computeReinstatementFullTimeJobs(reinstatementExpenses)
        : undefined;

    return {
      fullTimeJobs,
      reinstatementFullTimeJobs,
    };
  },
);

export const getDefaultValuesForFullTimeOperationsJobsInvolved = createSelector(
  selectCreationData,
  (creationData): number | undefined => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = creationData;

    return electricalPowerKWc
      ? computeDefaultPhotovoltaicOperationsFullTimeJobs(electricalPowerKWc)
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

export const selectRecommendedPowerKWcFromPhotovoltaicPlantSurfaceArea = createSelector(
  selectCreationData,
  (creationData): number => {
    if (!creationData.photovoltaicInstallationSurfaceSquareMeters) return 0;
    return Math.round(
      creationData.photovoltaicInstallationSurfaceSquareMeters / PHOTOVOLTAIC_RATIO_M2_PER_KWC,
    );
  },
);

export const selectRecommendedPowerKWcFromSiteSurfaceArea = createSelector(
  selectSiteData,
  (siteData): number => {
    if (!siteData?.surfaceArea) return 0;
    return Math.round(siteData.surfaceArea / PHOTOVOLTAIC_RATIO_M2_PER_KWC);
  },
);

export const selectRecommendedPhotovoltaicPlantSurfaceFromElectricalPower = createSelector(
  [selectCreationData, selectSiteData],
  (creationData, siteData): number => {
    if (!creationData.photovoltaicInstallationElectricalPowerKWc || !siteData?.surfaceArea)
      return 0;

    const computedFromElectricalPower = Math.round(
      creationData.photovoltaicInstallationElectricalPowerKWc * PHOTOVOLTAIC_RATIO_M2_PER_KWC,
    );
    // photovoltaic plant can't be bigger than site
    return Math.min(computedFromElectricalPower, siteData.surfaceArea);
  },
);

export const selectPhotovoltaicPlantElectricalPowerKWc = createSelector(
  selectCreationData,
  (creationData): number => creationData.photovoltaicInstallationElectricalPowerKWc ?? 0,
);
