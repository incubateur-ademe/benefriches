import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsCarbonStorageHandler: InfoStepHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_CARBON_STORAGE",

  getNextStepId() {
    return "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION";
  },
};
