import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type z from "zod";

import type { RootState } from "@/app/store/store";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { scheduleProjectionSchema } from "./scheduleProjection.schema";

type ScheduleProjectionViewData = {
  stepAnswers: Partial<z.infer<typeof scheduleProjectionSchema>> | undefined;
  hasReinstatement: boolean;
};

export const createSelectScheduleProjectionViewData = (
  selectStepState: Selector<RootState, UrbanProjectStepsState>,
) =>
  createSelector([selectStepState], (steps): ScheduleProjectionViewData => {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      steps,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;
    return {
      stepAnswers: ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SCHEDULE_PROJECTION"),
      hasReinstatement: involvesReinstatement === true,
    };
  });
