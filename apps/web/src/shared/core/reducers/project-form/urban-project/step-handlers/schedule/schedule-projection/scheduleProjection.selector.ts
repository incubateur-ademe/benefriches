import { createSelector } from "@reduxjs/toolkit";
import type { Selector } from "@reduxjs/toolkit";
import type z from "zod";

import type { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";
import type { RootState } from "@/shared/core/store-config/store";

import type { scheduleProjectionSchema } from "./scheduleProjection.schema";

type ScheduleProjectionViewData = {
  stepAnswers: Partial<z.infer<typeof scheduleProjectionSchema>> | undefined;
  isSiteFriche: boolean;
};

export const createSelectScheduleProjectionViewData = (
  selectStepState: Selector<RootState, ProjectFormState["urbanProject"]["steps"]>,
  selectIsSiteFriche: Selector<RootState, boolean>,
) =>
  createSelector(
    [selectStepState, selectIsSiteFriche],
    (steps, isSiteFriche): ScheduleProjectionViewData => ({
      stepAnswers: ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_SCHEDULE_PROJECTION"),
      isSiteFriche,
    }),
  );
