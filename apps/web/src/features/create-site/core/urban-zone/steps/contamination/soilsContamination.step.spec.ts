import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-site/core/urban-zone/__tests__/_testStoreHelpers";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-site/core/urban-zone/urban-zone.actions";

describe("Urban zone - SOILS_CONTAMINATION_INTRODUCTION step", () => {
  it("should navigate to soils contamination", () => {
    const store = new StoreBuilder()
      .withCurrentStep("URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION")
      .build();

    store.dispatch(nextStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_CONTAMINATION");
  });

  it("should navigate back to soils carbon storage", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "URBAN_ZONE_SOILS_CARBON_STORAGE",
        "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",
      ])
      .build();

    store.dispatch(previousStepRequested());

    expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_CARBON_STORAGE");
  });
});

describe("Urban zone - SOILS_CONTAMINATION step", () => {
  describe("completion", () => {
    it("should store contamination data and navigate to management introduction when soils are contaminated", () => {
      const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_SOILS_CONTAMINATION").build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_SOILS_CONTAMINATION",
          answers: { hasContaminatedSoils: true, contaminatedSoilSurface: 500 },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_SOILS_CONTAMINATION"],
      ).toEqual({
        completed: true,
        payload: { hasContaminatedSoils: true, contaminatedSoilSurface: 500 },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGEMENT_INTRODUCTION");
    });

    it("should store no-contamination data and navigate to management introduction when soils are not contaminated", () => {
      const store = new StoreBuilder().withCurrentStep("URBAN_ZONE_SOILS_CONTAMINATION").build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "URBAN_ZONE_SOILS_CONTAMINATION",
          answers: { hasContaminatedSoils: false },
        }),
      );

      expect(
        store.getState().siteCreation.urbanZone.steps["URBAN_ZONE_SOILS_CONTAMINATION"],
      ).toEqual({
        completed: true,
        payload: { hasContaminatedSoils: false },
      });
      expect(getCurrentStep(store)).toBe("URBAN_ZONE_MANAGEMENT_INTRODUCTION");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to contamination introduction when going back from contamination", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION",
          "URBAN_ZONE_SOILS_CONTAMINATION",
        ])
        .build();

      store.dispatch(previousStepRequested());

      expect(getCurrentStep(store)).toBe("URBAN_ZONE_SOILS_CONTAMINATION_INTRODUCTION");
    });
  });
});
