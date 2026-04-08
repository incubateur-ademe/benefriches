import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  nextStepRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - expenses introduction", () => {
  describe("completion", () => {
    it("should navigate to site purchase amounts when site will be purchased", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
            completed: true,
            payload: { willSiteBePurchased: true },
          },
        })
        .withStepsSequence(["RENEWABLE_ENERGY_EXPENSES_INTRODUCTION"])
        .build();
      store.dispatch(nextStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS");
    });

    it("should navigate to reinstatement when site is FRICHE and not purchased", () => {
      // relatedSiteData is FRICHE by default
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
            completed: true,
            payload: { willSiteBePurchased: false },
          },
        })
        .withStepsSequence(["RENEWABLE_ENERGY_EXPENSES_INTRODUCTION"])
        .build();
      store.dispatch(nextStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");
    });

    it("should navigate to photovoltaic panels installation when site is not FRICHE and not purchased", () => {
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, nature: "AGRICULTURAL_OPERATION" })
        .withSteps({
          RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
            completed: true,
            payload: { willSiteBePurchased: false },
          },
        })
        .withStepsSequence(["RENEWABLE_ENERGY_EXPENSES_INTRODUCTION"])
        .build();
      store.dispatch(nextStepRequested());
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
      );
    });
  });

  describe("back navigation", () => {
    it("should navigate back to future site owner when site was purchased", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
          "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
        ])
        .withSteps({
          RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
            completed: true,
            payload: { willSiteBePurchased: true },
          },
        })
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER");
    });

    it("should navigate back to site purchase when site was not purchased", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: {
            completed: true,
            payload: { willSiteBePurchased: false },
          },
        })
        .withStepsSequence([
          "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
          "RENEWABLE_ENERGY_EXPENSES_INTRODUCTION",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");
    });
  });
});
