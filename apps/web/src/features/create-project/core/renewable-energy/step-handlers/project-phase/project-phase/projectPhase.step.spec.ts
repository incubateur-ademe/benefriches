import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - project phase", () => {
  it("should complete step and navigate to naming", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_PROJECT_PHASE",
        answers: { phase: "design" },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_PROJECT_PHASE"
      ],
    ).toEqual({
      completed: true,
      payload: { phase: "design" },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NAMING");
  });

  it("should navigate back to schedule projection", () => {
    const store = new StoreBuilder()
      .withStepsSequence(["RENEWABLE_ENERGY_SCHEDULE_PROJECTION", "RENEWABLE_ENERGY_PROJECT_PHASE"])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SCHEDULE_PROJECTION");
  });
});
