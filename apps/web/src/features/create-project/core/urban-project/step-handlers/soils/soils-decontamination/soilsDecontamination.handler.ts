import { resolveDecontaminatedSurfaceArea } from "@/features/create-project/core/project-form/soilsDecontamination";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import { getReinstatementCostsRecomputationRules } from "../../spaces/getCommonRules";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",

  updateAnswersMiddleware({ context }, answers) {
    const decontaminationPlan = answers.decontaminationPlan ?? "unknown";
    return {
      decontaminationPlan,
      decontaminatedSurfaceArea: resolveDecontaminatedSurfaceArea({
        decontaminationPlan,
        enteredSurfaceArea: answers.decontaminatedSurfaceArea,
        contaminatedSoilSurface: context.siteData?.contaminatedSoilSurface ?? 0,
      }),
    };
  },

  getDependencyRules(params, newAnswers) {
    const previousSurfaceArea = ReadStateHelper.getStepAnswers(
      params.answers,
      "URBAN_PROJECT_SOILS_DECONTAMINATION",
    )?.decontaminatedSurfaceArea;

    if (previousSurfaceArea === newAnswers.decontaminatedSurfaceArea) {
      return [];
    }
    return getReinstatementCostsRecomputationRules(params);
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION">;
