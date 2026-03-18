import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - MANAGEMENT_INTRODUCTION step", () => {
  it("should navigate to manager step", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_MANAGEMENT_INTRODUCTION").build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGER");
  });

  it("should navigate back to soils contamination", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["URBAN_ZONE_SOILS_CONTAMINATION", "URBAN_ZONE_MANAGEMENT_INTRODUCTION"])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_CONTAMINATION");
  });
});

describe("Urban zone - MANAGER step", () => {
  describe("completion", () => {
    it("should store manager data and navigate to next step when activity park manager is selected", () => {
      const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_MANAGER").build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_MANAGER",
          answers: { structureType: "activity_park_manager" },
        }),
      );

      expect(store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_MANAGER"]).toEqual({
        completed: true,
        payload: { structureType: "activity_park_manager" },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");
    });

    it("should store manager data and navigate to next step when local authority is selected", () => {
      const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_MANAGER").build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_MANAGER",
          answers: { structureType: "local_authority", localAuthority: "municipality" },
        }),
      );

      expect(store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_MANAGER"]).toEqual({
        completed: true,
        payload: { structureType: "local_authority", localAuthority: "municipality" },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to management introduction", () => {
      const store = new StoreBuilder()
        .withStepsSequence(["URBAN_ZONE_MANAGEMENT_INTRODUCTION", "URBAN_ZONE_MANAGER"])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGEMENT_INTRODUCTION");
    });
  });
});
