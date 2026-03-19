import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "@/app/store/store";

import { ReadStateHelper } from "../../../stateHelpers";

type FullTimeJobsEquivalentViewData = {
  initialValue?: number;
};

export const selectFullTimeJobsEquivalentViewData = createSelector(
  [(state: RootState) => state.siteCreation.urbanZone.steps],
  (steps): FullTimeJobsEquivalentViewData => {
    const answer = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");
    return {
      initialValue: answer?.fullTimeJobs,
    };
  },
);
