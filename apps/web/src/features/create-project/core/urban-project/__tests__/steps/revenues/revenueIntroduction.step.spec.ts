import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { nextStepRequested, previousStepRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Revenue introduction", () => {
  it("goes to financial assistance when the buildings are kept and the site is not resold", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 } },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: false },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_INTRODUCTION")
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE");
  });

  it("goes back to installation expenses when the buildings are kept and the developer does not build", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 } },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: false },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: false },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 0 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_INTRODUCTION")
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INSTALLATION");
  });

  it("goes back to construction and rehabilitation expenses when the buildings are kept and the developer builds", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 2000, IMPERMEABLE_SOILS: 8000 } },
        },
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: { buildingsResalePlannedAfterDevelopment: false },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 0 },
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_INTRODUCTION")
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe(
      "URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION",
    );
  });
});
