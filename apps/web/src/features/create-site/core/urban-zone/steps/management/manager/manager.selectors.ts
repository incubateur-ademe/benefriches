import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../helpers/stateHelpers";

type ManagerViewData = {
  initialValues: {
    structureType: "activity_park_manager" | "local_authority" | undefined;
  };
};

export const selectManagerViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps],
  (steps): ManagerViewData => {
    const answers = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_MANAGER");
    return {
      initialValues: {
        structureType: answers?.structureType,
      },
    };
  },
);
