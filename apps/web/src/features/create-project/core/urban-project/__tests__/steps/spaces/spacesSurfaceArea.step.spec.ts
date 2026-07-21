import { describe, it, expect } from "vitest";

import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces surface area", () => {
  it("should complete step and go to URBAN_PROJECT_SPACES_SOILS_SUMMARY", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SURFACE_AREA")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
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
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
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

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  });

  it("should return previous as URBAN_PROJECT_SPACES_SELECTION", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SURFACE_AREA")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
  });

  it("should invalidate the buildings footprint to reuse answer when the project building footprint changes", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SURFACE_AREA")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 3000 } },
        },
        URBAN_PROJECT_SPACES_SELECTION: {
          completed: true,
          payload: { spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1000 },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        answers: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 2500,
            IMPERMEABLE_SOILS: 7500,
          },
        },
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

    // Navigation proceeds to the soils summary and the now-stale footprint answer is invalidated
    // (cleared, so it drops out of the submitted project data until re-entered).
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);
    expect(projectData.buildingsFootprintToReuse).toBeUndefined();
  });
});
