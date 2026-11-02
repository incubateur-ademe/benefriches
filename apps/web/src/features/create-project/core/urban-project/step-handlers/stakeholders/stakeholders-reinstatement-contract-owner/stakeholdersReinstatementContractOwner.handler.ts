import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const StakeholdersReinstatementContractOwnerHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",

  getPreviousStepId(params) {
    if (willHaveBuildings(params.answers)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }

    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER">;
