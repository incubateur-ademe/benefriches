import { createSelector } from "@reduxjs/toolkit";
import {
  computeReinstatementFullTimeJobs,
  DevelopmentPlanCategory,
  SoilsDistribution,
  SoilType,
  sumSoilsSurfaceAreasWhere,
} from "shared";
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
} from "../domain/photovoltaic";
import {
  getBioversityAndClimateSensitiveSoilsSurfaceAreaDestroyed,
  getNonSuitableSoilsForPhotovoltaicPanels,
  getSuitableSoilsForTransformation,
  getSuitableSurfaceAreaForPhotovoltaicPanels,
  isBiodiversityAndClimateSensibleSoil,
  willTransformationNoticeablyImpactBiodiversityAndClimate,
} from "../domain/soilsTransformation";
import { ProjectCreationState } from "./createProject.reducer";

import { RootState } from "@/app/application/store";
import { typedObjectKeys } from "@/shared/services/object-keys/objectKeys";

const selectSelf = (state: RootState) => state.projectCreation;

export const selectProjectDevelopmentPlanCategory = createSelector(
  selectSelf,
  (state): DevelopmentPlanCategory | undefined => state.projectData.developmentPlanCategory,
);

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

const selectProjectData = createSelector(
  selectSelf,
  (state): ProjectCreationState["projectData"] => state.projectData,
);

export const selectIsSiteLoaded = createSelector(
  selectSelf,
  (state): boolean => state.siteDataLoadingState === "success" && !!state.siteData,
);

const selectSiteData = createSelector(
  selectSelf,
  (state): ProjectCreationState["siteData"] => state.siteData,
);

export const getDefaultValuesForYearlyProjectedExpenses = createSelector(
  selectProjectData,
  (projectData): { rent: number; maintenance: number; taxes: number } | undefined => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = projectData;
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
  selectProjectData,
  (projectData): { works: number; technicalStudy: number; other: number } | undefined => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = projectData;
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
  selectProjectData,
  selectSiteData,
  (projectData, siteData): { fullTimeJobs?: number; reinstatementFullTimeJobs?: number } => {
    const {
      photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc,
      renewableEnergyType,
      reinstatementExpenses,
    } = projectData;

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
  selectProjectData,
  (projectData): number | undefined => {
    const { photovoltaicInstallationElectricalPowerKWc: electricalPowerKWc } = projectData;

    return electricalPowerKWc
      ? computeDefaultPhotovoltaicOperationsFullTimeJobs(electricalPowerKWc)
      : undefined;
  },
);

export const getDefaultValuesForYearlyProjectedRecurringRevenue = createSelector(
  selectProjectData,
  (projectData): number | undefined => {
    const { photovoltaicExpectedAnnualProduction } = projectData;

    return photovoltaicExpectedAnnualProduction
      ? computeDefaultPhotovoltaicYearlyRecurringRevenueAmount(photovoltaicExpectedAnnualProduction)
      : undefined;
  },
);
