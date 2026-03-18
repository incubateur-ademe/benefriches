import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - NAMING_INTRODUCTION step", () => {
  it("should navigate to naming step", () => {
    const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_NAMING_INTRODUCTION").build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_NAMING");
  });

  it("should navigate back to expenses summary when manager is activity park manager", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY",
        "URBAN_ZONE_NAMING_INTRODUCTION",
      ])
      .withUrbanZoneSteps({
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: { structureType: "activity_park_manager" },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_SUMMARY");
  });

  it("should navigate back to local authority expenses when manager is local authority", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES", "URBAN_ZONE_NAMING_INTRODUCTION"])
      .withUrbanZoneSteps({
        URBAN_ZONE_MANAGER: {
          completed: true,
          payload: {
            structureType: "local_authority",
            localAuthority: "municipality",
            localAuthorityName: "Mairie de Lyon",
          },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_LOCAL_AUTHORITY_EXPENSES");
  });

  it("should navigate back to expenses intro when no manager type set", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION",
        "URBAN_ZONE_NAMING_INTRODUCTION",
      ])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_EXPENSES_AND_INCOME_INTRODUCTION");
  });
});

describe("Urban zone - NAMING step", () => {
  describe("completion", () => {
    it("should store name and navigate to final summary", () => {
      const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_NAMING").build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_NAMING",
          answers: { name: "Zone d'activités de Chartres" },
        }),
      );

      expect(store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_NAMING"]).toEqual({
        completed: true,
        payload: { name: "Zone d'activités de Chartres" },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_FINAL_SUMMARY");
    });

    it("should store name and description when provided", () => {
      const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_NAMING").build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_NAMING",
          answers: { name: "Zone d'activités de Chartres", description: "Une belle zone" },
        }),
      );

      expect(store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_NAMING"]).toEqual({
        completed: true,
        payload: { name: "Zone d'activités de Chartres", description: "Une belle zone" },
      });
    });
  });

  describe("back navigation", () => {
    it("should navigate back to naming introduction", () => {
      const store = new StoreBuilder()
        .withStepsSequence(["URBAN_ZONE_NAMING_INTRODUCTION", "URBAN_ZONE_NAMING"])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_NAMING_INTRODUCTION");
    });
  });
});
