import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { getReinstatementCostsRecomputationRules } from "../spaces/getCommonRules";
import { AnswerStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",

    getDependencyRules(context, newAnswers) {
      if (
        context.stepsState.URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION?.payload
          ?.decontaminationPlan === newAnswers.decontaminationPlan
      ) {
        return [];
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
      const nextStep = ReadStateHelper.hasBuildings(context.stepsState)
        ? "URBAN_PROJECT_BUILDINGS_INTRODUCTION"
        : "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";

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
