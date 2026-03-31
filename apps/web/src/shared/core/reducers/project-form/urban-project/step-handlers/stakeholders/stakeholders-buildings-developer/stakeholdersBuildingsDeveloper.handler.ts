import type { AnswerStepHandler } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";

export const StakeholdersBuildingsDeveloperHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,
  getPreviousStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
  getNextStepId(context) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },
  getDependencyRules(context) {
    if (!context.stepsState.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION) {
      return [];
    }

    return [
      {
        stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
        action: "invalidate",
      },
    ];
  },
};
