import { getDefaultScheduleForProject } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const UrbanProjectScheduleProjectionHandler = {
  stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",

  getDefaultAnswers(context) {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    const { installation, reinstatement, firstYearOfOperations } = getDefaultScheduleForProject({
      now: () => new Date(),
    })({ hasReinstatement: involvesReinstatement === true });

    return {
      reinstatementSchedule: reinstatement
        ? {
            startDate: reinstatement.startDate.toDateString(),
            endDate: reinstatement.endDate.toDateString(),
          }
        : undefined,
      installationSchedule: {
        startDate: installation.startDate.toDateString(),
        endDate: installation.endDate.toDateString(),
      },
      firstYearOfOperation: firstYearOfOperations,
    };
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },

  getNextStepId() {
    return "URBAN_PROJECT_NAMING";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_SCHEDULE_PROJECTION">;
