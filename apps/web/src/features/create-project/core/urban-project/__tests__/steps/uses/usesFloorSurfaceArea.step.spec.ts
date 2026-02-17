import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Uses floor surface area", () => {
  it("should complete step and go to URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION when site has contaminated soils", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "OFFICES"] },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
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
      URBAN_PROJECT_USES_FLOOR_SURFACE_AREA: {
        completed: true,
        payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 10000, OFFICES: 7500 } },
      },
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SOILS_DECONTAMINATION_INTRODUCTION");
  });

  it("should complete step and go to URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION when site has no contaminated soils", () => {
    const store = createTestStore({
      siteData: {
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
      },
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
        answers: {
          usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 },
        },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });

  it("should navigate to URBAN_PROJECT_BUILDINGS_INTRODUCTION when going back", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_USES_FLOOR_SURFACE_AREA",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_INTRODUCTION");
  });
});
