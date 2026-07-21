import { describe, expect, it } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";
import { stepHandlerRegistry } from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import { updateProjectFormUrbanActions } from "./updateProject.actions";
import updateProjectReducer from "./updateProject.reducer";

describe("update project reducer", () => {
  it("redirects to buildings footprint to reuse and clears it when the project building footprint changes", () => {
    const initialState = updateProjectReducer(undefined, { type: "@@INIT" });
    const steps: UrbanProjectStepsState = {
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL"] },
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
      URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1000 },
      },
      URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1000 } },
      },
      URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 2000 } },
      },
    };

    const state = structuredClone(initialState);
    state.siteData = {
      ...mockSiteData,
      hasContaminatedSoils: false,
    };
    state.siteDataLoadingState = "success";
    state.urbanProject.form.currentStep = "URBAN_PROJECT_SPACES_SURFACE_AREA";
    state.urbanProject.form.steps = steps;
    state.urbanProject.form.stepsSequence = computeStepsSequence(
      {
        context: { siteData: state.siteData },
        answers: steps,
      },
      state.urbanProject.form.firstSequenceStep,
      stepHandlerRegistry,
    );

    const pendingState = updateProjectReducer(
      state,
      updateProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SPACES_SURFACE_AREA",
        answers: {
          spacesSurfaceAreaDistribution: {
            BUILDINGS: 2500,
            IMPERMEABLE_SOILS: 7500,
          },
        },
      }),
    );

    const confirmedState = updateProjectReducer(
      pendingState,
      updateProjectFormUrbanActions.stepCompletionConfirmed(),
    );

    expect(confirmedState.urbanProject.form.currentStep).toBe(
      "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
    );
    expect(getProjectData(confirmedState.urbanProject.form.steps).buildingsFootprintToReuse).toBe(
      undefined,
    );
  });

  it("redirects to new buildings uses and clears building answers when an updated reuse footprint removes all reused buildings", () => {
    const initialState = updateProjectReducer(undefined, { type: "@@INIT" });
    const steps: UrbanProjectStepsState = {
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL"] },
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
      URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 3000 } },
      },
      URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
        completed: true,
        payload: { buildingsFootprintToReuse: 1000 },
      },
      URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1000 } },
      },
      URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 2000 } },
      },
    };

    const state = structuredClone(initialState);
    state.siteData = {
      ...mockSiteData,
      soilsDistribution: {
        ...mockSiteData.soilsDistribution,
        BUILDINGS: 2000,
      },
      hasContaminatedSoils: false,
    };
    state.siteDataLoadingState = "success";
    state.urbanProject.form.currentStep = "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE";
    state.urbanProject.form.steps = steps;
    state.urbanProject.form.stepsSequence = computeStepsSequence(
      {
        context: { siteData: state.siteData },
        answers: steps,
      },
      state.urbanProject.form.firstSequenceStep,
      stepHandlerRegistry,
    );

    const pendingState = updateProjectReducer(
      state,
      updateProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
        answers: {
          buildingsFootprintToReuse: 0,
        },
      }),
    );

    const confirmedState = updateProjectReducer(
      pendingState,
      updateProjectFormUrbanActions.stepCompletionConfirmed(),
    );

    expect(confirmedState.urbanProject.form.currentStep).toBe(
      "URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA",
    );
    const projectData = getProjectData(confirmedState.urbanProject.form.steps);
    expect(projectData.existingBuildingsUsesFloorSurfaceArea).toBeUndefined();
    expect(projectData.newBuildingsUsesFloorSurfaceArea).toBeUndefined();
  });
});
