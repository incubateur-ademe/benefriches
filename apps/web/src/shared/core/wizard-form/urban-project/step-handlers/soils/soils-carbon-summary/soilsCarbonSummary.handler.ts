import { willHaveBuildings } from "../../../helpers/readers/buildingsReaders";
import { siteHasBuildings } from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsCarbonSummaryHandler = {
  stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY",

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getNextStepId(context) {
    if (willHaveBuildings(context.stepsState)) {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    }

    if (context.siteData && siteHasBuildings(context.siteData)) {
      return "URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO";
    }

    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_INVOLVES_REINSTATEMENT";
    }

    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }

    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies InfoStepHandler;
