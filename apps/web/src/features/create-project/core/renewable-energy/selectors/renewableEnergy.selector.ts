import { createSelector } from "@reduxjs/toolkit";
import { ProjectSchedule, ProjectScheduleBuilder, SoilsDistribution } from "shared";

import { RootState } from "@/app/store/store";

import { ProjectCreationState } from "../../createProject.reducer";
import { selectDefaultSchedule } from "../../createProject.selectors";
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
