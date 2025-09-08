import { ReadStateHelper } from "../../helpers/readState";
import { AnswerStepHandler } from "../stepHandler.type";

export const PublicSpacesDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",

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
      return "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION";
    },

    getNextStepId(context) {
      const spacesCategoriesDistribution = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      )?.spacesCategoriesDistribution;

      if (spacesCategoriesDistribution?.GREEN_SPACES) {
        return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
      }

      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    },
  };
