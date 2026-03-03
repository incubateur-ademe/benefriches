import type { AnswerStepHandler } from "../stepHandler.type";

export const ScheduleProjectionHandler: AnswerStepHandler<"RENEWABLE_ENERGY_SCHEDULE_PROJECTION"> =
  {
    stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",

    getNextStepId() {
      return "RENEWABLE_ENERGY_PROJECT_PHASE";
    },
  };
