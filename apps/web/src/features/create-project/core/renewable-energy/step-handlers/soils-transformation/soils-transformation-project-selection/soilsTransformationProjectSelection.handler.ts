import {
  getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea,
  getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea,
  hasSiteSignificantBiodiversityAndClimateSensibleSoils,
  preserveCurrentSoils,
  type SoilsDistribution,
  transformSoilsForRenaturation,
} from "shared";

import { ReadStateHelper } from "../../../helpers/readState";
import type { AnswerStepHandler } from "../../stepHandler.type";

export const ProjectSelectionHandler: AnswerStepHandler<"RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"> =
  {
    stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",

    getNextStepId(context, answers) {
      if (answers?.soilsTransformationProject === "custom") {
        return "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION";
      }

      const nextStep = hasSiteSignificantBiodiversityAndClimateSensibleSoils(
        context.siteData?.soilsDistribution ?? {},
      )
        ? "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE"
        : "RENEWABLE_ENERGY_SOILS_SUMMARY";
      return nextStep;
    },

    updateAnswersMiddleware(context, answers) {
      if (answers.soilsTransformationProject === "custom") {
        return answers;
      }

      const nonSuitableSoilsSurfaceAnswers = ReadStateHelper.getStepAnswers(
        context.stepsState,
        "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
      );

      const baseSoilsDistribution: SoilsDistribution =
        nonSuitableSoilsSurfaceAnswers?.baseSoilsDistributionForTransformation ??
        context.siteData?.soilsDistribution ??
        {};

      const electricalPowerKWc =
        ReadStateHelper.getStepAnswers(context.stepsState, "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
          ?.photovoltaicInstallationElectricalPowerKWc ?? 0;

      const recommendedImpermeableSurfaceArea =
        getRecommendedPhotovoltaicPanelsFoundationsSurfaceArea(electricalPowerKWc);
      const recommendedMineralSurfaceArea =
        getRecommendedPhotovoltaicPanelsAccessPathSurfaceArea(electricalPowerKWc);

      const transformationFn =
        answers.soilsTransformationProject === "renaturation"
          ? transformSoilsForRenaturation
          : preserveCurrentSoils;

      const soilsDistribution = transformationFn(baseSoilsDistribution, {
        recommendedImpermeableSurfaceArea,
        recommendedMineralSurfaceArea,
      });

      return { ...answers, soilsDistribution };
    },
  };
