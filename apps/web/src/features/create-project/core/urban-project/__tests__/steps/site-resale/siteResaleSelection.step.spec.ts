import { describe, expect, it } from "vitest";

import { DEFAULT_FUTURE_SITE_OWNER } from "@/features/create-project/core/project-form/stakeholders";

import { getProjectData } from "../../../helpers/readers/projectDataReaders";
import { creationProjectFormUrbanActions } from "../../../urbanProject.actions";
import type { UrbanProjectStepsState } from "../../../urbanProject.state";
import { getCurrentStep, StoreBuilder } from "../../_testStoreHelpers";

const { stepCompletionRequested, stepCompletionConfirmed } = creationProjectFormUrbanActions;

const INITIAL_STEPS: UrbanProjectStepsState = {
  URBAN_PROJECT_USES_SELECTION: {
    completed: true,
    payload: { usesSelection: ["RESIDENTIAL"] },
  },
  URBAN_PROJECT_SPACES_SURFACE_AREA: {
    completed: true,
    payload: {
      spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
    },
  },
};

const getData = (store: ReturnType<StoreBuilder["build"]>) =>
  getProjectData(store.getState().projectCreation.urbanProject.form.steps);

describe("Urban project creation - Steps - site resale selection", () => {
  it("plans site resale and routes to the expenses introduction when 'yes' is selected", () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "yes" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
    expect(getData(store).futureSiteOwner).toEqual(DEFAULT_FUTURE_SITE_OWNER);
  });

  it("does not plan site resale and routes to the expenses introduction when 'no' is selected", () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "no" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
    expect(getData(store).futureSiteOwner).toBeUndefined();
  });

  it("clears a previously entered site resale revenue when re-selecting 'yes'", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: false,
          payload: undefined,
        },
        URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
          completed: true,
          payload: { siteResaleExpectedSellingPrice: 140000 },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "yes" },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    expect(getData(store).siteResaleExpectedSellingPrice).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });

  it("removes a previously entered site resale revenue when switching to 'no'", () => {
    const store = new StoreBuilder()
      .withSteps({
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
        URBAN_PROJECT_REVENUE_EXPECTED_SITE_RESALE: {
          completed: true,
          payload: { siteResaleExpectedSellingPrice: 1000 },
        },
      })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "no" },
      }),
    );
    store.dispatch(stepCompletionConfirmed());

    expect(getData(store).siteResaleExpectedSellingPrice).toBeUndefined();
    expect(getData(store).futureSiteOwner).toBeUndefined();
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_EXPENSES_INTRODUCTION");
  });
});
