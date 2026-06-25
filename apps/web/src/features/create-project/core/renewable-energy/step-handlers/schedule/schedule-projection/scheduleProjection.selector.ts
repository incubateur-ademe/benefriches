import { createSelector } from "@reduxjs/toolkit";

import { ReadStateHelper } from "../../../helpers/readState";
import {
  selectPhotovoltaicPowerStationScheduleInitialValues,
  selectSteps,
} from "../../../selectors/renewableEnergy.selector";

type PVScheduleProjectionViewData = {
  initialValues: ReturnType<typeof selectPhotovoltaicPowerStationScheduleInitialValues>;
  hasReinstatement: boolean;
};

export const selectPVScheduleProjectionViewData = createSelector(
  [selectPhotovoltaicPowerStationScheduleInitialValues, selectSteps],
  (initialValues, steps): PVScheduleProjectionViewData => ({
    initialValues,
    hasReinstatement:
      ReadStateHelper.getStepAnswers(steps, "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
        ?.involvesReinstatement === true,
  }),
);
