import { InfoStepHandler } from "../stepHandler.type";

export const ScheduleIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SCHEDULE_INTRODUCTION",

  getPreviousStepId() {
    return "URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SCHEDULE_PROJECTION";
  },
};
