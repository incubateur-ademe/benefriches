import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import type { AnswerStepHandler, StepInvalidationRule } from "../../stepHandler.type";

const STEP_ID = "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";

export const StakeholdersBuildingsDeveloperHandler: AnswerStepHandler<typeof STEP_ID> = {
  stepId: STEP_ID,
  getPreviousStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },
  getNextStepId({ answers, context }) {
    const involvesReinstatement = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_INVOLVES_REINSTATEMENT",
    )?.involvesReinstatement;

    if (involvesReinstatement !== false && context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
  updateAnswersMiddleware(_params, newAnswers) {
    if (newAnswers.developerWillBeBuildingsConstructor) {
      return newAnswers;
    }
    return { developerWillBeBuildingsConstructor: newAnswers.developerWillBeBuildingsConstructor };
  },
  getDependencyRules({ answers }, newAnswers) {
    const rules: StepInvalidationRule[] = [];

    if (answers.URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION) {
      rules.push({
        stepId: "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
        action: newAnswers.developerWillBeBuildingsConstructor ? "invalidate" : "delete",
      });
    }

    if (answers.URBAN_PROJECT_REVENUE_BUILDINGS_RESALE) {
      const buildingsWillBeResold =
        newAnswers.developerWillBeBuildingsConstructor &&
        newAnswers.buildingsResalePlannedAfterDevelopment;
      rules.push({
        stepId: "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        action: buildingsWillBeResold ? "invalidate" : "delete",
      });
    }

    return rules;
  },
};
