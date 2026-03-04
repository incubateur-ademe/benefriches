import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - photovoltaic power", () => {
  describe("completion", () => {
    it("should navigate to photovoltaic surface when key parameter is POWER", () => {
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
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
          answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
          completed: true,
          payload: { photovoltaicInstallationElectricalPowerKWc: 10000 },
        },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    });

    it("should navigate to expected annual production when key parameter is SURFACE", () => {
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
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
          answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
          completed: true,
          payload: { photovoltaicInstallationElectricalPowerKWc: 10000 },
        },
      });
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
      );
    });
  });

  describe("back navigation", () => {
    it("should navigate back to key parameter", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        ])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
    });
  });
});
