import { computeDefaultDecontaminatedSurfaceArea } from "shared";

import { ReadStateHelper } from "@/shared/core/wizard-form/helpers/readState";

import { getReinstatementCostsRecomputationRules } from "../../spaces/getCommonRules";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const SoilsDecontaminationSelectionHandler = {
  stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",

  getDependencyRules(params, newAnswers) {
    const existingAnswers = ReadStateHelper.getStepAnswers(
      params.answers,
      "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
    );

    if (
      !existingAnswers ||
      existingAnswers?.decontaminationPlan === newAnswers.decontaminationPlan
    ) {
      return [];
    }

    const reinstatementRules = getReinstatementCostsRecomputationRules(params);
    if (newAnswers.decontaminationPlan === "partial") {
      return [
        ...reinstatementRules,
        { stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA", action: "delete" },
      ];
    }
    return getReinstatementCostsRecomputationRules(params);
  },

  getPreviousStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
  },

  getNextStepId() {
    return "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA";
  },

  getShortcut(params, answers) {
    const nextStep = "URBAN_PROJECT_SITE_RESALE_INTRODUCTION";

    const hasChanged =
      ReadStateHelper.getStepAnswers(
        params.answers,
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      )?.decontaminationPlan !== answers.decontaminationPlan;

    if (answers.decontaminationPlan === "none" && hasChanged) {
      return {
        complete: [
          {
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            answers: { decontaminatedSurfaceArea: 0 },
          },
        ],
        next: nextStep,
      };
    }

    if (answers.decontaminationPlan === "unknown" && hasChanged) {
      const contaminatedSoilSurface = params.context?.siteData?.contaminatedSoilSurface ?? 0;
      return {
        complete: [
          {
            stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
            answers: {
              decontaminatedSurfaceArea:
                computeDefaultDecontaminatedSurfaceArea(contaminatedSoilSurface),
            },
          },
        ],
        next: nextStep,
      };
    }

    return undefined;
  },
} satisfies AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION">;
