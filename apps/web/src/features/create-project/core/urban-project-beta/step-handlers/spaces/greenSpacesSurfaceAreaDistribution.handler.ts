import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler } from "../stepHandler.type";

export const GreenSpacesSurfaceAreaDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION",

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
      return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    },
  };
