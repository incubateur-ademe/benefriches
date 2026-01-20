import { getDefaultScheduleForProject } from "shared";

import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

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

    getPreviousStepId(context) {
      if (
        ReadStateHelper.hasBuildings(context.stepsState) &&
        !ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(context.stepsState)
      ) {
        return "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES";
      }
      return "URBAN_PROJECT_EXPENSES_INSTALLATION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_PROJECT_PHASE";
    },
  };
