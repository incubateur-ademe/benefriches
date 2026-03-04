import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - stakeholders future operator", () => {
  describe("completion", () => {
    it("should navigate to reinstatement contract owner when site nature is FRICHE", () => {
      // relatedSiteData.nature is "FRICHE" by default
      const store = new StoreBuilder().build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
          answers: { futureOperator: { name: "Op", structureType: "company" } },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR"
        ],
      ).toEqual({
        completed: true,
        payload: { futureOperator: { name: "Op", structureType: "company" } },
      });
      expect(getCurrentStep(store)).toBe(
        "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      );
    });

    it("should navigate to site purchase when site nature is not FRICHE", () => {
      const store = new StoreBuilder()
        .withSiteData({ ...relatedSiteData, nature: "AGRICULTURAL_OPERATION" })
        .build();
      store.dispatch(
        requestStepCompletion({
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
          answers: { futureOperator: { name: "Op", structureType: "company" } },
        }),
      );
      expect(
        store.getState().projectCreation.renewableEnergyProject.steps[
          "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR"
        ],
      ).toEqual({
        completed: true,
        payload: { futureOperator: { name: "Op", structureType: "company" } },
      });
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");
    });
  });

  describe("back navigation", () => {
    it("should navigate back to stakeholders project developer", () => {
      const store = new StoreBuilder()
        .withStepsSequence([
          "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
          "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        ])
        .build();
      store.dispatch(navigateToPrevious());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");
    });
  });
});
