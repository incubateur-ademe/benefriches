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

describe("Urban project buildings sequencing - new construction only with demolition", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
  });

  describe("forward navigation", () => {
    it("demolishes all existing buildings then shows new construction info before site resale (non-contaminated)", () => {
      // INTRO -> FLOOR_AREA -> REUSE_INTRO -> REUSE_FOOTPRINT(0) -> DEMOLITION_INFO -> NEW_CONSTRUCTION_INFO -> SITE_RESALE_INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2500 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 3000 } },
        }),
      );
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 0 },
        }),
      );
      // FOOTPRINT_TO_REUSE has getDependencyRules — reducer requires confirmation before navigating
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("exits to decontamination instead of resale when site has contaminated soils", () => {
      // INTRO -> FLOOR_AREA -> REUSE_INTRO -> REUSE_FOOTPRINT(0) -> DEMOLITION_INFO -> NEW_CONSTRUCTION_INFO -> SOILS_DECONTAMINATION_INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2500 },
          hasContaminatedSoils: true,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 3000 } },
        }),
      );
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 0 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("backward navigation", () => {
    it("goes back from site resale to introduction (non-contaminated)", () => {
      // SITE_RESALE_INTRO -> NEW_CONSTRUCTION_INFO -> DEMOLITION_INFO -> REUSE_FOOTPRINT -> REUSE_INTRO -> FLOOR_AREA -> INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2500 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 0 },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });

    it("goes back from decontamination to introduction (contaminated)", () => {
      // SOILS_DECONTAMINATION_INTRO -> NEW_CONSTRUCTION_INFO -> DEMOLITION_INFO -> REUSE_FOOTPRINT -> REUSE_INTRO -> FLOOR_AREA -> INTRO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2500 },
          hasContaminatedSoils: true,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 0 },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });

    it("goes back from new construction info to demolition info", () => {
      // NEW_CONSTRUCTION_INFO -> DEMOLITION_INFO
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INFO")
        .withSiteData({
          soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2500 },
          hasContaminatedSoils: false,
        })
        .withSteps({
          URBAN_PROJECT_USES_SELECTION: {
            completed: true,
            payload: { usesSelection: ["RESIDENTIAL"] },
          },
          URBAN_PROJECT_SPACES_SURFACE_AREA: {
            completed: true,
            payload: {
              spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 0 },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");
    });
  });
});
