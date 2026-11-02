import { describe, expect, it } from "vitest";

import { getProjectData } from "../../../helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { creationProjectFormSelectors } from "../../../urbanProject.selectors";
import type { UrbanProjectStepsState } from "../../../urbanProject.state";
import type { UrbanProjectCreationStep } from "../../../urbanProjectSteps";
import { mockSiteData } from "../../_siteData.mock";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested, stepCompletionConfirmed, previousStepRequested } =
  creationProjectFormUrbanActions;

const UNKNOWN_FUTURE_OPERATOR = { name: "Futur exploitant inconnu", structureType: "unknown" };

const BASE_STEPS: UrbanProjectStepsState = {
  URBAN_PROJECT_USES_SELECTION: {
    completed: true,
    payload: { usesSelection: ["RESIDENTIAL"] },
  },
  URBAN_PROJECT_SPACES_SURFACE_AREA: {
    completed: true,
    payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 } },
  },
  URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
    completed: true,
    payload: { projectDeveloper: { name: "Promoteur Test", structureType: "company" } },
  },
};

const BUILDINGS_RESALE_REVENUE: UrbanProjectStepsState = {
  URBAN_PROJECT_REVENUE_BUILDINGS_RESALE: {
    completed: true,
    payload: {
      buildingsResaleSellingPrice: 500000,
      buildingsResalePropertyTransferDuties: 30000,
    },
  },
};

const REHABILITATION_ONLY_STEPS: UrbanProjectStepsState = {
  ...BASE_STEPS,
  URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
    completed: true,
    payload: { buildingsFootprintToReuse: 2000 },
  },
};

const NON_FRICHE_SITE = { nature: "AGRICULTURAL_OPERATION" as const };
const SITE_WITH_BUILDINGS = {
  nature: "AGRICULTURAL_OPERATION" as const,
  soilsDistribution: { ...mockSiteData.soilsDistribution, BUILDINGS: 2000 },
};

type Store = ReturnType<StoreBuilder["build"]>;

const getData = (store: Store) =>
  getProjectData(store.getState().projectCreation.urbanProject.form.steps);

const isStepCompleted = (store: Store, stepId: UrbanProjectCreationStep) =>
  Object.values(creationProjectFormSelectors.selectStepsGroupedBySections(store.getState()))
    .flat()
    .find((step) => step.stepId === stepId)?.isStepCompleted;

const buildStoreAtBuildingsDeveloper = (steps: UrbanProjectStepsState = BASE_STEPS) =>
  new StoreBuilder()
    .withSiteData(NON_FRICHE_SITE)
    .withSteps(steps)
    .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")
    .build();

