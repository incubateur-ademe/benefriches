import { resolveDecontaminatedSurfaceArea } from "@/features/create-project/core/project-form/soilsDecontamination";
import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import { getReinstatementExpensesRecomputationRules } from "../../expenses/expenses-reinstatement/expensesReinstatement.handler";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationHandler = {
  stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",

  updateAnswersMiddleware({ context }, answers) {
    return {
      decontaminationPlan: answers.decontaminationPlan,
      decontaminatedSurfaceArea: resolveDecontaminatedSurfaceArea({
        decontaminationPlan: answers.decontaminationPlan,
        enteredSurfaceArea: answers.decontaminatedSurfaceArea,
        contaminatedSoilSurface: context.siteData?.contaminatedSoilSurface ?? 0,
      }),
    };
  },

  getDependencyRules(params, newAnswers) {
    const previousSurfaceArea = ReadStateHelper.getStepAnswers(
      params.answers,
      "RENEWABLE_ENERGY_SOILS_DECONTAMINATION",
    )?.decontaminatedSurfaceArea;

    if (previousSurfaceArea === newAnswers.decontaminatedSurfaceArea) {
      return [];
    }
    return getReinstatementExpensesRecomputationRules(params);
  },

  getPreviousStepId() {
    return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION";
  },

  getNextStepId() {
    return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION";
  },
} satisfies AnswerStepHandler<"RENEWABLE_ENERGY_SOILS_DECONTAMINATION">;
