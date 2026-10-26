import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const StakeholdersIntroductionHandler = {
  stepId: "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION",

  getNextStepId() {
    return "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER";
  },

  getPreviousStepId(params) {
    const { answers, context } = params;
    const decontaminationPlan = ReadStateHelper.getStepAnswers(
      answers,
      "URBAN_PROJECT_SOILS_DECONTAMINATION",
    )?.decontaminationPlan;

    if (context.siteData?.hasContaminatedSoils || decontaminationPlan !== undefined) {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION";
    }

    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_INVOLVES_REINSTATEMENT";
    }

    if (shouldEnterBuildingsChapter(params)) {
      return getLastBuildingsChapterStep(params);
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },
} satisfies InfoStepHandler;
