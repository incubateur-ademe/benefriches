import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { InfoStepHandler } from "../../stepHandler.type";

export const SiteResaleIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",

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

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
};
