import { ReadStateHelper } from "../../helpers/readState";
import { getReinstatementCostsRecomputationRules } from "../spaces/getCommonRules";
import { AnswerStepHandler } from "../stepHandler.type";

export const SoilsDecontaminationSurfaceAreaHandler: AnswerStepHandler<"URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA"> =
  {
    stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",

    getDependencyRules(context, newAnswers) {
      const currentValue = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "URBAN_PROJECT_SOILS_DECONTAMINATION_SURFACE_AREA",
      )?.decontaminatedSurfaceArea;
      if (currentValue === newAnswers.decontaminatedSurfaceArea) {
        return [];
      }
      return getReinstatementCostsRecomputationRules(context);
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
