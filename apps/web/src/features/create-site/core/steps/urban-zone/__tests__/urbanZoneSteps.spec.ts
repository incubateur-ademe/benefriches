import { describe, expect, it } from "vitest";

import { StoreBuilder, expectCurrentStep } from "../../../__tests__/creation-steps/testUtils";
import { customFormActions } from "../../../custom/custom.actions";

const ADDRESS = {
  value: "1 rue de la Paix, 75001 Paris",
  city: "Paris",
  cityCode: "75001",
  postCode: "75001",
  banId: "75056_9575_00001",
  lat: 48.8698,
  long: 2.3322,
};

describe("Site creation: urban zone hand-off steps", () => {
  it("URBAN_ZONE_TYPE: stores the type, sets createMode to custom, goes to ADDRESS", () => {
    const store = new StoreBuilder().withCustomStep("URBAN_ZONE_TYPE").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "URBAN_ZONE_TYPE",
        answers: { urbanZoneType: "ECONOMIC_ACTIVITY_ZONE" },
      }),
    );

    const newState = store.getState().siteCreation;
    expect(newState.custom.steps.URBAN_ZONE_TYPE?.payload).toEqual({
      urbanZoneType: "ECONOMIC_ACTIVITY_ZONE",
    });
    expectCurrentStep(store, "ADDRESS");
  });

  it("ADDRESS: goes to URBAN_ZONE_LAND_PARCELS_INTRODUCTION when the nature is URBAN_ZONE", () => {
    const store = new StoreBuilder().withNature("URBAN_ZONE").withCustomStep("ADDRESS").build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "ADDRESS",
        answers: { address: ADDRESS },
      }),
    );

    expectCurrentStep(store, "URBAN_ZONE_LAND_PARCELS_INTRODUCTION");
  });

  it("URBAN_ZONE_LAND_PARCELS_INTRODUCTION: goes to SURFACE_AREA", () => {
    const store = new StoreBuilder().withCustomStep("URBAN_ZONE_LAND_PARCELS_INTRODUCTION").build();

    store.dispatch(customFormActions.nextStepRequested());

    expectCurrentStep(store, "SURFACE_AREA");
  });

  it("SURFACE_AREA: hands off to the urban-zone sub-flow's first step for URBAN_ZONE nature", () => {
    const store = new StoreBuilder()
      .withNature("URBAN_ZONE")
      .withCustomStep("SURFACE_AREA")
      .build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "SURFACE_AREA",
        answers: { surfaceArea: 15000 },
      }),
    );

    const newState = store.getState().siteCreation;
    expect(newState.customHandedOffToUrbanZone).toBe(true);
    expect(newState.urbanZone.currentStep).toBe("URBAN_ZONE_LAND_PARCELS_SELECTION");
    expectCurrentStep(store, "URBAN_ZONE_LAND_PARCELS_SELECTION");
  });

  it("SURFACE_AREA: still goes to SPACES_KNOWLEDGE for non-urban-zone custom sites", () => {
    const store = new StoreBuilder()
      .withNature("AGRICULTURAL_OPERATION")
      .withCustomStep("SURFACE_AREA")
      .build();

    store.dispatch(
      customFormActions.stepCompletionRequested({
        stepId: "SURFACE_AREA",
        answers: { surfaceArea: 15000 },
      }),
    );

    expect(store.getState().siteCreation.customHandedOffToUrbanZone).toBe(false);
    expectCurrentStep(store, "SPACES_KNOWLEDGE");
  });
});
