import { beforeEach, describe, expect, it, vi } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";
import { computeProjectStepsSequence } from "@/shared/core/reducers/project-form/urban-project/helpers/stepsSequence";

import { updateProjectFormUrbanActions } from "./updateProject.actions";
import updateProjectReducer from "./updateProject.reducer";

const mockedEnvVarsModule = vi.hoisted(() => ({
  BENEFRICHES_ENV: {
    urbanProjectBuildingsReuseChapterEnabled: false,
  },
}));

vi.mock("@/app/envVars", () => mockedEnvVarsModule);

describe("update project reducer", () => {
  beforeEach(() => {
    mockedEnvVarsModule.BENEFRICHES_ENV.urbanProjectBuildingsReuseChapterEnabled = true;
  });

  it("redirects to buildings footprint to reuse when project building footprint changes", () => {
    const initialState = updateProjectReducer(undefined, { type: "@@INIT" });
    const steps: ProjectFormState["urbanProject"]["steps"] = {
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
    state.urbanProject.currentStep = "URBAN_PROJECT_SPACES_SURFACE_AREA";
    state.urbanProject.steps = steps;
    state.urbanProject.stepsSequence = computeProjectStepsSequence(
      {
        siteData: state.siteData,
        stepsState: steps,
      },
      state.urbanProject.firstSequenceStep,
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

    expect(confirmedState.urbanProject.steps.URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE).toEqual({
      completed: false,
      defaultValues: undefined,
      payload: undefined,
    });
    expect(confirmedState.urbanProject.currentStep).toBe(
      "URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE",
    );
  });
});
