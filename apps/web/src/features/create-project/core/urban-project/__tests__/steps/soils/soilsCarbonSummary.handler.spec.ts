import { beforeEach, describe, expect, it, vi } from "vitest";

import { SoilsCarbonSummaryHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/soils/soils-carbon-summary/soilsCarbonSummary.handler";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    featureFlags: {
      urbanProjectBuildingsReuseChapterEnabled: false,
    },
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

describe("SoilsCarbonSummaryHandler", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.featureFlags.urbanProjectBuildingsReuseChapterEnabled = false;
  });

  describe("getNextStepId", () => {
    it("routes to BUILDINGS_INTRODUCTION when project will have buildings", () => {
      const nextStep = SoilsCarbonSummaryHandler.getNextStepId({
        stepsState: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
        },
        siteData: {
          soilsDistribution: { BUILDINGS: 0 },
          hasContaminatedSoils: false,
        } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });

    it("routes to BUILDINGS_INTRODUCTION when site has existing buildings and feature flag is ON even if willHaveBuildings is false", () => {
      mockedEnvVarsModule.BENEFRICHES_ENV.featureFlags.urbanProjectBuildingsReuseChapterEnabled = true;

      const nextStep = SoilsCarbonSummaryHandler.getNextStepId({
        stepsState: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
          },
        },
        siteData: {
          soilsDistribution: { BUILDINGS: 1200 },
          hasContaminatedSoils: true,
        } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });

    it("skips buildings chapter when site has existing buildings but feature flag is OFF and willHaveBuildings is false", () => {
      const nextStep = SoilsCarbonSummaryHandler.getNextStepId({
        stepsState: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
          },
        },
        siteData: {
          soilsDistribution: { BUILDINGS: 1200 },
          hasContaminatedSoils: true,
        } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });

    it("skips buildings chapter and routes to SOILS_DECONTAMINATION_INTRODUCTION when site has no buildings and willHaveBuildings is false on contaminated site", () => {
      const nextStep = SoilsCarbonSummaryHandler.getNextStepId({
        stepsState: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
          },
        },
        siteData: {
          soilsDistribution: { BUILDINGS: 0 },
          hasContaminatedSoils: true,
        } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });

    it("skips buildings chapter and routes to SITE_RESALE_INTRODUCTION when site has no buildings and willHaveBuildings is false on non-contaminated site", () => {
      const nextStep = SoilsCarbonSummaryHandler.getNextStepId({
        stepsState: {
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
          },
        },
        siteData: {
          soilsDistribution: { BUILDINGS: 0 },
          hasContaminatedSoils: false,
        } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });
  });
});
