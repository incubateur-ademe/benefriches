import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - photovoltaic contract duration", () => {
  describe("completion", () => {
    it("should navigate to soils decontamination introduction when site has contaminated soil", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...relatedSiteData,
          hasContaminatedSoils: true,
          contaminatedSoilSurface: 2000,
        })
        .build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
          answers: { photovoltaicContractDuration: 20 },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION"
        ],
      ).toEqual({
        completed: true,
        payload: { photovoltaicContractDuration: 20 },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    });

    it("should navigate to soils transformation introduction when site has no contaminated soil", () => {
      const store = new StoreBuilder().build();
      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
          answers: { photovoltaicContractDuration: 20 },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION"
        ],
      ).toEqual({
        completed: true,
        payload: { photovoltaicContractDuration: 20 },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to expected annual production", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
          "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
      );
    });
  });
});
