import { describe, expect, it } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";
import { getProjectData } from "@/features/create-project/core/urban-project/helpers/readers/projectDataReaders";
import { stepHandlerRegistry } from "@/features/create-project/core/urban-project/step-handlers/stepHandlerRegistry";
import type { UrbanProjectStepsState } from "@/features/create-project/core/urban-project/urbanProject.state";
import { computeStepsSequence } from "@/shared/core/wizard-form/helpers/stepsSequence";

import {
  reconversionProjectUpdateInitiated,
  updateProjectFormUrbanActions,
} from "./updateProject.actions";
import updateProjectReducer from "./updateProject.reducer";
import type { UpdateProjectView } from "./updateProject.types";

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

  it("recomputes a saved generated reinstatement expense and keeps an edited one when the decontaminated surface changes", () => {
    const projectData: UpdateProjectView["projectData"] = {
      id: "project-1",
      createdBy: "user-1",
      createdAt: "2026-01-01",
      creationMode: "custom",
      name: "Projet de test",
      relatedSiteId: "site-1",
      involvesReinstatement: true,
      projectPhase: "planning",
      developmentPlan: {
        type: "URBAN_PROJECT",
        developer: { name: "Dev Corp", structureType: "company" },
        costs: [],
        features: { buildingsFloorAreaDistribution: {} },
      },
      soilsDistribution: [],
      yearlyProjectedCosts: [],
      yearlyProjectedRevenues: [],
      decontaminatedSoilSurface: 1000,
      reinstatementCosts: [
        // edited by the user: the project keeps no soils to compute it from
        { purpose: "demolition", amount: 12345 },
        // generated: 1000 m2 x 66 €/m2
        { purpose: "remediation", amount: 66000 },
      ],
    };
    const siteData: UpdateProjectView["siteData"] = {
      id: "site-1",
      name: "Friche test",
      nature: "FRICHE",
      isExpressSite: false,
      owner: { structureType: "company", name: "Owner" },
      hasContaminatedSoils: true,
      contaminatedSoilSurface: 2000,
      soilsDistribution: {},
      surfaceArea: 5000,
      address: {
        banId: "addr-1",
        city: "Paris",
        cityCode: "75056",
        postCode: "75001",
        streetName: "Rue",
        streetNumber: "1",
        value: "1 Rue, 75001 Paris",
        long: 2.35,
        lat: 48.85,
      },
    };
    const hydratedState = updateProjectReducer(
      updateProjectReducer(undefined, { type: "@@INIT" }),
      reconversionProjectUpdateInitiated.fulfilled(
        { projectData, siteData },
        "request-1",
        "project-1",
      ),
    );

    const pendingState = updateProjectReducer(
      hydratedState,
      updateProjectFormUrbanActions.stepCompletionRequested({
        stepId: "URBAN_PROJECT_SOILS_DECONTAMINATION",
        answers: { decontaminationPlan: "unknown" },
      }),
    );
    const confirmedState = updateProjectReducer(
      pendingState,
      updateProjectFormUrbanActions.stepCompletionConfirmed(),
    );

    expect(getProjectData(confirmedState.urbanProject.form.steps).reinstatementCosts).toEqual([
      { purpose: "demolition", amount: 12345 },
      // 500 m2 (25% of 2000 m2) x 66 €/m2
      { purpose: "remediation", amount: 33000 },
    ]);
  });
});
