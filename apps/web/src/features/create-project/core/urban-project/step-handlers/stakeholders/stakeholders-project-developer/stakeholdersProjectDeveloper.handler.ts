import { willHaveBuildings } from "@/features/create-project/core/urban-project/helpers/readers/buildingsReaders";
import { shouldAskReinstatementContractOwner } from "@/features/create-project/core/urban-project/step-handlers/stakeholders/stakeholdersReaders";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const StakeholdersProjectDeveloperHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",

  getPreviousStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
  },

  getNextStepId({ answers, context }) {
    if (willHaveBuildings(answers)) {
      return "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER";
    }

    if (shouldAskReinstatementContractOwner(answers, context.siteData?.nature)) {
      return "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER";
    }

    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER">;
