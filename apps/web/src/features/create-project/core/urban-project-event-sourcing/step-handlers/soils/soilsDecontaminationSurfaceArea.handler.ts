import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"> =
  {
    stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",

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
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
    },

    getNextStepId(context) {
      if (FormState.hasBuildings(context.urbanProjectEventSourcing.events)) {
        return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
      }

      return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
    },
  };
