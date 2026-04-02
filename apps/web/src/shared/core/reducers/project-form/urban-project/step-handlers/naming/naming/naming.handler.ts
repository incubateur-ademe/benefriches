import { generateUrbanProjectName } from "../../../../helpers/projectName";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const UrbanProjectNamingHandler = {
  stepId: "URBAN_PROJECT_NAMING",

  getDefaultAnswers() {
    return {
      name: generateUrbanProjectName(),
    };
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SCHEDULE_PROJECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_FINAL_SUMMARY";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_NAMING">;
