import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - key parameter", () => {
  describe("completion", () => {
    it("should complete step with POWER and navigate to photovoltaic power", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          answers: { photovoltaicKeyParameter: "POWER" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER"
        ],
      ).toEqual({
        completed: true,
        payload: { photovoltaicKeyParameter: "POWER" },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    });

    it("should complete step with SURFACE and navigate to photovoltaic surface", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
          answers: { photovoltaicKeyParameter: "SURFACE" },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER"
        ],
      ).toEqual({
        completed: true,
        payload: { photovoltaicKeyParameter: "SURFACE" },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to key parameter when it is the only step in sequence", () => {
      const store = new StoreBuilder()
        .withStepsSequence(["RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER"])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
    });
  });
});
