import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - stakeholders project developer", () => {
  it("should complete step and navigate to stakeholders future operator", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "Dev", structureType: "company" } },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER"
      ],
    ).toEqual({
      completed: true,
      payload: { projectDeveloper: { name: "Dev", structureType: "company" } },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");
  });

  it("should navigate back to stakeholders introduction", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION",
        "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION");
  });
});
