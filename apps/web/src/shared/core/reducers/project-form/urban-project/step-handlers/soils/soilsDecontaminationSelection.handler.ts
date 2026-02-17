import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { getReinstatementCostsRecomputationRules } from "../spaces/getCommonRules";
import { AnswerStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",

    getDependencyRules(context, newAnswers) {
      const existingAnswers = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",
      );

      if (
        !existingAnswers ||
        existingAnswers?.decontaminationPlan === newAnswers.decontaminationPlan
      ) {
        return [];
      }

      const reinstatementRules = getReinstatementCostsRecomputationRules(context);
      if (newAnswers.decontaminationPlan === "partial") {
        return [
          ...reinstatementRules,
          { stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA", action: "delete" },
        ];
      }
      return getReinstatementCostsRecomputationRules(context);
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA";
    },

    getShortcut(context, answers) {
      const getNextStep = () => {
        if (ReadStateHelper.hasUsesWithBuildings(context.stepsState)) {
          return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION" as const;
        }
        if (ReadStateHelper.hasBuildings(context.stepsState)) {
          return "URBAN_PROJECT_BUILDINGS_INTRODUCTION" as const;
        }
        return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION" as const;
      };
      const nextStep = getNextStep();

      const hasChanged =
        ReadStateHelper.getStepAnswers(
          context.stepsState,
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
        const contaminatedSoilSurface = context.siteData?.contaminatedSoilSurface ?? 0;
        return {
          complete: [
            {
              stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
              answers: { decontaminatedSurfaceArea: contaminatedSoilSurface * 0.25 },
            },
          ],
          next: nextStep,
        };
      }

      return undefined;
    },
  };
