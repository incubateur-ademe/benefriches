import { willConstructNewBuildings } from "../../buildings/buildingsReaders";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const StakeholdersReinstatementContractOwnerHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",

  getPreviousStepId(params) {
    if (willConstructNewBuildings(params.answers)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }

    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getNextStepId() {
    return "URBAN_PROJECT_EXPENSES_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER">;
