import { AnswerStepHandler } from "../stepHandler.type";

export const StakeholdersReinstatementContractOwnerHandler: AnswerStepHandler<"URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"> =
  {
    stepId: "URBAN_PROJECT_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",

    getPreviousStepId() {
      return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
    },
  };
