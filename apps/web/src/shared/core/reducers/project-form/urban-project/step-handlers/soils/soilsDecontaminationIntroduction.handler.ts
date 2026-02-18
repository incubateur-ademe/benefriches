import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",

  getPreviousStepId(context) {
    if (ReadStateHelper.willHaveBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
  },
};
