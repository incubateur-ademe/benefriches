import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION";

export const BuildingsResaleSelectionHandler = {
  stepId: STEP_ID,

  getNextStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },

  getDependencyRules({ answers }, newAnswers) {
    const rules: StepInvalidationRule[] = [];
    const hasBuildingResale = newAnswers.buildingsResalePlannedAfterDevelopment;

    if (answers.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE) {
      rules.push({
        stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        action: hasBuildingResale ? "invalidate" : "delete",
      });
    }

    return rules;
  },
} satisfies AnswerStepHandler<typeof STEP_ID>;
