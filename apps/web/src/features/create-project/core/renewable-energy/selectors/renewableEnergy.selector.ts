import { createSelector } from "@reduxjs/toolkit";
import { ProjectSchedule, ProjectScheduleBuilder, SoilsDistribution } from "shared";

import { computePercentage } from "@/shared/core/percentage/percentage";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";
import { RootState } from "@/shared/core/store-config/store";

import { ProjectCreationState } from "../../createProject.reducer";
import { selectDefaultSchedule, selectSiteData } from "../../createProject.selectors";
import { generateRenewableEnergyProjectName } from "../../helpers/projectName";
import { RenewableEnergyProjectState } from "../renewableEnergy.reducer";

const selectSelf = (state: RootState) => state.projectCreation;

const selectRenewableEnergyData = createSelector(
  selectSelf,
  (state): ProjectCreationState["renewableEnergyProject"] => state.renewableEnergyProject,
);

export const selectCreationData = createSelector(
  selectRenewableEnergyData,
  (state): RenewableEnergyProjectState["creationData"] => state.creationData,
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

type SitePurchaseAmounts = {
  sellingPrice: number;
  propertyTransferDuties: number;
};
export const selectSitePurchaseAmounts = createSelector(
  [selectCreationData],
  (creationData): SitePurchaseAmounts | undefined => {
    if (!creationData.sitePurchaseSellingPrice) return undefined;
    return {
      sellingPrice: creationData.sitePurchaseSellingPrice ?? 0,
      propertyTransferDuties: creationData.sitePurchasePropertyTransferDuties ?? 0,
    };
  },
);

export const selectPhotovoltaicPowerStationScheduleInitialValues = createSelector(
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
