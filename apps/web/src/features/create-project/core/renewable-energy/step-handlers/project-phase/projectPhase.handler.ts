import type { AnswerStepHandler } from "../stepHandler.type";

export const ProjectPhaseHandler: AnswerStepHandler<"RENEWABLE_ENERGY_PROJECT_PHASE"> = {
  stepId: "RENEWABLE_ENERGY_PROJECT_PHASE",

  getNextStepId() {
    return "RENEWABLE_ENERGY_NAMING";
  },
};
