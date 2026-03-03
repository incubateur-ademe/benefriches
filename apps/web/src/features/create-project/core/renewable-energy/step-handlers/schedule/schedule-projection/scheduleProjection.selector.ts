import { createSelector } from "@reduxjs/toolkit";

import { selectIsSiteFriche } from "../../../../createProject.selectors";
import { selectPhotovoltaicPowerStationScheduleInitialValues } from "../../../selectors/renewableEnergy.selector";

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
