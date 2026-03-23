import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { getReinstatementCostsRecomputationRules } from "../../spaces/getCommonRules";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationSurfaceAreaHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",

  getDependencyRules(context, newAnswers) {
    const currentValue = ReadStateHelper.getStepAnswers(
      context.stepsState,
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
    )?.decontaminatedSurfaceArea;
    if (currentValue === newAnswers.decontaminatedSurfaceArea) {
      return [];
    }
    return getReinstatementCostsRecomputationRules(context);
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA">;
