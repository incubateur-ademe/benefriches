import type { AnswerStepHandler } from "../stepHandler.type";

export const ProjectDeveloperHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",

    getNextStepId() {
      return "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR";
    },
  };
