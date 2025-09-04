import { InfoStepHandler } from "../stepHandler.type";

export const BuildingsIntroductionHandler: InfoStepHandler = {
  stepId: "URBAN_PROJECT_BUILDINGS_INTRODUCTION",

  getPreviousStepId(context) {
    const decontaminationPlan =
      context.stepsState["URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"]?.payload
        ?.decontaminationPlan;

    if (decontaminationPlan === "partial") {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA";
    }

    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA";
  },
};
