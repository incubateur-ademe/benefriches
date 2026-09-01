import { createSelector } from "@reduxjs/toolkit";

import type { createSiteFormRootSelectors } from "../../../../selectors/createSite.selectors";
import { siteCreationRootSelectors } from "../../../../selectors/createSite.selectors";
import { ReadStateHelper } from "../../../stateHelpers";

type FullTimeJobsEquivalentViewData = {
  initialValue?: number;
};

export const createFullTimeJobsEquivalentSelectors = (
  rootSelectors: ReturnType<typeof createSiteFormRootSelectors>,
) => {
  const selectFullTimeJobsEquivalentViewData = createSelector(
    [rootSelectors.selectUrbanZoneSteps],
    (steps): FullTimeJobsEquivalentViewData => {
      const answer = ReadStateHelper.getStepAnswers(steps, "URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");
      return {
        initialValue: answer?.fullTimeJobs,
      };
    },
  );

  return { selectFullTimeJobsEquivalentViewData };
};

export const { selectFullTimeJobsEquivalentViewData } =
  createFullTimeJobsEquivalentSelectors(siteCreationRootSelectors);
