import { describe, it } from "vitest";

import { ProjectFormState } from "@/shared/core/reducers/project-form/projectForm.reducer";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { createTestStore } from "../../_testStoreHelpers";

const getCurrentStep = (store: ReturnType<typeof createTestStore>) =>
  store.getState().projectCreation.urbanProject.currentStep;

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
  it("should complete step with true and automaticaly completed future site owner and add step resale revenue to stepSequence", () => {
    const store = createTestStore({
      steps: INITIAL_STEPS,
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: {
          siteResalePlannedAfterDevelopment: true,
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...INITIAL_STEPS,
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: {
          siteResalePlannedAfterDevelopment: true,
          futureSiteOwner: {
            name: "Futur propriétaire inconnu",
            structureType: "unknown",
          },
        },
      },
    });

    const state = store.getState().projectCreation.urbanProject;

    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(true);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });

  it("should complete step with false and URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE should not be in step sequences", () => {
    const store = createTestStore({ steps: INITIAL_STEPS });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: {
          siteResalePlannedAfterDevelopment: false,
        },
      }),
    );

    const state = store.getState().projectCreation.urbanProject;
    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...INITIAL_STEPS,
      URBAN_PROJECT_SITE_RESALE_SELECTION: {
        completed: true,
        payload: {
          siteResalePlannedAfterDevelopment: false,
          futureSiteOwner: undefined,
        },
      },
    });

    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(false);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });

  it("should complete step with true and remove steps related to resale revenue if exists", () => {
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
          payload: {
            siteResaleExpectedSellingPrice: 0,
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: {
          siteResalePlannedAfterDevelopment: true,
        },
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
        payload: {
          siteResalePlannedAfterDevelopment: true,
          futureSiteOwner: {
            name: "Futur propriétaire inconnu",
            structureType: "unknown",
          },
        },
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

  it("should complete step with false and remove steps related to resale site revenue if exist", () => {
    const store = createTestStore({
      steps: {
        URBAN_PROJECT_CREATE_MODE_SELECTION: {
          completed: true,
          payload: { createMode: "custom" },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: {
            siteResalePlannedAfterDevelopment: true,
            futureSiteOwner: {
              name: "Futur propriétaire inconnu",
              structureType: "unknown",
            },
          },
        },
        URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
          completed: true,
          payload: {
            siteResaleExpectedSellingPrice: 1000,
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: {
          siteResalePlannedAfterDevelopment: false,
        },
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
        payload: {
          siteResalePlannedAfterDevelopment: false,
        },
      },
      URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: undefined,
    });
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE")).toBe(false);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });
});
