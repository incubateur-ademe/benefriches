import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces surface area", () => {
  it("should complete step and go to URBAN_PROJECT_SPACES_SOILS_SUMMARY", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SURFACE_AREA",
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
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: {
            spacesSelection: [
              "BUILDINGS",
              "IMPERMEABLE_SOILS",
              "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            ],
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        answers: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 3000,
            IMPERMEABLE_SOILS: 4000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
          },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toMatchObject({
      URBAN_PROJECT_SPACES_SURFACE_AREA: {
        completed: true,
        payload: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 3000,
            IMPERMEABLE_SOILS: 4000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
          },
        },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  });

  it("should return previous as URBAN_PROJECT_SPACES_SELECTION", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_SURFACE_AREA",
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
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
  });

  describe("default answers", () => {
    it("should have no default values when no uses footprint surface area step exists", () => {
      const store = createTestStore({
        steps: {},
      });

      store.dispatch(
        creationProjectFormUrbanActions.navigateToStep({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        }),
      );

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(state.URBAN_PROJECT_SPACES_SURFACE_AREA?.defaultValues).toBeUndefined();
    });

    it("should have no default values when only non-building uses were selected", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFootprintSurfaceAreaDistribution: {
                PUBLIC_GREEN_SPACES: 5000,
                OTHER_PUBLIC_SPACES: 3000,
              },
            },
          },
        },
      });

      store.dispatch(
        creationProjectFormUrbanActions.navigateToStep({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        }),
      );

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(state.URBAN_PROJECT_SPACES_SURFACE_AREA?.defaultValues).toBeUndefined();
    });

    it("should have BUILDINGS surface area equal to single building use footprint", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFootprintSurfaceAreaDistribution: {
                RESIDENTIAL: 5000,
              },
            },
          },
        },
      });

      store.dispatch(
        creationProjectFormUrbanActions.navigateToStep({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        }),
      );

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(state.URBAN_PROJECT_SPACES_SURFACE_AREA?.defaultValues).toEqual({
        spacesSurfaceAreaDistribution: {
          BUILDINGS: 5000,
        },
      });
    });

    it("should have BUILDINGS surface area when building use is mixed with non-building uses", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFootprintSurfaceAreaDistribution: {
                OFFICES: 4000,
                PUBLIC_GREEN_SPACES: 6000,
              },
            },
          },
        },
      });

      store.dispatch(
        creationProjectFormUrbanActions.navigateToStep({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        }),
      );

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(state.URBAN_PROJECT_SPACES_SURFACE_AREA?.defaultValues).toEqual({
        spacesSurfaceAreaDistribution: {
          BUILDINGS: 4000,
        },
      });
    });

    it("should have BUILDINGS surface area as sum of all building uses footprints", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFootprintSurfaceAreaDistribution: {
                RESIDENTIAL: 5000,
                OFFICES: 3000,
              },
            },
          },
        },
      });

      store.dispatch(
        creationProjectFormUrbanActions.navigateToStep({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        }),
      );

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(state.URBAN_PROJECT_SPACES_SURFACE_AREA?.defaultValues).toEqual({
        spacesSurfaceAreaDistribution: {
          BUILDINGS: 8000,
        },
      });
    });

    it("should have BUILDINGS surface area as sum when mixed with non-building uses", () => {
      const store = createTestStore({
        steps: {
          URBAN_PROJECT_USES_FOOTPRINT_SURFACE_AREA: {
            completed: true,
            payload: {
              usesFootprintSurfaceAreaDistribution: {
                RESIDENTIAL: 5000,
                LOCAL_STORE: 2000,
                PUBLIC_FACILITIES: 1500,
                PUBLIC_GREEN_SPACES: 4000,
                OTHER_PUBLIC_SPACES: 500,
              },
            },
          },
        },
      });

      store.dispatch(
        creationProjectFormUrbanActions.navigateToStep({
          stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        }),
      );

      const state = store.getState().projectCreation.urbanProject.steps;
      expect(state.URBAN_PROJECT_SPACES_SURFACE_AREA?.defaultValues).toEqual({
        spacesSurfaceAreaDistribution: {
          BUILDINGS: 8500,
        },
      });
    });
  });
});
