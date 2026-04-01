import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/urban-project/__tests__/_testStoreHelpers";
import { creationProjectFormUrbanActions } from "@/features/create-project/core/urban-project/urbanProject.actions";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    urbanProjectBuildingsReuseChapterEnabled: true,
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

describe("Urban project buildings sequencing - without buildings", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
  });

  describe("forward navigation", () => {
    it("skips reuse steps and goes directly to new construction then site resale (non-contaminated)", () => {
      // INTRO -> FLOOR_AREA -> NEW_CONSTRUCTION_INTRO -> SITE_RESALE_INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        }),
      );
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("exits to decontamination instead of resale when site has contaminated soils", () => {
      // INTRO -> FLOOR_AREA -> NEW_CONSTRUCTION_INTRO -> SOILS_DECONTAMINATION_INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          hasContaminatedSoils: true,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        }),
      );
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("backward navigation", () => {
    it("goes back from site resale to introduction (non-contaminated)", () => {
      // SITE_RESALE_INTRO -> NEW_CONSTRUCTION_INTRO -> FLOOR_AREA -> INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });

    it("goes back from decontamination to introduction (contaminated)", () => {
      // SOILS_DECONTAMINATION_INTRO -> NEW_CONSTRUCTION_INTRO -> FLOOR_AREA -> INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 0 },
          hasContaminatedSoils: true,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });
  });
});
