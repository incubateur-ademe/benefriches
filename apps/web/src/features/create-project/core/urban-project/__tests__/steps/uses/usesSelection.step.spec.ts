import { describe, it, expect } from "vitest";

import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";
import { AnswersByStep } from "@/features/create-project/core/urban-project/urbanProjectSteps";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses selection", () => {
  it("should complete step with PUBLIC_GREEN_SPACES and go to URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");
  });

  it("should complete step with only PUBLIC_GREEN_SPACES and skip the surface area step", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["PUBLIC_GREEN_SPACES"],
        },
      }),
    );

    // With a single PUBLIC_GREEN_SPACES use, the surface area step is shortcut (auto-filled with
    // the site surface area) and navigation jumps straight to the spaces introduction.
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should complete step with only building uses (no PUBLIC_GREEN_SPACES) and go to URBAN_PROJECT_SPACES_INTRODUCTION", () => {
    const store = new StoreBuilder().build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["RESIDENTIAL", "OFFICES"],
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });

  it("should delete the buildings floor surface area answer when uses selection changes", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
        },
      })
      .build();

    const newAnswer = {
      usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"],
    } satisfies AnswersByStep["URBAN_PROJECT_USES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: newAnswer,
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");
    // The dependent buildings floor surface area answer was cascaded away.
    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);
    expect(projectData.developmentPlan?.features.buildingsFloorAreaDistribution).toEqual({});
  });

  it("should delete all persisted building answer steps when building uses are removed", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
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
          payload: { newBuildingsUsesFloorSurfaceArea: { OFFICES: 800 } },
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
      usesSelection: ["OTHER_PUBLIC_SPACES"],
    } satisfies AnswersByStep["URBAN_PROJECT_USES_SELECTION"];

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: newAnswer,
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.stepCompletionConfirmed());

    // Removing all building uses cascades away every persisted building answer and routes back
    // to the spaces introduction.
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
    const projectData = getProjectData(store.getState().projectCreation.urbanProject.form.steps);
    expect(projectData.developmentPlan?.features.buildingsFloorAreaDistribution).toEqual({});
    expect(projectData.buildingsFootprintToReuse).toBeUndefined();
    expect(projectData.existingBuildingsUsesFloorSurfaceArea).toBeUndefined();
    expect(projectData.newBuildingsUsesFloorSurfaceArea).toBeUndefined();
    expect(projectData.developerWillBeBuildingsConstructor).toBeUndefined();
    expect(projectData.buildingsConstructionAndRehabilitationExpenses).toBeUndefined();
  });

  it("should not trigger cascading changes when uses selection remains the same", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
        },
      })
      .build();

    store.dispatch(
      creationProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_USES_SELECTION",
        answers: {
          usesSelection: ["OFFICES", "RESIDENTIAL"], // Same uses, different order
        },
      }),
    );

    // No cascading changes, direct completion (no confirmation dialog pending).
    expect(
      store.getState().projectCreation.urbanProject.form.pendingStepCompletion,
    ).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });
});
