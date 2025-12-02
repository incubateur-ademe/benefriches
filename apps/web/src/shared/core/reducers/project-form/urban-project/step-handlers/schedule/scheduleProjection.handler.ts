import { getDefaultScheduleForProject } from "shared";

import { AnswerStepHandler } from "../stepHandler.type";

export const UrbanProjectScheduleProjectionHandler: AnswerStepHandler<"URBAN_PROJECT_SCHEDULE_PROJECTION"> =
  {
    stepId: "URBAN_PROJECT_SCHEDULE_PROJECTION",

    getDefaultAnswers(context) {
      const { installation, reinstatement, firstYearOfOperations } = getDefaultScheduleForProject({
        now: () => new Date(),
      })({
        hasReinstatement: context.siteData?.nature === "FRICHE",
      });

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
      return "URBAN_PROJECT_PROJECT_PHASE";
    },
  };
