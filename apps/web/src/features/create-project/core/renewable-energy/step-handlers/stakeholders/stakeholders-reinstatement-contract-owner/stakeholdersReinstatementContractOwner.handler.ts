import type { AnswerStepHandler } from "../../stepHandler.type";

export const ReinstatementContractOwnerHandler: AnswerStepHandler<"RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER"> =
  {
    stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",

    getNextStepId() {
      return "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE";
    },
  };
