import type { AnswerStepHandler } from "../../stepHandler.type";

export const InvolvesReinstatementHandler: AnswerStepHandler<"RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT"> =
  {
    stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",

    getNextStepId() {
      return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION";
    },
  };
