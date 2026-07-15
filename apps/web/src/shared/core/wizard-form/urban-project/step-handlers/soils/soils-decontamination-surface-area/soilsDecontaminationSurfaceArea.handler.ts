import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import { getReinstatementCostsRecomputationRules } from "../../spaces/getCommonRules";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationSurfaceAreaHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",

  getDependencyRules(params, newAnswers) {
    const currentValue = ReadStateHelper.getStepAnswers(
      params.answers,
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
    )?.decontaminatedSurfaceArea;
    if (currentValue === newAnswers.decontaminatedSurfaceArea) {
      return [];
    }
    return getReinstatementCostsRecomputationRules(params);
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA">;
