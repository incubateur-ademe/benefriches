import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SiteResaleIntroductionHandler = {
  stepId: "URBAN_PROJECT_SITE_RESALE_INTRODUCTION",

  getPreviousStepId(params) {
    const { answers, context } = params;
    const decontaminationPlan = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
    )?.decontaminationPlan;

    if (decontaminationPlan === "partial") {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA";
    }

    if (context.siteData?.hasContaminatedSoils || decontaminationPlan !== undefined) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
    }

    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_INVOLVES_REINSTATEMENT";
    }

    if (shouldEnterBuildingsChapter(params)) {
      return getLastBuildingsChapterStep(params);
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_SELECTION";
  },
} satisfies InfoStepHandler;
