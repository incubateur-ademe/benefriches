import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../stepHandler.type";

export const SoilsCarbonSummaryHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY",

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getNextStepId(context) {
    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }

    if (ReadStateHelper.hasBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    }

    return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
  },
};
