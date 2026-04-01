import { shouldEnterBuildingsChapter } from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsCarbonSummaryHandler = {
  stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY",

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getNextStepId(context) {
    if (shouldEnterBuildingsChapter(context)) {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    }

    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }

    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies InfoStepHandler;
