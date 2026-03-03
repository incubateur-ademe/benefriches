import type { InfoStepHandler } from "../../stepHandler.type";

export const FinalSummaryHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_FINAL_SUMMARY",

  // No getNextStepId — final summary triggers save thunk, not step navigation
};
