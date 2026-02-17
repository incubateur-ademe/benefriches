import { describe, it, expect } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - public green spaces soils distribution", () => {
  it("should complete step and navigate to URBAN_PROJECT_SPACES_SOILS_SUMMARY", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { publicGreenSpacesSurfaceArea: 5000 },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
        answers: {
          publicGreenSpacesSoilsDistribution: {
            PRAIRIE_GRASS: 2000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 3000,
          },
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      URBAN_PROJECT_USES_SELECTION: {
        completed: true,
        payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
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
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SOILS_SUMMARY");
  });

  it("should navigate back to PUBLIC_GREEN_SPACES_INTRODUCTION when site has constrained soils", () => {
    // mockSiteData has PRAIRIE_GRASS: 2000 (constrained soil)
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { publicGreenSpacesSurfaceArea: 5000 },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION");
  });

  it("should navigate back to SPACES_INTRODUCTION when site has no constrained soils", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION",
      siteData: {
        id: "site-id",
        name: "Site without natural soils",
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
          BUILDINGS: 4000,
          IMPERMEABLE_SOILS: 3000,
          MINERAL_SOIL: 3000,
        },
      },
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { publicGreenSpacesSurfaceArea: 5000 },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_INTRODUCTION");
  });
});
