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

describe("Urban project buildings sequencing - reuse only with demolition", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
  });

  describe("forward navigation", () => {
    it("URBAN_PROJECT_BUILDINGS_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE -> URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO -> URBAN_PROJECT_SITE_RESALE_INTRODUCTION | non-contaminated site exits to resale", () => {
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
              spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 1500 } },
        }),
      );
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 1500 },
        }),
      );
      // FOOTPRINT_TO_REUSE has getDependencyRules — reducer requires confirmation before navigating
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    });

    it("URBAN_PROJECT_BUILDINGS_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE -> URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO -> URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION | contaminated site exits to decontamination", () => {
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
              spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
            },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
          answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 1500 } },
        }),
      );
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

      store.dispatch(
        creationProjectFormUrbanActions.stepCompletionRequested({
          stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
          answers: { buildingsFootprintToReuse: 1500 },
        }),
      );
      store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO");

      store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
    });
  });

  describe("backward navigation", () => {
    it("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE -> URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO -> URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE | demolition step goes back to footprint", () => {
      const store = new StoreBuilder()
        .withCurrentStep("URBAN_PROJECT_BUILDINGS_DEMOLITION_INFO")
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
              spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1500 },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");
    });

    // TODO(S10): backward route is incomplete — currently skips intermediate steps because
    // SITE_RESALE_INTRODUCTION / SOILS_DECONTAMINATION_INTRODUCTION getPreviousStepId hasn't been
    // updated yet. Will be expanded to full reverse chain when S10 is implemented.
    it("URBAN_PROJECT_SITE_RESALE_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_INTRODUCTION | resale intro currently jumps back to buildings uses", () => {
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
              spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1500 },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });

    // TODO(S10): backward route is incomplete — currently skips intermediate steps because
    // SITE_RESALE_INTRODUCTION / SOILS_DECONTAMINATION_INTRODUCTION getPreviousStepId hasn't been
    // updated yet. Will be expanded to full reverse chain when S10 is implemented.
    it("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_INTRODUCTION | decontamination intro currently jumps back to buildings uses", () => {
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
              spacesSurfaceAreaDistribution: { BUILDINGS: 1500, IMPERMEABLE_SOILS: 8500 },
            },
          },
          URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
            completed: true,
            payload: { buildingsFootprintToReuse: 1500 },
          },
        })
        .build();

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

      store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
      expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
    });
  });
});
