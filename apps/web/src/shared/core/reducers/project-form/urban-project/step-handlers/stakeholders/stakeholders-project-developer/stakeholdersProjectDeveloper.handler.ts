import { willConstructNewBuildings } from "../../buildings/buildingsReaders";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const StakeholdersProjectDeveloperHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",

  getPreviousStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
  },

  getNextStepId(context) {
    if (willConstructNewBuildings(context.stepsState)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }

    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }

    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER">;
