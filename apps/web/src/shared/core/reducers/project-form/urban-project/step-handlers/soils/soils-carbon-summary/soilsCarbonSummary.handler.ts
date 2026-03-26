import { BENEFRICHES_ENV } from "@/app/envVars";
import { willHaveBuildings } from "@/shared/core/reducers/project-form/urban-project/helpers/readers/buildingsReaders";

import { siteHasBuildings } from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsCarbonSummaryHandler = {
  stepId: "URBAN_PROJECT_SOILS_CARBON_SUMMARY",

  getPreviousStepId() {
    return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
  },

  getNextStepId(context) {
    const willProjectHaveBuildings = willHaveBuildings(context.stepsState);
    const hasSiteBuildings = context.siteData ? siteHasBuildings(context.siteData) : false;
    if (
      willProjectHaveBuildings ||
      (BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled && hasSiteBuildings)
    ) {
      return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
    }

    if (context.siteData?.hasContaminatedSoils) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    }

    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies InfoStepHandler;
