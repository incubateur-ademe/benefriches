import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - expenses reinstatement", () => {
  it("should complete step and navigate to photovoltaic panels installation", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
        answers: { reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }] },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT"
      ],
    ).toEqual({
      completed: true,
      payload: { reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }] },
    });
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );
  });

  it("should navigate back to expenses introduction when no site purchase", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
  });

  it("should navigate back to site purchase amounts when site was purchased", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS");
  });
});
