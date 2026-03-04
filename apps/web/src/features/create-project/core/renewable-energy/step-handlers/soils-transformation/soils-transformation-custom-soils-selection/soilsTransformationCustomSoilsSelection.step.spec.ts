import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils transformation custom soils selection", () => {
  it("should complete step and navigate to custom surface area allocation", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        answers: { futureSoilsSelection: [] },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION"
      ],
    ).toEqual({
      completed: true,
      payload: { futureSoilsSelection: [] },
    });
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );
  });

  it("should navigate back to project selection", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");
  });
});
