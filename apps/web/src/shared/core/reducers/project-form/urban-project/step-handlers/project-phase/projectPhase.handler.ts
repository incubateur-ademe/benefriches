import { AnswerStepHandler } from "../stepHandler.type";

export const ProjectPhaseHandler: AnswerStepHandler<"URBAN_PROJECT_PROJECT_PHASE"> = {
  stepId: "URBAN_PROJECT_PROJECT_PHASE",

  getPreviousStepId() {
    return "URBAN_PROJECT_SCHEDULE_PROJECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_NAMING";
  },
};
