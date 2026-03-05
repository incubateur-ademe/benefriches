import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - expenses photovoltaic panels installation", () => {
  it("should complete step and navigate to yearly projected expenses", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
        answers: {
          photovoltaicPanelsInstallationExpenses: [
            { amount: 20000, purpose: "installation_works" },
          ],
        },
      }),
    );
    expect(
      store.getState().projectCreation.renewableEnergyProject.steps[
        "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION"
      ],
    ).toEqual({
      completed: true,
      payload: {
        photovoltaicPanelsInstallationExpenses: [{ amount: 20000, purpose: "installation_works" }],
      },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES");
  });

  it("should navigate back to reinstatement when site is FRICHE", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
        "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
  });

  it("should navigate back to expenses introduction when site is not FRICHE and not purchased", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
        "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
      ])
      .build();
    store.dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
  });
});
