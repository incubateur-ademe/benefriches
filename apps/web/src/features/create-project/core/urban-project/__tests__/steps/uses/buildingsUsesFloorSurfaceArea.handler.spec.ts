import { beforeEach, describe, expect, it, vi } from "vitest";

import { BuildingsUsesFloorSurfaceAreaHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    urbanProjectBuildingsReuseChapterEnabled: false,
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

describe("BuildingsUsesFloorSurfaceAreaHandler", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = false;
  });

  describe("feature flag OFF", () => {
    it("routes to SOILS_DECONTAMINATION_INTRODUCTION when site has contaminated soils", () => {
      const nextStep = BuildingsUsesFloorSurfaceAreaHandler.getNextStepId({
        stepsState: {},
        siteData: { hasContaminatedSoils: true } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });

    it("routes to SITE_RESALE_INTRODUCTION when site has no contaminated soils", () => {
      const nextStep = BuildingsUsesFloorSurfaceAreaHandler.getNextStepId({
        stepsState: {},
        siteData: { hasContaminatedSoils: false } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });
  });

  describe("feature flag ON", () => {
    it("routes to BUILDINGS_REUSE_INTRODUCTION when site has existing buildings", () => {
      mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;

      const nextStep = BuildingsUsesFloorSurfaceAreaHandler.getNextStepId({
        stepsState: {},
        siteData: { soilsDistribution: { BUILDINGS: 2500 } } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");
    });

    it("routes to BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION when site has no buildings", () => {
      mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;

      const nextStep = BuildingsUsesFloorSurfaceAreaHandler.getNextStepId({
        stepsState: {},
        siteData: { soilsDistribution: { BUILDINGS: 0 } } as never,
      });

      expect(nextStep).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");
    });
  });
});
