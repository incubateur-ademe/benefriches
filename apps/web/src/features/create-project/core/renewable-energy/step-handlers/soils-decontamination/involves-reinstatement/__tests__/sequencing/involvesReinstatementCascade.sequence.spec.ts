import { describe, expect, it } from "vitest";

import { getCurrentStep, StoreBuilder } from "../../../../../__tests__/_testStoreHelpers";
import { creationRenewableEnergyFormActions } from "../../../../../renewableEnergy.actions";
import type { RenewableEnergyProjectState } from "../../../../../renewableEnergy.reducer";

const getForm = (store: {
  getState: () => { projectCreation: { renewableEnergyProject: RenewableEnergyProjectState } };
}): RenewableEnergyProjectState => store.getState().projectCreation.renewableEnergyProject;

const stepsWithReinstatement = (
  involvesReinstatement: boolean,
): RenewableEnergyProjectState["steps"] => ({
  RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
    completed: true,
    payload: { involvesReinstatement },
  },
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: {
    completed: true,
    payload: { reinstatementContractOwner: { name: "MOA", structureType: "company" } },
  },
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: {
    completed: true,
    payload: { reinstatementExpenses: [{ purpose: "demolition", amount: 12000 }] },
  },
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: {
    completed: true,
    payload: { firstYearOfOperation: 2025 },
  },
});

describe("Renewable energy - InvolvesReinstatement cascade sequencing", () => {
  it("stashes the cascade as pending and does not apply or navigate until confirmed", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWithReinstatement(true))
      .withCurrentStep("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion?.showAlert).toBe(true);
    expect(form.pendingStepCompletion?.changes.cascadingChanges).toEqual([
      { stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER", action: "delete" },
      { stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION", action: "invalidate" },
    ]);
    // Nothing applied yet: current step unchanged, steps untouched.
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT");
    expect(form.steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT).toBeDefined();
    expect(form.steps.RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT?.payload).toEqual({
      involvesReinstatement: true,
    });
  });

  it("applies the cascade and navigates forward past the gate on confirmation", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWithReinstatement(true))
      .withCurrentStep("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const form = getForm(store);
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    expect(form.steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_SCHEDULE_PROJECTION?.completed).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT?.payload).toEqual({
      involvesReinstatement: false,
    });
    expect(form.pendingStepCompletion).toBeUndefined();
  });

  it("navigates backward to the reinstatement step after passing the gate forward", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWithReinstatement(true))
      .withCurrentStep("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());
    store.dispatch(creationRenewableEnergyFormActions.previousStepRequested());

    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT");
  });

  it("discards the pending cascade on cancellation, leaving steps intact", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWithReinstatement(true))
      .withCurrentStep("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionCancelled());

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT");
    expect(form.steps.RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT).toBeDefined();
    expect(form.steps.RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER).toBeDefined();
    expect(form.steps.RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT?.payload).toEqual({
      involvesReinstatement: true,
    });
  });

  it("applies immediately with no pending dialog when the edit produces no cascade (false to true)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWithReinstatement(false))
      .withCurrentStep("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: true },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");
    expect(form.steps.RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT?.payload).toEqual({
      involvesReinstatement: true,
    });
  });
});
