import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationIntroductionHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",

  getPreviousStepId(context) {
    if (shouldEnterBuildingsChapter(context)) {
      return getLastBuildingsChapterStep(context);
    }

    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
  },
} satisfies InfoStepHandler;
