import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type { ProjectSchedule } from "shared";

import type { RootState } from "@/app/store/store";
import type { RenewableEnergyStepsState } from "@/features/create-project/core/renewable-energy/step-handlers/stepHandler.type";

import { ReadStateHelper } from "../../../helpers/readState";

type PVScheduleProjectionViewData = {
  initialValues: ProjectSchedule;
  hasReinstatement: boolean;
};

export const createSelectPVScheduleProjectionViewData = (
  selectPhotovoltaicPowerStationScheduleInitialValues: Selector<RootState, ProjectSchedule>,
  selectSteps: Selector<RootState, RenewableEnergyStepsState>,
) =>
  createSelector(
    [selectPhotovoltaicPowerStationScheduleInitialValues, selectSteps],
    (initialValues, steps): PVScheduleProjectionViewData => ({
      initialValues,
      hasReinstatement:
        ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
          ?.involvesReinstatement === true,
    }),
  );
