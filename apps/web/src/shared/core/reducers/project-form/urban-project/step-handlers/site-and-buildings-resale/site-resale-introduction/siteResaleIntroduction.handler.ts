import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SiteResaleIntroductionHandler = {
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

    if (shouldEnterBuildingsChapter(context)) {
      return getLastBuildingsChapterStep(context);
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
