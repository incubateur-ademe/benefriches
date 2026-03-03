import type { AnswerStepHandler } from "../stepHandler.type";

export const NamingHandler: AnswerStepHandler<"RENEWABLE_ENERGY_NAMING"> = {
  stepId: "RENEWABLE_ENERGY_NAMING",

  getNextStepId() {
    return "RENEWABLE_ENERGY_FINAL_SUMMARY";
  },
};
