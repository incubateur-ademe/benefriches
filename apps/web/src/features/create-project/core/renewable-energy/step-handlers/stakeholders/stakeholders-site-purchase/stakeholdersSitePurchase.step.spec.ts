import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - stakeholders site purchase", () => {
  describe("completion", () => {
    it("should navigate to future site owner when site will be purchased", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
          answers: { willSiteBePurchased: true },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE"
        ],
      ).toEqual({
        completed: true,
        payload: { willSiteBePurchased: true },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER");
    });

    it("should navigate to expenses introduction when site will not be purchased", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
          answers: { willSiteBePurchased: false },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE"
        ],
      ).toEqual({
        completed: true,
        payload: { willSiteBePurchased: false },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to reinstatement contract owner when site is FRICHE", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
          "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );
    });

    it("should navigate back to future operator when site is not FRICHE", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
          "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");
    });
  });
});
