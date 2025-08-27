import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION",

    getStepsToInvalidate(context) {
      if (
        FormState.hasLastAnswerFromSystem(
          context.urbanProjectEventSourcing.events,
          "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
        )
      ) {
        return ["URBAN_PROJECT_EXPENSES_REINSTATEMENT"];
      }
      return [];
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA";
    },

    getShortcut(context, answers, hasChanged) {
      const nextStep = FormState.hasBuildings(context.urbanProjectEventSourcing.events)
        ? "URBAN_PROJECT_BUILDINGS_INTRODUCTION"
        : "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";

      const shouldInvalidateReinstatementExpenses = FormState.hasLastAnswerFromSystem(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
      );

      if (answers.decontaminationPlan === "none" && hasChanged) {
        return {
          complete: [
            {
              stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
              payload: { decontaminatedSurfaceArea: 0 },
              invalidSteps: shouldInvalidateReinstatementExpenses
                ? ["URBAN_PROJECT_EXPENSES_REINSTATEMENT"]
                : [],
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
              payload: { decontaminatedSurfaceArea: contaminatedSoilSurface * 0.25 },
              invalidSteps: shouldInvalidateReinstatementExpenses
                ? ["URBAN_PROJECT_EXPENSES_REINSTATEMENT"]
                : [],
            },
          ],
          next: nextStep,
        };
      }

      return undefined;
    },
  };
