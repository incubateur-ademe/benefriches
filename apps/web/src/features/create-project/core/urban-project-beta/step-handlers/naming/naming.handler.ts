import { generateUrbanProjectName } from "../../../projectName";
import { AnswerStepHandler } from "../stepHandler.type";

export const UrbanProjectNamingHandler: AnswerStepHandler<"URBAN_PROJECT_NAMING"> = {
  stepId: "URBAN_PROJECT_NAMING",

  getDefaultAnswers() {
    return {
      name: generateUrbanProjectName(),
    };
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_PROJECT_PHASE";
  },

  getNextStepId() {
    return "URBAN_PROJECT_FINAL_SUMMARY";
  },
};
