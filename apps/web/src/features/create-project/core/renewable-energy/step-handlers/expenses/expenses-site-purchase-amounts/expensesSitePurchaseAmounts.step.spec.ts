import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - expenses site purchase amounts", () => {
  describe("completion", () => {
    it("should navigate to reinstatement when site is FRICHE", () => {
      // relatedSiteData is FRICHE by default
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sellingPrice: 150000, propertyTransferDuties: 12000 },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: {
          completed: true,
          payload: { sellingPrice: 150000, propertyTransferDuties: 12000 },
        },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
    });

    it("should navigate to photovoltaic panels installation when site is not FRICHE", () => {
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, nature: "AGRICULTURAL_OPERATION" })
        .build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS",
          answers: { sellingPrice: 150000, propertyTransferDuties: 12000 },
        }),
      );
      expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
        RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: {
          completed: true,
          payload: { sellingPrice: 150000, propertyTransferDuties: 12000 },
        },
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
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
    });
  });
});
