import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsSummaryHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_SUMMARY",

  getNextStepId() {
    return "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE";
  },
};
