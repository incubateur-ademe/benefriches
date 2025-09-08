import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"> =
  {
    stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",

    getStepsToInvalidate(context) {
      if (
        ReadStateHelper.hasLastAnswerFromSystem(
          context.stepsState,
          "URBAN_PROJECT_EXPENSES_REINSTATEMENT",
        )
      ) {
        return { recomputed: ["URBAN_PROJECT_EXPENSES_REINSTATEMENT"] };
      }
      return undefined;
    },

    getPreviousStepId() {
      return "URBAN_PROJECT_SOILS_DECONTAMINATION_SELECTION";
    },

    getNextStepId(context) {
      if (ReadStateHelper.hasBuildings(context.stepsState)) {
        return "URBAN_PROJECT_BUILDINGS_INTRODUCTION";
      }

      return "URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION";
    },
  };
