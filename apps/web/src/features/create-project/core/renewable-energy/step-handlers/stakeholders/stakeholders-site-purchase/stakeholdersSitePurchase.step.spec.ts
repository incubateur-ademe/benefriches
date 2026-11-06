import { relatedSiteData } from "@/features/create-project/core/__tests__/siteData.mock";
import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  previousStepRequested,
  stepCompletionRequested,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";
import { creationRenewableEnergyFormSelectors } from "@/features/create-project/core/renewable-energy/renewableEnergyProject.selectors";

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

  describe("steps sequence", () => {
    it("should keep future site owner in the sequence when the site will be purchased", () => {
      const store = new StoreBuilder().build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
          answers: { willSiteBePurchased: true },
        }),
      );

      expect(store.getState().projectCreation.renewableEnergyProject.stepsSequence).toContain(
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
      );
    });

    it("should leave future site owner out of the sequence when the site will not be purchased", () => {
      const store = new StoreBuilder().build();

      store.dispatch(
        stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
          answers: { willSiteBePurchased: false },
        }),
      );

      expect(store.getState().projectCreation.renewableEnergyProject.stepsSequence).not.toContain(
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
      );
    });
  });

  describe("back navigation", () => {
    it("should navigate back to reinstatement contract owner when involvesReinstatement is true", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: true },
          },
        })
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

    it("should navigate back to future operator when involvesReinstatement is false", () => {
      const store = new StoreBuilder()
        .withSteps({
          RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
            completed: true,
            payload: { involvesReinstatement: false },
          },
        })
        .withStepsSequence([
          "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
          "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        ])
        .build();
      store.dispatch(previousStepRequested());
      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");
    });
  });

  describe("view data", () => {
    it("should give the site owner name to the question when the owner is known", () => {
      const store = new StoreBuilder()
        .withSiteData({
          ...relatedSiteData,
          owner: { name: "Mairie de Grenoble", structureType: "municipality" },
        })
        .build();

      const viewData = creationRenewableEnergyFormSelectors.selectSitePurchasedViewData(
        store.getState(),
      );

      expect(viewData).toEqual({
        isCurrentUserSiteOwner: false,
        initialValues: undefined,
        siteOwnerName: "Mairie de Grenoble",
      });
    });

    it("should not name the site owner when it is the unknown owner placeholder", () => {
      // A site saved without owner comes back from the API as this placeholder
      // (structureType "unknown" is not part of the shared owner type).
      const store = new StoreBuilder()
        .withSiteData({
          ...relatedSiteData,
          owner: {
            name: "Propriétaire inconnu",
            structureType: "unknown",
          } as unknown as typeof relatedSiteData.owner,
        })
        .build();

      const viewData = creationRenewableEnergyFormSelectors.selectSitePurchasedViewData(
        store.getState(),
      );

      expect(viewData).toEqual({
        isCurrentUserSiteOwner: false,
        initialValues: undefined,
        siteOwnerName: undefined,
      });
    });
  });
});
