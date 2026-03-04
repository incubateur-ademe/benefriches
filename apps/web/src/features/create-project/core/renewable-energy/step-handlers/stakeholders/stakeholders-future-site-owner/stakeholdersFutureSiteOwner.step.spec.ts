import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - stakeholders future site owner", () => {
  it("should complete step and navigate to expenses introduction", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
        answers: { futureSiteOwner: { name: "Owner", structureType: "company" } },
      }),
    );
    expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
      RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: {
        completed: true,
        payload: { futureSiteOwner: { name: "Owner", structureType: "company" } },
      },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");
  });

  it("should navigate back to stakeholders site purchase", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");
  });
});
