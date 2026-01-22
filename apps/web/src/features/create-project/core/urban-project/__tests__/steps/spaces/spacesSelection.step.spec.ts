import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import type { AnswersByStep } from "@/shared/core/reducers/project-form/urban-project/urbanProjectSteps";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces selection", () => {
  it("should complete step with selected spaces and go to URBAN_PROJECT_SPACES_SURFACE_AREA", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, PUBLIC_GREEN_SPACES: 5000 },
          },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: {
          spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"],
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toMatchObject({
      URBAN_PROJECT_SPACES_SELECTION: {
        completed: true,
        payload: {
          spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"],
        },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });

  it("should return previous as URBAN_PROJECT_SPACES_INTRODUCTION", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should have BUILDINGS and existing constrained soils in default answers when uses include building use", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, PUBLIC_GREEN_SPACES: 5000 },
          },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.navigateToStep({ stepId: "URBAN_PROJECT_SPACES_SELECTION" }),
    );

    const state = store.getState().projectCreation.urbanProject.steps;

    // mockSiteData has PRAIRIE_GRASS which is a constrained soil
    // So default answers should include both BUILDINGS (due to building uses) and PRAIRIE_GRASS
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues).toEqual({
      spacesSelection: ["BUILDINGS", "PRAIRIE_GRASS"],
    });
  });

  it("should NOT have BUILDINGS in default answers when no building uses selected", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: {
              PUBLIC_GREEN_SPACES: 5000,
              OTHER_PUBLIC_SPACES: 5000,
            },
          },
        },
      },
    });

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.navigateToStep({ stepId: "URBAN_PROJECT_SPACES_SELECTION" }),
    );

    const state = store.getState().projectCreation.urbanProject.steps;

    // Only constrained soils from site should be in default (PRAIRIE_GRASS exists in mockSiteData)
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues).toEqual({
      spacesSelection: ["PRAIRIE_GRASS"],
    });
  });

  it("should include existing constrained soils from site in default answers", () => {
    const store = createTestStore({
      siteData: {
        id: "test-site",
        name: "Test Site",
        address: {
          value: "123 Test City",
          city: "Test City",
          cityCode: "12345",
          postCode: "12345",
          long: 0,
          lat: 0,
        },
        isExpressSite: false,
        surfaceArea: 10000,
        nature: "FRICHE",
        hasContaminatedSoils: false,
        owner: { name: "Owner", structureType: "municipality" },
        soilsDistribution: {
          BUILDINGS: 2000,
          PRAIRIE_GRASS: 3000,
          FOREST_DECIDUOUS: 2000,
          MINERAL_SOIL: 3000,
        },
      },
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { PUBLIC_GREEN_SPACES: 10000 } },
        },
      },
    });

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.navigateToStep({ stepId: "URBAN_PROJECT_SPACES_SELECTION" }),
    );

    const state = store.getState().projectCreation.urbanProject.steps;

    // Should include both constrained soils that exist on site
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).toContain(
      "PRAIRIE_GRASS",
    );
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).toContain(
      "FOREST_DECIDUOUS",
    );
    // Should NOT include non-constrained soils
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).not.toContain(
      "BUILDINGS",
    );
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).not.toContain(
      "MINERAL_SOIL",
    );
  });

  it("should include BUILDINGS AND existing constrained soils when building uses selected", () => {
    const store = createTestStore({
      siteData: {
        id: "test-site",
        name: "Test Site",
        address: {
          value: "123 Test City",
          city: "Test City",
          cityCode: "12345",
          postCode: "12345",
          long: 0,
          lat: 0,
        },
        isExpressSite: false,
        surfaceArea: 10000,
        nature: "FRICHE",
        hasContaminatedSoils: false,
        owner: { name: "Owner", structureType: "municipality" },
        soilsDistribution: {
          BUILDINGS: 2000,
          PRAIRIE_GRASS: 3000,
          WET_LAND: 2000,
          MINERAL_SOIL: 3000,
        },
      },
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: {
            usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 5000, PUBLIC_GREEN_SPACES: 5000 },
          },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.navigateToStep({ stepId: "URBAN_PROJECT_SPACES_SELECTION" }),
    );

    const state = store.getState().projectCreation.urbanProject.steps;

    // Should include BUILDINGS (because of building uses) and constrained soils from site
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).toContain(
      "BUILDINGS",
    );
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).toContain(
      "PRAIRIE_GRASS",
    );
    expect(state.URBAN_PROJECT_SPACES_SELECTION?.defaultValues?.spacesSelection).toContain(
      "WET_LAND",
    );
  });

  it("should delete surface area step when selection changes", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
      },
    });

    const newAnswer = {
      spacesSelection: ["BUILDINGS", "MINERAL_SOIL"],
    } satisfies AnswersByStep["URBAN_PROJECT_SPACES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: newAnswer,
      }),
    );

    // Should trigger pending changes with delete rule
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toEqual<
      ProjectFormState["urbanProject"]["pendingStepCompletion"]
    >({
      showAlert: true,
      changes: {
        payload: {
          stepId: "URBAN_PROJECT_SPACES_SELECTION",
          answers: newAnswer,
        },
        cascadingChanges: [{ action: "delete", stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA" }],
        navigationTarget: "URBAN_PROJECT_SPACES_SURFACE_AREA",
      },
    });

    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    expect(
      store.getState().projectCreation.urbanProject.steps.URBAN_PROJECT_SPACES_SURFACE_AREA,
    ).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });

  it("should not trigger cascading changes when spaces selection remains the same", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SELECTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
          completed: true,
          payload: { usesFootprintSurfaceAreaDistribution: { RESIDENTIAL: 10000 } },
        },
        URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: {
          spacesSelection: ["IMPERMEABLE_SOILS", "BUILDINGS"], // Same spaces, different order
        },
      }),
    );

    // No cascading changes, direct completion
    expect(store.getState().projectCreation.urbanProject.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });
});
