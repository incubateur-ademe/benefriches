import { describe, expect, it } from "vitest";

import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { previousStepRequested } = creationProjectFormUrbanActions;

describe("Urban project creation - Steps - Financial assistance revenue", () => {
  it("goes back to the revenue introduction when the buildings are kept and the site is not resold", () => {
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
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: {
            developerWillBeBuildingsConstructor: true,
            buildingsResalePlannedAfterDevelopment: false,
          },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE")
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_INTRODUCTION");
  });
  it("goes back to the buildings sale when the developer builds and resells the buildings", () => {
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
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: {
            developerWillBeBuildingsConstructor: true,
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE")
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_BUILDINGS_RESALE");
  });

  it("goes back to the site resale revenue when the developer does not build and the site is resold", () => {
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
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: false },
        },
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      })
      .withCurrentStep("URBAN_PROJECT_REVENUE_FINANCIAL_ASSISTANCE")
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE");
  });
});
