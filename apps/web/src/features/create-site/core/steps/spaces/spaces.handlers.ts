import {
  getSoilsDistributionForAgriculturalOperationActivity,
  getSoilsDistributionForFricheActivity,
  getSoilsDistributionForNaturalAreaType,
  SoilsDistribution,
  SurfaceAreaDistribution,
  typedObjectKeys,
} from "shared";

import { splitEvenly } from "@/shared/core/split-number/splitNumber";

import type { CustomAnswerStepHandler } from "../../custom/stepHandlerRegistry";

export const spacesHandlers = {
  // Cross-flow hand-off: when the site is an urban zone, the surface area is the last step this
  // registry owns — the wizard-form engine hands control to the urban-zone sub-flow right after
  // (see custom.reducer.ts's stepCompletionRequested case). getNextStepId still needs to return
  // a value known to this registry, so it self-targets; this "next" is never actually shown —
  // the reducer overrides `currentStep` immediately after applying this step's changes.
  SURFACE_AREA: {
    stepId: "SURFACE_AREA",
    getNextStepId: ({ context }) =>
      context.siteData.nature === "URBAN_ZONE" ? "SURFACE_AREA" : "SPACES_KNOWLEDGE",
  } satisfies CustomAnswerStepHandler<"SURFACE_AREA">,

  SPACES_KNOWLEDGE: {
    stepId: "SPACES_KNOWLEDGE",
    getNextStepId: (_params, answers) =>
      answers?.knowsSpaces ? "SPACES_SELECTION" : "SOILS_SUMMARY",
    updateAnswersMiddleware: ({ context }, answers) => {
      const knowsSpaces = answers.knowsSpaces;
      if (knowsSpaces) {
        return { knowsSpaces };
      }

      const surfaceArea = context.siteData.surfaceArea ?? 0;
      let soilsDistribution: SoilsDistribution | undefined;

      switch (context.siteData.nature) {
        case "FRICHE":
          soilsDistribution = getSoilsDistributionForFricheActivity(
            surfaceArea,
            context.siteData.fricheActivity ?? "OTHER",
          );
          break;
        case "AGRICULTURAL_OPERATION":
          if (context.siteData.agriculturalOperationActivity) {
            soilsDistribution = getSoilsDistributionForAgriculturalOperationActivity(
              surfaceArea,
              context.siteData.agriculturalOperationActivity,
            );
          }
          break;
        case "NATURAL_AREA":
          if (context.siteData.naturalAreaType) {
            soilsDistribution = getSoilsDistributionForNaturalAreaType(
              surfaceArea,
              context.siteData.naturalAreaType,
            );
          }
          break;
      }

      return {
        knowsSpaces,
        soilsDistribution,
        soils: typedObjectKeys(soilsDistribution ?? {}),
      };
    },
  } satisfies CustomAnswerStepHandler<"SPACES_KNOWLEDGE">,

  SPACES_SELECTION: {
    stepId: "SPACES_SELECTION",
    getNextStepId: (_params, answers) =>
      (answers?.soils.length ?? 0) === 1
        ? "SOILS_CARBON_STORAGE"
        : "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
    updateAnswersMiddleware: ({ context }, answers) => {
      if (answers.soils.length !== 1) {
        return { soils: answers.soils };
      }

      const totalSurface = context.siteData.surfaceArea ?? 0;
      const distribution = new SurfaceAreaDistribution();
      distribution.addSurface(answers.soils[0]!, totalSurface);

      return { soils: answers.soils, soilsDistribution: distribution.toJSON() };
    },
  } satisfies CustomAnswerStepHandler<"SPACES_SELECTION">,

  SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE: {
    stepId: "SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE",
    getNextStepId: (_params, answers) =>
      answers?.knowsSurfaceAreas ? "SPACES_SURFACE_AREA_DISTRIBUTION" : "SOILS_SUMMARY",
    updateAnswersMiddleware: ({ context }, answers) => {
      const { knowsSurfaceAreas } = answers;
      if (knowsSurfaceAreas) {
        return { knowsSurfaceAreas };
      }

      const totalSurface = context.siteData.surfaceArea ?? 0;
      const soils = context.siteData.soils;
      const surfaceSplit = splitEvenly(totalSurface, soils.length);
      const soilsDistribution: SoilsDistribution = {};
      soils.forEach((soilType, index) => {
        soilsDistribution[soilType] = surfaceSplit[index];
      });

      return { knowsSurfaceAreas, soilsDistribution };
    },
  } satisfies CustomAnswerStepHandler<"SPACES_SURFACE_AREAS_DISTRIBUTION_KNOWLEDGE">,

  SPACES_SURFACE_AREA_DISTRIBUTION: {
    stepId: "SPACES_SURFACE_AREA_DISTRIBUTION",
    getNextStepId: () => "SOILS_SUMMARY",
  } satisfies CustomAnswerStepHandler<"SPACES_SURFACE_AREA_DISTRIBUTION">,
};
