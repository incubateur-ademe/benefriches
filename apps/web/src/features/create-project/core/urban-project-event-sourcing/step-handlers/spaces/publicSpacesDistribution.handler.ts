import { FormState } from "../../form-state/formState";
import { AnswerStepHandler } from "../stepHandler.type";

export const PublicSpacesDistributionHandler: AnswerStepHandler<"URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION"> =
  {
    stepId: "URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION",

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
      return "URBAN_PROJECT_PUBLIC_SPACES_INTRODUCTION";
    },

    getNextStepId(context) {
      const spacesCategoriesDistribution = FormState.getStepAnswers(
        context.urbanProjectEventSourcing.events,
        "URBAN_PROJECT_SPACES_CATEGORIES_SURFACE_AREA",
      )?.spacesCategoriesDistribution;

      if (spacesCategoriesDistribution?.GREEN_SPACES) {
        return "URBAN_PROJECT_GREEN_SPACES_INTRODUCTION";
      }

      return "URBAN_PROJECT_SPACES_SOILS_SUMMARY";
    },
  };
