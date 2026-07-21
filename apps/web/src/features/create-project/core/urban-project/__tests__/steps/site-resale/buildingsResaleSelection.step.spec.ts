import { describe, expect, it } from "vitest";

import { getProjectData } from "../../../helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import type { UrbanProjectStepsState } from "../../../urbanProject.state";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested, stepCompletionConfirmed } = creationProjectFormUrbanActions;

const INITIAL_STEPS: UrbanProjectStepsState = {
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    completed: true,
    payload: { projectDeveloper: { structureType: "municipality", name: "Mairie d'angers" } },
  },
  URBAN_PROJECT_USES_SELECTION: {
    completed: true,
    payload: { usesSelection: ["RESIDENTIAL"] },
  },
  URBAN_PROJECT_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
    completed: true,
    payload: { usesFloorSurfaceAreaDistribution: { RESIDENTIAL: 15000 } },
  },
};

const getData = (store: ReturnType<StoreBuilder["build"]>) =>
  getProjectData(store.getState().projectCreation.urbanProject.form.steps);

describe("Urban project creation - Steps - buildings resale selection", () => {
  it("assigns the default future operator and routes to stakeholders when resale is planned", () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: { buildingsResalePlannedAfterDevelopment: true },
      }),
    );

    expect(getData(store).futureOperator).toEqual({
      name: "Futur exploitant inconnu",
      structureType: "unknown",
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });

  it("keeps the developer as future operator and routes to stakeholders when resale is not planned", () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: { buildingsResalePlannedAfterDevelopment: false },
      }),
    );

    expect(getData(store).futureOperator).toEqual({
      structureType: "municipality",
      name: "Mairie d'angers",
    });
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });

  it("discards buildings operations data when switching to resale planned", () => {
    const store = new StoreBuilder()
      .withSteps({
        ...INITIAL_STEPS,
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: false },
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
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: { buildingsResalePlannedAfterDevelopment: true },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    expect(getData(store).yearlyProjectedCosts).toEqual([]);
    expect(getData(store).yearlyProjectedRevenues).toEqual([]);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });

  it("discards buildings resale revenue when switching to resale not planned", () => {
    const store = new StoreBuilder()
      .withSteps({
        ...INITIAL_STEPS,
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: true },
        },
        URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
          completed: true,
          payload: {
            buildingsResaleSellingPrice: 5000,
            buildingsResalePropertyTransferDuties: 500,
          },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_BUILDINGS_RESALE_SELECTION",
        answers: { buildingsResalePlannedAfterDevelopment: false },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    expect(getData(store).buildingsResaleExpectedSellingPrice).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });
});
