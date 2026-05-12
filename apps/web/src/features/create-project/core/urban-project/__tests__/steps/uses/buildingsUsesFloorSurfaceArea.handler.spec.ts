import { describe, expect, it } from "vitest";

import { BuildingsUsesFloorSurfaceAreaHandler } from "@/shared/core/reducers/project-form/urban-project/step-handlers/buildings/buildings-uses-floor-surface-area/buildingsUsesFloorSurfaceArea.handler";

describe("BuildingsUsesFloorSurfaceAreaHandler", () => {
  it("routes to BUILDINGS_REUSE_INTRODUCTION when site has existing buildings", () => {
    const nextStep = BuildingsUsesFloorSurfaceAreaHandler.getNextStepId({
      stepsState: {},
      siteData: { soilsDistribution: { BUILDINGS: 2500 } } as never,
    });

    expect(nextStep).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");
  });

  it("routes to BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION when site has no buildings", () => {
    const nextStep = BuildingsUsesFloorSurfaceAreaHandler.getNextStepId({
      stepsState: {},
      siteData: { soilsDistribution: { BUILDINGS: 0 } } as never,
    });

    expect(nextStep).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");
  });
});
