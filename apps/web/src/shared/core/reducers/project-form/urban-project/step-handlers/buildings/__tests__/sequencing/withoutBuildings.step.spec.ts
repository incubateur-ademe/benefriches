import { beforeEach, describe, expect, it, vi } from "vitest";

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

  it("forward navigation follows the no-buildings branch", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA")
      .withSiteData({
        soilsDistribution: { BUILDINGS: 0 },
        hasContaminatedSoils: false,
      } as never)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000 },
        },
      }),
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");

    store.dispatch(creationProjectFormUrbanActions.nextStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("backward navigation returns through the no-buildings branch", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION")
      .withSiteData({
        soilsDistribution: { BUILDINGS: 0 },
      } as never)
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA");
  });
});
