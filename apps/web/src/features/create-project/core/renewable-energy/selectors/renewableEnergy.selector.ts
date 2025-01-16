import { createSelector } from "@reduxjs/toolkit";
import { ProjectSchedule, ProjectScheduleBuilder, SoilsDistribution } from "shared";

import { RootState } from "@/app/application/store";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";

import { ProjectCreationState } from "../../createProject.reducer";
import { selectDefaultSchedule, selectSiteData } from "../../createProject.selectors";
import { generateRenewableEnergyProjectName } from "../../projectName";
import {
  computeDefaultPhotovoltaicOtherAmountExpenses,
  computeDefaultPhotovoltaicTechnicalStudiesAmountExpenses,
  computeDefaultPhotovoltaicWorksAmountExpenses,
  computeDefaultPhotovoltaicYearlyMaintenanceAmount,
  computeDefaultPhotovoltaicYearlyRecurringRevenueAmount,
  computeDefaultPhotovoltaicYearlyRentAmount,
  computeDefaultPhotovoltaicYearlyTaxesAmount,
} from "../photovoltaic";
import { RenewableEneryProjectState } from "../renewableEnergy.reducer";

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

export const selectContaminatedSurfaceAreaPercentageToDecontaminate = createSelector(
  [selectCreationData, selectSiteData],
  (creationData, siteData) => {
    const surfaceToDecontaminate = creationData.decontaminatedSurfaceArea;
    const contaminatedSurfaceArea = siteData?.contaminatedSoilSurface;
    if (!contaminatedSurfaceArea || !surfaceToDecontaminate) return 0;

    return computePercentage(surfaceToDecontaminate, contaminatedSurfaceArea);
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
