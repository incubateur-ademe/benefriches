import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - non suitable soils selection", () => {
  it("should complete step and navigate to non suitable soils surface", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
        answers: { nonSuitableSoilsToTransform: [] },
      }),
    );
    expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
      RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: {
        completed: true,
        payload: { nonSuitableSoilsToTransform: [] },
      },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE");
  });

  it("should navigate back to non suitable soils notice", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE",
        "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE");
  });
});
