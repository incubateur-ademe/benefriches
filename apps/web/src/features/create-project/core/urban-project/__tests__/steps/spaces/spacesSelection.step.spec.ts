import { describe, it, expect } from "vitest";

import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";
import { createUrbanProjectFormSelectors } from "@/features/create-project/core/urban-project/urbanProjectForm.selectors";
import type { AnswersByStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { selectSpacesSelectionViewData } = createUrbanProjectFormSelectors("projectCreation");

describe("Urban project creation - Steps - Spaces selection", () => {
  it("should complete step with selected spaces and go to URBAN_PROJECT_SPACES_SURFACE_AREA", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SELECTION")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: {
          spacesSelection: ["BUILDINGS", "IMPERMEABLE_SOILS", "ARTIFICIAL_GRASS_OR_BUSHES_FILLED"],
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });

  it("should return previous as URBAN_PROJECT_SPACES_INTRODUCTION when no public green spaces", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SELECTION")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should return previous as URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION when public green spaces selected", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SELECTION")
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { publicGreenSpacesSurfaceArea: 5000 },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          payload: {
            publicGreenSpacesSoilsDistribution: {
              PRAIRIE_GRASS: 2000,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
            },
          },
        },
      })
      .build();

    store.dispatch(creationProjectFormUrbanActions.previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION");
  });

  it("should pre-select BUILDINGS by default when uses include a building use", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      })
      .build();

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.stepNavigationRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
      }),
    );

    // The spaces selection the user sees defaults to BUILDINGS.
    expect(selectSpacesSelectionViewData(store.getState()).selectedSpaces).toEqual(["BUILDINGS"]);
  });

  it("should NOT pre-select BUILDINGS when no building uses selected", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
      })
      .build();

    // Navigate to step to compute default values
    store.dispatch(
      creationProjectFormUrbanActions.stepNavigationRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
      }),
    );

    // Without a building use, nothing is pre-selected.
    expect(selectSpacesSelectionViewData(store.getState()).selectedSpaces).toEqual([]);
  });

  it("should delete the surface area answer when selection changes, forcing re-entry", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SELECTION")
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
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
      })
      .build();

    const newAnswer = {
      spacesSelection: ["BUILDINGS", "MINERAL_SOIL"],
    } satisfies AnswersByStep["URBAN_PROJECT_SPACES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: newAnswer,
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

    // Surface area answer was cascaded away and navigation returns to it for re-entry.
    const surfaceAreaStep =
      store.getState().projectCreation.urbanProject.form.steps.URBAN_PROJECT_SPACES_SURFACE_AREA;
    expect(surfaceAreaStep).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });

  it("should delete all persisted building answer steps when BUILDINGS is removed from spaces", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SELECTION")
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
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1200 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1200 } },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 800 } },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
        URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
          completed: true,
          payload: { buildingsConstructionWorks: 90000 },
        },
      })
      .build();

    const newAnswer = {
      spacesSelection: ["IMPERMEABLE_SOILS"],
    } satisfies AnswersByStep["URBAN_PROJECT_SPACES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: newAnswer,
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

    // Removing BUILDINGS cascades away the surface area answer and every persisted building answer.
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
    expect(
      store.getState().projectCreation.urbanProject.form.steps.URBAN_PROJECT_SPACES_SURFACE_AREA,
    ).toBeUndefined();
    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);
    expect(projectData.developmentPlan?.features.buildingsFloorAreaDistribution).toEqual({});
    expect(projectData.buildingsFootprintToReuse).toBeUndefined();
    expect(projectData.existingBuildingsUsesFloorSurfaceArea).toBeUndefined();
    expect(projectData.newBuildingsUsesFloorSurfaceArea).toBeUndefined();
    expect(projectData.developerWillBeBuildingsConstructor).toBeUndefined();
    expect(projectData.buildingsConstructionAndRehabilitationExpenses).toBeUndefined();
  });

  it("should not trigger cascading changes when spaces selection remains the same", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_PROJECT_SPACES_SELECTION")
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
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 6000, IMPERMEABLE_SOILS: 4000 },
          },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SELECTION",
        answers: {
          spacesSelection: ["IMPERMEABLE_SOILS", "BUILDINGS"], // Same spaces, different order
        },
      }),
    );

    // No cascading changes, direct completion (no confirmation dialog pending).
    expect(
      store.getState().projectCreation.urbanProject.form.pendingStepCompletion,
    ).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SURFACE_AREA");
  });
});
