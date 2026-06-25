import { addYears } from "date-fns";
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

    const isFriche = context.siteData?.nature === "FRICHE";
    const hasReinstatement = involvesReinstatement !== undefined ? involvesReinstatement : isFriche;

    const { installation, reinstatement, firstYearOfOperations } = getDefaultScheduleForProject({
      now: () => new Date(),
    })({
      hasReinstatement,
    });

    // FRICHE with no reinstatement: installation starts 1 year from now instead of today,
    // since some preparation time is needed even without formal reinstatement
    const installationSchedule =
      isFriche && involvesReinstatement === false
        ? (() => {
            const startDate = addYears(new Date(), 1);
            return { startDate, endDate: addYears(startDate, 1) };
          })()
        : installation;

    return {
      reinstatementSchedule: reinstatement
        ? {
            startDate: reinstatement.startDate.toDateString(),
            endDate: reinstatement.endDate.toDateString(),
          }
        : undefined,
      installationSchedule: {
        startDate: installationSchedule.startDate.toDateString(),
        endDate: installationSchedule.endDate.toDateString(),
      },
      firstYearOfOperation:
        isFriche && involvesReinstatement === false
          ? installationSchedule.endDate.getFullYear()
          : firstYearOfOperations,
    };
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },

  getNextStepId() {
    return "URBAN_PROJECT_NAMING";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_SCHEDULE_PROJECTION">;
