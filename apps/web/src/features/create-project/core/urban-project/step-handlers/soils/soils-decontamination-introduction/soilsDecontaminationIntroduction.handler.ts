import {
  getLastBuildingsChapterStep,
  shouldEnterBuildingsChapter,
} from "../../buildings/buildingsReaders";
import type { InfoStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationIntroductionHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION",

  getPreviousStepId({ answers, context }) {
    if (context.siteData?.nature === "FRICHE") {
      return "URBAN_PROJECT_INVOLVES_REINSTATEMENT";
    }
    if (shouldEnterBuildingsChapter({ answers, context })) {
      return getLastBuildingsChapterStep({ answers, context });
    }
    return "URBAN_PROJECT_SOILS_CARBON_SUMMARY";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
  },
} satisfies InfoStepHandler;
