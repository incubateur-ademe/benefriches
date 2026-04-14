import { willReuseExistingBuildings } from "@/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildingsReaders";
import { isDeveloperBuildingsConstructor } from "@/shared/core/reducers/project-form/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const ExpensesProjectedBuildingsOperatingExpensesHandler = {
  stepId: "URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES",

  getPreviousStepId(context) {
    if (
      isDeveloperBuildingsConstructor(context.stepsState) ||
      willReuseExistingBuildings(context.stepsState)
    ) {
      return "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION";
    }
    return "URBAN_PROJECT_EXPENSES_INSTALLATION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_REVENUE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES">;
