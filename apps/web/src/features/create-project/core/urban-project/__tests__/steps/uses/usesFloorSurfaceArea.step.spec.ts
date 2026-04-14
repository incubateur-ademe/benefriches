import { beforeEach, describe, expect, it, vi } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    featureFlags: {
      urbanProjectBuildingsReuseChapterEnabled: false,
    },
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

describe("Urban project creation - Steps - Uses floor surface area", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.featureFlags.urbanProjectBuildingsReuseChapterEnabled = false;
  });

  it("should complete step and go to URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION when site has contaminated soils", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
      },
      URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
  });

  it("should complete step and go to URBAN_PROJECT_SITE_RESALE_INTRODUCTION when site has no contaminated soils", () => {
    const store = new StoreBuilder()
      .withSiteData({
        id: "site-id",
        name: "Site without contamination",
        address: {
          banId: "123",
          value: "1 rue de la Paix, 75001 Paris",
          city: "Paris",
          cityCode: "75001",
          postCode: "75001",
          streetName: "rue de la Paix",
          streetNumber: "1",
          long: 2.3,
          lat: 48.8,
        },
        isExpressSite: false,
        surfaceArea: 10000,
        nature: "FRICHE",
        hasContaminatedSoils: false,
        contaminatedSoilSurface: 0,
        owner: {
          name: "Ville de Test",
          structureType: "municipality",
        },
        soilsDistribution: {
          BUILDINGS: 5000,
          IMPERMEABLE_SOILS: 3000,
          MINERAL_SOIL: 2000,
        },
      })
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
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("should navigate to URBAN_PROJECT_BUILDINGS_INTRODUCTION when going back", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
  });

  it("should complete step and go to URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION when feature flag is ON and site has buildings", () => {
    mockedEnvVarsModule.BENEFRICHES_ENV.featureFlags.urbanProjectBuildingsReuseChapterEnabled = true;

    const store = new StoreBuilder()
      .withSiteData({
        soilsDistribution: { BUILDINGS: 2500 },
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
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_REUSE_INTRODUCTION");
  });

  it("should complete step and go to URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION when feature flag is ON and site has no buildings", () => {
    mockedEnvVarsModule.BENEFRICHES_ENV.featureFlags.urbanProjectBuildingsReuseChapterEnabled = true;

    const store = new StoreBuilder()
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
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_NEW_CONSTRUCTION_INTRODUCTION");
  });
});