describe("Urban project creation - Steps - Stakeholders buildings developer", () => {
  it("sets an unknown future operator when the developer builds and resells the buildings", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: true,
        },
      }),
    );

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    const { developerWillBeBuildingsConstructor, futureOperator } = getData(store);
    expect({ developerWillBeBuildingsConstructor, futureOperator }).toEqual({
      developerWillBeBuildingsConstructor: true,
      futureOperator: UNKNOWN_FUTURE_OPERATOR,
    });
  });

  it("sets the developer as future operator when the developer builds and keeps the buildings", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: false,
        },
      }),
    );

    // Assert
    expect(getData(store).futureOperator).toEqual({
      name: "Promoteur Test",
      structureType: "company",
    });
  });

  it("stores no buildings resale answer and sets an unknown future operator when the developer does not build", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: {
          developerWillBeBuildingsConstructor: false,
          buildingsResalePlannedAfterDevelopment: true,
        },
      }),
    );

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
    expect(getData(store).futureOperator).toEqual(UNKNOWN_FUTURE_OPERATOR);
    expect(
      creationProjectFormSelectors.selectStepAnswers(
        "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
      )(store.getState()),
    ).toEqual({ developerWillBeBuildingsConstructor: false });
  });

  it("is incomplete when the developer builds but the buildings resale is not answered", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: { developerWillBeBuildingsConstructor: true },
      }),
    );

    // Assert
    expect(isStepCompleted(store, "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER")).toBe(false);
  });

  it("discards the buildings resale revenue when switching to a developer who does not build", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper({
      ...BASE_STEPS,
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: true,
        },
      },
      ...BUILDINGS_RESALE_REVENUE,
    });

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: { developerWillBeBuildingsConstructor: false },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    // Assert
    const { buildingsResaleExpectedSellingPrice, buildingsResaleExpectedPropertyTransferDuties } =
      getData(store);
    expect({
      buildingsResaleExpectedSellingPrice,
      buildingsResaleExpectedPropertyTransferDuties,
    }).toEqual({
      buildingsResaleExpectedSellingPrice: undefined,
      buildingsResaleExpectedPropertyTransferDuties: undefined,
    });
  });

  it("discards the buildings resale revenue when switching to buildings kept by the developer", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper({
      ...BASE_STEPS,
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: true,
        },
      },
      ...BUILDINGS_RESALE_REVENUE,
    });

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: false,
        },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    // Assert
    const { buildingsResaleExpectedSellingPrice, buildingsResaleExpectedPropertyTransferDuties } =
      getData(store);
    expect({
      buildingsResaleExpectedSellingPrice,
      buildingsResaleExpectedPropertyTransferDuties,
    }).toEqual({
      buildingsResaleExpectedSellingPrice: undefined,
      buildingsResaleExpectedPropertyTransferDuties: undefined,
    });
  });

  it("invalidates the buildings resale revenue when switching to resold buildings", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper({
      ...BASE_STEPS,
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: false,
        },
      },
      ...BUILDINGS_RESALE_REVENUE,
    });

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: true,
        },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    // Assert
    expect(isStepCompleted(store, "URBAN_PROJECT_REVENUE_BUILDINGS_RESALE")).toBe(false);
  });

  it("invalidates the buildings construction expenses when the developer builds", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper({
      ...BASE_STEPS,
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: { developerWillBeBuildingsConstructor: false },
      },
      URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
        completed: true,
        payload: { buildingsConstructionWorks: 90000 },
      },
    });

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: true,
        },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    // Assert
    expect(
      isStepCompleted(store, "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION"),
    ).toBe(false);
  });

  it("discards the buildings construction expenses when switching to a developer who does not build", () => {
    // Arrange
    const store = buildStoreAtBuildingsDeveloper({
      ...BASE_STEPS,
      URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
        completed: true,
        payload: {
          developerWillBeBuildingsConstructor: true,
          buildingsResalePlannedAfterDevelopment: false,
        },
      },
      URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
        completed: true,
        payload: { buildingsConstructionWorks: 90000 },
      },
    });

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
        answers: { developerWillBeBuildingsConstructor: false },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    // Assert
    expect(getData(store).buildingsConstructionAndRehabilitationExpenses).toBeUndefined();
  });

  it("is shown after the project developer on a rehabilitation-only project", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData(SITE_WITH_BUILDINGS)
      .withSteps(REHABILITATION_ONLY_STEPS)
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
      .build();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Promoteur Test", structureType: "company" } },
      }),
    );

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
  });

  it("is skipped after the project developer when the project has no buildings", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData(NON_FRICHE_SITE)
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 10000 } },
        },
      })
      .withCurrentStep("URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER")
      .build();

    // Act
    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Promoteur Test", structureType: "company" } },
      }),
    );

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_SITE_RESALE_INTRODUCTION");
  });

  it("is reached back from the site resale introduction on a rehabilitation-only project", () => {
    // Arrange
    const store = new StoreBuilder()
      .withSiteData(SITE_WITH_BUILDINGS)
      .withSteps(REHABILITATION_ONLY_STEPS)
      .withCurrentStep("URBAN_PROJECT_SITE_RESALE_INTRODUCTION")
      .build();

    // Act
    store.dispatch(previousStepRequested());

    // Assert
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER");
  });
});
