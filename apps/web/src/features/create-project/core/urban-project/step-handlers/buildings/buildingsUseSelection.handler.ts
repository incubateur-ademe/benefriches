import { ReadStateHelper } from "@/shared/core/reducers/project-form/urban-project/helpers/readState";

import { AnswerStepHandler } from "../stepHandler.type";
import { BuildingsUseSurfaceAreaDistributionHandler } from "./buildingsUseSurfaceAreaDistribution.handler";

export const BuildingsUseSelectionHandler: AnswerStepHandler<"URBAN_PROJECT_BUILDINGS_USE_SELECTION"> =
  {
    stepId: "URBAN_PROJECT_BUILDINGS_USE_SELECTION",

    getPreviousStepId() {
      return "URBAN_PROJECT_BUILDINGS_USE_INTRODUCTION";
    },

    getNextStepId() {
      return "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION";
    },

    // invalidate buildings use surface area distribution step if step was already completed and buildings uses selection changed
    getDependencyRules(context, newAnswers) {
      const previousAnswer = ReadStateHelper.getStepAnswers(context.stepsState, this.stepId);
      const hasPreviousAnswer = !!previousAnswer;
      const previousBuildingsUseSelection = previousAnswer?.buildingsUsesSelection ?? [];
      const newBuildingsUseSelection = newAnswers.buildingsUsesSelection ?? [];
      if (
        !hasPreviousAnswer ||
        (previousBuildingsUseSelection.length === newBuildingsUseSelection.length &&
          previousBuildingsUseSelection.every((use) => newBuildingsUseSelection.includes(use)))
      ) {
        return [];
      }
      return [
        { stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION", action: "invalidate" },
      ];
    },

    // skip the surface area distribution step when only one buildings use is selected
    // and set the total buildings surface area to this use
    getShortcut(context, answers) {
      if (answers.buildingsUsesSelection?.length === 1) {
        const uniqueBuildingsUse = answers.buildingsUsesSelection[0]!;
        const buildingsFloorSurfaceArea =
          ReadStateHelper.getStepAnswers(
            context.stepsState,
            "URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA",
          )?.buildingsFloorSurfaceArea ?? 0;
        return {
          complete: [
            {
              stepId: "URBAN_PROJECT_BUILDINGS_USE_SURFACE_AREA_DISTRIBUTION",
              answers: {
                buildingsUsesDistribution: {
                  [uniqueBuildingsUse]: buildingsFloorSurfaceArea,
                },
              },
            },
          ],
          next: BuildingsUseSurfaceAreaDistributionHandler.getNextStepId(context),
        };
      }

      return undefined;
    },
  };
