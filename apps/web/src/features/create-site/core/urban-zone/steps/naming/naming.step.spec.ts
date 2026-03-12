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

  it("should navigate back to full time jobs equivalent when that step was visited", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT", "URBAN_ZONE_NAMING_INTRODUCTION"])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_FULL_TIME_JOBS_EQUIVALENT");
  });

  it("should navigate back to vacant commercial premises floor area when footprint equals site surface area", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA",
        "URBAN_ZONE_NAMING_INTRODUCTION",
      ])
      .withSiteData({ surfaceArea: 1000 })
      .withUrbanZoneSteps({
        URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FOOTPRINT: {
          completed: true,
          payload: { surfaceArea: 1000 },
        },
      })
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_VACANT_COMMERCIAL_PREMISES_FLOOR_AREA");
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
