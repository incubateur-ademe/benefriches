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

describe("Urban project buildings sequencing - reuse only without demolition", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
  });

  it("URBAN_PROJECT_BUILDINGS_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE -> URBAN_PROJECT_SITE_RESALE_INTRODUCTION", () => {
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
            spacesSurfaceAreaDistribution: { BUILDINGS: 2500, IMPERMEABLE_SOILS: 7500 },
          },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2500 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

    store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
        answers: { buildingsFootprintToReuse: 2500 },
      }),
    );
    // FOOTPRINT_TO_REUSE has getDependencyRules — reducer requires confirmation before navigating
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  // TODO(S10): backward route is incomplete — currently skips intermediate steps because
  // SITE_RESALE_INTRODUCTION / SOILS_DECONTAMINATION_INTRODUCTION getPreviousStepId hasn't been
  // updated yet. Will be expanded to full reverse chain when S10 is implemented.
  it("URBAN_PROJECT_SITE_RESALE_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_INTRODUCTION", () => {
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
            spacesSurfaceAreaDistribution: { BUILDINGS: 2500, IMPERMEABLE_SOILS: 7500 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2500 },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
  });

  it("URBAN_PROJECT_BUILDINGS_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE -> URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION", () => {
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
            spacesSurfaceAreaDistribution: { BUILDINGS: 2500, IMPERMEABLE_SOILS: 7500 },
          },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 2500 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");

    store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE");

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
        answers: { buildingsFootprintToReuse: 2500 },
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
  });

  // TODO(S10): backward route is incomplete — currently skips intermediate steps because
  // SITE_RESALE_INTRODUCTION / SOILS_DECONTAMINATION_INTRODUCTION getPreviousStepId hasn't been
  // updated yet. Will be expanded to full reverse chain when S10 is implemented.
  it("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION -> URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA -> URBAN_PROJECT_BUILDINGS_INTRODUCTION", () => {
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
            spacesSurfaceAreaDistribution: { BUILDINGS: 2500, IMPERMEABLE_SOILS: 7500 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 2500 },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
  });
});
