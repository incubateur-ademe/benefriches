import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - photovoltaic surface", () => {
  describe("completion", () => {
    it("should navigate to expected annual production when key parameter is POWER", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
            completed: true,
            payload: { photovoltaicKeyParameter: "POWER" },
          },
        })
        .build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
          answers: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
          completed: true,
          payload: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
        },
      });
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
      );
    });

    it("should navigate to photovoltaic power when key parameter is SURFACE", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
            completed: true,
            payload: { photovoltaicKeyParameter: "SURFACE" },
          },
        })
        .build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
          answers: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
          completed: true,
          payload: { photovoltaicInstallationSurfaceSquareMeters: 40000 },
        },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to key parameter when key=SURFACE (surface is first step)", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        ])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
    });

    it("should navigate back to power when key=POWER (power comes before surface)", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        ])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    });
  });
});
