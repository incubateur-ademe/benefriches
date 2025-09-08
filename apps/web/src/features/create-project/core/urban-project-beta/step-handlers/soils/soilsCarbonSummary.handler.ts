import { ReadStateHelper } from "../../helpers/readState";
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

    const livingAndActivitySpacesDistribution = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION",
    )?.livingAndActivitySpacesDistribution;

    if (
      livingAndActivitySpacesDistribution?.BUILDINGS &&
      livingAndActivitySpacesDistribution.BUILDINGS > 0
    ) {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    }

    return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
  },
};
