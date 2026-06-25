import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - expenses site purchase amounts", () => {
  describe("completion", () => {
    it("should navigate to reinstatement when involvesReinstatement is true", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
        })
        .build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sellingPrice: 150000, propertyTransferDuties: 12000 },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS"
        ],
      ).toEqual({
        completed: true,
        payload: { sellingPrice: 150000, propertyTransferDuties: 12000 },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
    });

    it("should navigate to photovoltaic panels installation when involvesReinstatement is false", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: false },
          },
        })
        .build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sellingPrice: 150000, propertyTransferDuties: 12000 },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS"
        ],
      ).toEqual({
        completed: true,
        payload: { sellingPrice: 150000, propertyTransferDuties: 12000 },
      });
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
      );
    });
  });

  describe("back navigation", () => {
    it("should navigate back to expenses introduction", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
          "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
    });
  });
});
