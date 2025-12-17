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

describe("Urban project creation - Steps - buildings resale selection", () => {
  it("should complete step with true and automaticaly completed future site operator and add related step revenue to stepSequence", () => {
    const store = createTestStore({ steps: INITIAL_STEPS });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: {
          buildingsResalePlannedAfterDevelopment: true,
        },
      }),
    );

    expect(store.getState().projectCreation.urbanProject.steps).toEqual<
      ProjectFormState["urbanProject"]["steps"]
    >({
      ...INITIAL_STEPS,
      URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
        completed: true,
        payload: {
          buildingsResalePlannedAfterDevelopment: true,
          futureOperator: {
            name: "Futur exploitant inconnu",
            structureType: "unknown",
          },
        },
      },
    });

    expect(
      store
        .getState()
        .projectCreation.urbanProject.stepsSequence.includes(
          "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE",
        ),
    ).toBe(true);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });

  it("should complete step with false, add steps related to buildings operations revenues and expenses to step sequences", () => {
    const store = createTestStore({
      steps: INITIAL_STEPS,
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: {
          buildingsResalePlannedAfterDevelopment: false,
        },
      }),
    );

    const state = store.getState().projectCreation.urbanProject;

    expect(state.steps).toEqual<ProjectFormState["urbanProject"]["steps"]>({
      ...INITIAL_STEPS,
      URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
        completed: true,
        payload: {
          buildingsResalePlannedAfterDevelopment: false,
        },
      },
    });
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE")).toBe(false);
    expect(
      state.stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"),
    ).toBe(true);
    expect(
      state.stepsSequence.includes("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"),
    ).toBe(true);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });

  it("should complete step with true and remove steps related to building operation if exist", () => {
    const store = createTestStore({
      steps: {
        ...INITIAL_STEPS,
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: false,
          },
        },
        URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
          completed: true,
          payload: {
            buildingsResaleSellingPrice: 0,
            buildingsResalePropertyTransferDuties: 0,
          },
        },
        URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
          completed: true,
          payload: {
            yearlyProjectedBuildingsOperationsExpenses: [{ purpose: "maintenance", amount: 5000 }],
          },
        },
        URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
          completed: true,
          payload: {
            yearlyProjectedRevenues: [{ source: "rent", amount: 5000 }],
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: {
          buildingsResalePlannedAfterDevelopment: true,
        },
      }),
    );

    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    const state = store.getState().projectCreation.urbanProject;

    expect(state.steps).toEqual<ProjectFormState["urbanProject"]["steps"]>({
      ...INITIAL_STEPS,
      URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
        completed: true,
        payload: {
          buildingsResalePlannedAfterDevelopment: true,
          futureOperator: {
            name: "Futur exploitant inconnu",
            structureType: "unknown",
          },
        },
      },
      URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
        completed: false,
        payload: undefined,
        defaultValues: undefined,
      },
      URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: undefined,
      URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: undefined,
    });
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE")).toBe(true);
    expect(
      state.stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"),
    ).toBe(false);
    expect(
      state.stepsSequence.includes("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"),
    ).toBe(false);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });

  it("should complete step with false and remove steps related to resale buildings revenue if exist", () => {
    const store = createTestStore({
      steps: {
        ...INITIAL_STEPS,
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
        URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
          completed: true,
          payload: {
            buildingsResaleSellingPrice: 5000,
            buildingsResalePropertyTransferDuties: 500,
          },
        },
        URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
          completed: true,
          payload: {
            yearlyProjectedBuildingsOperationsExpenses: [],
          },
        },
        URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
          completed: true,
          payload: {
            yearlyProjectedRevenues: [],
          },
        },
      },
    });

    store.dispatch(
      creationProjectFormUrbanActions.requestStepCompletion({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: {
          buildingsResalePlannedAfterDevelopment: false,
        },
      }),
    );

    store.dispatch(creationProjectFormUrbanActions.confirmStepCompletion());

    const state = store.getState().projectCreation.urbanProject;

    expect(state.steps).toEqual<ProjectFormState["urbanProject"]["steps"]>({
      ...INITIAL_STEPS,
      URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
        completed: true,
        payload: {
          buildingsResalePlannedAfterDevelopment: false,
          futureOperator: undefined,
        },
      },
      URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: undefined,
      URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES: {
        completed: false,
        payload: undefined,
        defaultValues: undefined,
      },
      URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES: {
        completed: false,
        payload: undefined,
        defaultValues: undefined,
      },
    });
    expect(state.stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE")).toBe(false);
    expect(
      state.stepsSequence.includes("URBAN_PROJECT_REVENUE_BUILDINGS_OPERATIONS_YEARLY_REVENUES"),
    ).toBe(true);
    expect(
      state.stepsSequence.includes("URBAN_PROJECT_EXPENSES_PROJECTED_BUILDINGS_OPERATING_EXPENSES"),
    ).toBe(true);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });
});
