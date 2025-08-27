import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const GreenSpacesSurfaceAreaDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",

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
      return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    },
  };
