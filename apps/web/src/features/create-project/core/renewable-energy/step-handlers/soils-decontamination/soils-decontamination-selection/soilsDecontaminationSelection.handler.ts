import { computeDefaultDecontaminatedSurfaceArea } from "shared";

import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationSelectionHandler: AnswerStepHandler<"RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION"> =
  {
    stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",

    getNextStepId(_context, answers) {
      if (answers?.decontaminationPlan === "partial") {
        return "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA";
      }
      return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION";
    },

    updateAnswersMiddleware(context, answers) {
      if (answers.decontaminationPlan === "none") {
        return { ...answers, decontaminatedSurfaceArea: 0 };
      }
      if (answers.decontaminationPlan === "unknown") {
        const contaminatedSoilSurface = context.siteData?.contaminatedSoilSurface ?? 0;
        return {
          ...answers,
          decontaminatedSurfaceArea:
            computeDefaultDecontaminatedSurfaceArea(contaminatedSoilSurface),
        };
      }
      return answers;
    },
  };
