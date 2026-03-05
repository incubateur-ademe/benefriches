import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - soils decontamination surface area", () => {
  it("should complete step and navigate to soils transformation introduction", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
        answers: { decontaminatedSurfaceArea: 1000 },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA"
      ],
    ).toEqual({
      completed: true,
      payload: { decontaminatedSurfaceArea: 1000 },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
  });

  it("should navigate back to decontamination selection", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION");
  });
});
