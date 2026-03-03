import { createSelector } from "@reduxjs/toolkit";
import { ProjectSchedule, ProjectScheduleBuilder, SoilsDistribution } from "shared";

import { RootState } from "@/app/store/store";
import { computePercentage } from "@/shared/core/percentage/percentage";
import { RenewableEnergyDevelopmentPlanType } from "@/shared/core/reconversionProject";

import { generateRenewableEnergyProjectName } from "../../../../../shared/core/reducers/project-form/helpers/projectName";
import { ProjectCreationState } from "../../createProject.reducer";
import {
  selectDefaultSchedule,
  selectIsSiteFriche,
  selectSiteContaminatedSurfaceArea,
  selectSiteData,
} from "../../createProject.selectors";
import { ReadStateHelper } from "../helpers/readState";
import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";

const selectSelf = (state: RootState) => state.projectCreation;

const selectRenewableEnergyData = createSelector(
  selectSelf,
  (state): ProjectCreationState["renewableEnergyProject"] => state.renewableEnergyProject,
);

export const selectSteps = createSelector(
  selectRenewableEnergyData,
  (state): RenewableEnergyStepsState => state.steps,
);

export const selectRenewableEnergyType = createSelector(
  [selectRenewableEnergyData],
  (state): RenewableEnergyDevelopmentPlanType | undefined => {
    return state.creationData.renewableEnergyType;
  },
);

export const selectProjectSoilsDistribution = createSelector(
  selectSteps,
  (steps): SoilsDistribution => {
    // Check custom surface area allocation first, then project selection
    const customAllocation = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
    if (customAllocation?.soilsDistribution) return customAllocation.soilsDistribution;

    const projectSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
    );
    if (projectSelection?.soilsDistribution) return projectSelection.soilsDistribution;

    return {};
  },
);

export const selectContaminatedSurfaceAreaPercentageToDecontaminate = createSelector(
  [selectSteps, selectSiteData],
  (steps, siteData) => {
    const decontaminationSelection = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
    );
    const surfaceAreaStep = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
    );
    const surfaceToDecontaminate =
      surfaceAreaStep?.decontaminatedSurfaceArea ??
      decontaminationSelection?.decontaminatedSurfaceArea;
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
  [selectSteps],
  (steps): SitePurchaseAmounts | undefined => {
    const amounts = ReadStateHelper.getStepAnswers(
      steps,
      "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
    );
    if (!amounts?.sellingPrice) return undefined;
    return {
      sellingPrice: amounts.sellingPrice ?? 0,
      propertyTransferDuties: amounts.propertyTransferDuties ?? 0,
    };
  },
);

export const selectPhotovoltaicPowerStationScheduleInitialValues = createSelector(
  [selectSteps, selectDefaultSchedule],
  (steps, defaultSchedule): ProjectSchedule => {
    const schedule = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
    if (schedule?.photovoltaicInstallationSchedule && schedule?.firstYearOfOperation) {
      return new ProjectScheduleBuilder()
        .withInstallation(schedule.photovoltaicInstallationSchedule)
        .withFirstYearOfOperations(schedule.firstYearOfOperation)
        .withReinstatement(schedule.reinstatementSchedule)
        .build();
    }

    return defaultSchedule;
  },
);

type PVDecontaminationSurfaceAreaViewData = {
  contaminatedSurfaceArea: number;
  surfaceAreaToDecontaminateInPercentage: number;
};

export const selectPVDecontaminationSurfaceAreaViewData = createSelector(
  [selectSiteContaminatedSurfaceArea, selectContaminatedSurfaceAreaPercentageToDecontaminate],
  (
    contaminatedSurfaceArea,
    surfaceAreaToDecontaminateInPercentage,
  ): PVDecontaminationSurfaceAreaViewData => ({
    contaminatedSurfaceArea,
    surfaceAreaToDecontaminateInPercentage,
  }),
);

type PVScheduleProjectionViewData = {
  initialValues: ReturnType<typeof selectPhotovoltaicPowerStationScheduleInitialValues>;
  siteIsFriche: boolean;
};

export const selectPVScheduleProjectionViewData = createSelector(
  [selectPhotovoltaicPowerStationScheduleInitialValues, selectIsSiteFriche],
  (initialValues, siteIsFriche): PVScheduleProjectionViewData => ({
    initialValues,
    siteIsFriche,
  }),
);

export const selectNameAndDescriptionInitialValues = createSelector(
  [selectSteps, selectRenewableEnergyType],
  (steps, renewableEnergyType) => {
    const naming = ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_NAMING");
    if (naming?.name) {
      return { name: naming.name, description: naming.description };
    }
    if (renewableEnergyType) {
      return { name: generateRenewableEnergyProjectName(renewableEnergyType) };
    }
    return undefined;
  },
);
