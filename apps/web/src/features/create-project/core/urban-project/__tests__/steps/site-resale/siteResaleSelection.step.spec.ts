import { describe, expect, it } from "vitest";

import { DEFAULT_FUTURE_SITE_OWNER } from "@/features/create-project/core/project-form/stakeholders";
import { DisabledRealEstateValuationService } from "@/shared/infrastructure/real-estate-valuation-service/DisabledRealEstateValuationService";

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
};

const getData = (store: ReturnType<StoreBuilder["build"]>) =>
  getProjectData(store.getState().projectCreation.urbanProject.form.steps);

describe("Urban project creation - Steps - site resale selection", () => {
  it("plans site resale and routes to buildings resale when 'yes' is selected", () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "yes" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
    expect(getData(store).futureSiteOwner).toEqual(DEFAULT_FUTURE_SITE_OWNER);
  });

  it("does not plan site resale and routes to buildings resale when 'no' is selected", () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "no" },
      }),
    );

    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
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
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
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
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_STAKEHOLDERS_INTRODUCTION");
  });

  it("marks the resale estimation as failed when the valuation service errors on 'unknown'", async () => {
    const store = new StoreBuilder()
      .withSteps(INITIAL_STEPS)
      .withAppDependencies({ realEstateValuationService: new DisabledRealEstateValuationService() })
      .build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "unknown" },
      }),
    );

    // Wait for async thunk dispatched by listener to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(store.getState().projectCreation.urbanProject.siteResaleEstimationLoadingState).toBe(
      "error",
    );
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });

  it("resolves the resale estimation and routes to buildings resale when 'unknown' is selected", async () => {
    const store = new StoreBuilder().withSteps(INITIAL_STEPS).build();

    store.dispatch(
      stepCompletionRequested({
        stepId: "URBAN_PROJECT_SITE_RESALE_SELECTION",
        answers: { siteResaleSelection: "unknown" },
      }),
    );

    // Wait for async thunk dispatched by listener to complete
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(store.getState().projectCreation.urbanProject.siteResaleEstimationLoadingState).toBe(
      "success",
    );
    expect(getData(store).futureSiteOwner).toEqual(DEFAULT_FUTURE_SITE_OWNER);
    expect(getCurrentStep(store)).toBe("URBAN_PROJECT_BUILDINGS_RESALE_SELECTION");
  });
});
