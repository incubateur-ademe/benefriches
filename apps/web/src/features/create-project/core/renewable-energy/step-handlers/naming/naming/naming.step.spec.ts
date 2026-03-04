import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - naming", () => {
  describe("completion", () => {
    it("should complete step with name only and navigate to final summary", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_NAMING",
          answers: { name: "Ma centrale" },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_NAMING: { completed: true, payload: { name: "Ma centrale" } },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");
    });

    it("should complete step with name and description and navigate to final summary", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_NAMING",
          answers: { name: "Ma centrale", description: "Une centrale photovoltaïque" },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_NAMING: {
          completed: true,
          payload: { name: "Ma centrale", description: "Une centrale photovoltaïque" },
        },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to project phase", () => {
      const store = new StoreBuilder()
        .withStepsSequence(["RENEWABLE_ENERGY_PROJECT_PHASE", "RENEWABLE_ENERGY_NAMING"])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PROJECT_PHASE");
    });
  });
});
