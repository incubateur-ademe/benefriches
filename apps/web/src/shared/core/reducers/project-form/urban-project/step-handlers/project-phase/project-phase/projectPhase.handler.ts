import type { AnswerStepHandler } from "../../stepHandler.type";

export const ProjectPhaseHandler = {
  stepId: "URBAN_PROJECT_PROJECT_PHASE",

  getPreviousStepId() {
    return "URBAN_PROJECT_SCHEDULE_PROJECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_NAMING";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_PROJECT_PHASE">;
