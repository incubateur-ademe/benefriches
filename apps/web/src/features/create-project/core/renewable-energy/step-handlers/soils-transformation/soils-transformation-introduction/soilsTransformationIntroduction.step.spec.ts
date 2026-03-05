import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  nextStepRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils transformation introduction", () => {
  describe("completion", () => {
    it("should navigate to soils transformation project selection when site can accommodate panels", () => {
      // relatedSiteData has ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000, a small surface fits
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
            completed: true,
            payload: { photovoltaicInstallationSurfaceSquareMeters: 500 },
          },
        })
        .withStepsSequence(["RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION"])
        .build();
      store.dispatch(nextStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");
    });

    it("should navigate to non suitable soils notice when site cannot accommodate panels", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
            completed: true,
            payload: { photovoltaicInstallationSurfaceSquareMeters: 100000 },
          },
        })
        .withStepsSequence(["RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION"])
        .build();
      store.dispatch(nextStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to contract duration when no decontamination", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION");
    });

    it("should navigate back to decontamination surface area when decontamination was done", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
          "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA");
    });
  });
});
