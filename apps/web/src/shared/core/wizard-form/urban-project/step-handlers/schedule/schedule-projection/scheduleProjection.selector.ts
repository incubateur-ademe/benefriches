import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type z from "zod";

import type { RootState } from "@/app/store/store";
import type { ProjectFormState } from "@/shared/core/wizard-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/wizard-form/urban-project/helpers/readState";

import type { scheduleProjectionSchema } from "./scheduleProjection.schema";

type ScheduleProjectionViewData = {
  stepAnswers: Partial<z.infer<typeof scheduleProjectionSchema>> | undefined;
  hasReinstatement: boolean;
};

export const createSelectScheduleProjectionViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
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
