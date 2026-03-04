import {
  getCurrentStep,
  StoreBuilder,
} from "@/features/create-project/core/renewable-energy/__tests__/_testStoreHelpers";
import {
  navigateToPrevious,
  requestStepCompletion,
} from "@/features/create-project/core/renewable-energy/renewableEnergy.actions";

describe("Renewable energy creation - Steps - stakeholders reinstatement contract owner", () => {
  it("should complete step and navigate to stakeholders site purchase", () => {
    const store = new StoreBuilder().build();
    store.dispatch(
      requestStepCompletion({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        answers: { reinstatementContractOwner: { name: "RC", structureType: "company" } },
      }),
    );
    expect(store.getState().projectCreation.renewableEnergyProject.steps).toMatchObject({
      RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
        completed: true,
        payload: { reinstatementContractOwner: { name: "RC", structureType: "company" } },
      },
    });
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");
  });

  it("should navigate back to stakeholders future operator", () => {
    const store = new StoreBuilder()
      .withStepsSequence([
        "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
      ])
      .build();
    store.dispatch(navigateToPrevious());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");
  });
});
