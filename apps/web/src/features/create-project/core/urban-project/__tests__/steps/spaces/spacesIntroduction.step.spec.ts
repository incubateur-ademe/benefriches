import { describe, it, expect } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

describe("Urban project creation - Steps - Spaces introduction", () => {
  it("should go to URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION when PUBLIC_GREEN_SPACES selected and site has constrained soils", () => {
    // mockSiteData has PRAIRIE_GRASS: 2000 (constrained soil)
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToNext());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_INTRODUCTION");
  });

  it("should go to URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION when PUBLIC_GREEN_SPACES selected and site has no constrained soils", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
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
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToNext());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION");
  });

  it("should go to URBAN_PROJECT_SPACES_SELECTION when PUBLIC_GREEN_SPACES not selected", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 8000 } },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToNext());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SPACES_SELECTION");
  });

  it("should go back to URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA when building uses exist with PUBLIC_GREEN_SPACES", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
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

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");
  });

  it("should go back to URBAN_PROJECT_USES_SELECTION when building uses exist without PUBLIC_GREEN_SPACES", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
  });

  it("should go back to URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA when PUBLIC_GREEN_SPACES is selected without building uses", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_PUBLIC_GREEN_SPACES_SURFACE_AREA");
  });

  it("should go back to URBAN_PROJECT_USES_SELECTION when no PUBLIC_GREEN_SPACES and no building uses", () => {
    const store = createTestStore({
      currentStep: "URBAN_PROJECT_SPACES_INTRODUCTION",
      steps: {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["OTHER_PUBLIC_SPACES"] },
        },
      },
    });

    store.dispatch(creationProjectFormUrbanActions.navigateToPrevious());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_USES_SELECTION");
  });
});
