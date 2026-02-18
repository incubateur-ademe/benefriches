import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../stepHandler.type";

export const StakeholdersIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getPreviousStepId(context) {
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

    if (ReadStateHelper.willHaveBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA";
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },
} as const;
