import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../stepHandler.type";

export const BuildingsIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",

  getPreviousStepId(context) {
    if (ReadStateHelper.hasUsesWithBuildings(context.stepsState)) {
      return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
    }

    const decontaminationPlan = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
    )?.decontaminationPlan;

    if (decontaminationPlan === "partial") {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA";
    }

    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId(context) {
    if (ReadStateHelper.hasUsesWithBuildings(context.stepsState)) {
      return "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA";
    }

    return "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA";
  },
};
