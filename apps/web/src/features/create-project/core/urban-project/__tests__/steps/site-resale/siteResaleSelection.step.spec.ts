import { describe, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore, getCurrentStep } from "../../_testStoreHelpers";

const INITIAL_STEPS: ProjectFormState["urbanProject"]["steps"] = {
  URBAN_PROJECT_CREATE_MODE_SELECTION: {
    completed: true,
    payload: { createMode: "custom" },
  },
  URBAN_PROJECT_SPACES_CATEGORIES_SELECTION: {
    completed: true,
    payload: { spacesCategories: ["LIVING_AND_ACTIVITY_SPACES"] },
  },
  URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
    completed: true,
    payload: { livingAndActivitySpacesDistribution: { BUILDINGS: 15000 } },
  },
  URBAN_PROJECT_BUILDINGS_FLOOR_SURFACE_AREA: {
    completed: true,
    payload: { buildingsFloorSurfaceArea: 15000 },
  },
};

describe("Urban project creation - Steps - site resale selection", () => {
  it("should complete step with 'yes' and add step resale revenue to stepSequence", () => {
    const store = createTestStore({ steps: INITIAL_STEPS });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "yes" },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...INITIAL_STEPS,
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: { siteResaleSelection: "yes" },
      },
    });

    const state = store.getState().projectCreation.urbanProject;
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(true);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });

  it("should complete step with 'no'", () => {
    const store = createTestStore({ steps: INITIAL_STEPS });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "no" },
      }),
    );

    const state = store.getState().projectCreation.urbanProject;
    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...INITIAL_STEPS,
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: { siteResaleSelection: "no" },
      },
    });

    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(false);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });

  it("should complete step with 'yes' and invalidate existing revenue step", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_CREATE_MODE_SELECTION: {
          completed: true,
          payload: { createMode: "custom" },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: false,
          payload: undefined,
        },
        URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
          completed: true,
          payload: { siteResaleExpectedSellingPrice: 140000 },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "yes" },
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    const state = store.getState().projectCreation.urbanProject;

    expect(state.steps).toEqual<ProjectFormState["urbanProject"]["steps"]>({
      URBAN_PROJECT_CREATE_MODE_SELECTION: {
        completed: true,
        payload: { createMode: "custom" },
      },
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: { siteResaleSelection: "yes" },
      },
      URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
        completed: false,
        payload: undefined,
        defaultValues: undefined,
      },
    });
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(true);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });

  it("should complete step with 'no' and delete existing revenue step", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_CREATE_MODE_SELECTION: {
          completed: true,
          payload: { createMode: "custom" },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
        URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
          completed: true,
          payload: { siteResaleExpectedSellingPrice: 1000 },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "no" },
      }),
    );
    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    const state = store.getState().projectCreation.urbanProject;

    expect(state.steps).toEqual<ProjectFormState["urbanProject"]["steps"]>({
      URBAN_PROJECT_CREATE_MODE_SELECTION: {
        completed: true,
        payload: { createMode: "custom" },
      },
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: { siteResaleSelection: "no" },
      },
      URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: undefined,
    });
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(false);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });

  it("should complete step with 'unknown' and pre-populate revenue step with estimated values", async () => {
    const store = createTestStore({
      steps: INITIAL_STEPS,
      siteData: {
        id: "test-site",
        name: "Test Site",
        surfaceArea: 10000,
        nature: "FRICHE",
        isExpressSite: false,
        owner: { name: "Test Owner", structureType: "company" },
        soilsDistribution: {},
        address: {
          city: "Test City",
          cityCode: "12345",
          value: "Test Address",
          postCode: "12345",
          long: 0,
          lat: 0,
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "unknown" },
      }),
    );

    // Wait for async thunk dispatched by listener to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...INITIAL_STEPS,
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: { siteResaleSelection: "unknown" },
      },
      // Revenue step is pre-populated with default values (not completed)
      // User will see estimated values when they reach this step
      URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
        completed: false,
        defaultValues: {
          siteResaleExpectedSellingPrice: 1500000, // 10000m² * 150€/m²
          siteResaleExpectedPropertyTransferDuties: 120000, // 8% of 1500000
        },
      },
    });

    const state = store.getState().projectCreation.urbanProject;
    // When unknown is selected, URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE is in sequence
    // (user can modify the estimated values on that step)
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(true);
    // After selection, we should be at buildings resale selection (next step)
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });
});
