import { describe, expect, it } from "vitest";

import { getCurrentStep, StoreBuilder } from "../../../../../__tests__/_testStoreHelpers";
import { creationRenewableEnergyFormActions } from "../../../../../renewableEnergy.actions";
import type { RenewableEnergyProjectState } from "../../../../../renewableEnergy.reducer";

const getForm = (store: {
  getState: () => { projectCreation: { renewableEnergyProject: RenewableEnergyProjectState } };
}): RenewableEnergyProjectState => store.getState().projectCreation.renewableEnergyProject;

const stepsWith = (
  keyParameter: "POWER" | "SURFACE",
  powerKWc: number,
): RenewableEnergyProjectState["steps"] => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
    completed: true,
    payload: { photovoltaicKeyParameter: keyParameter },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
    completed: true,
    payload: { photovoltaicInstallationElectricalPowerKWc: powerKWc },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
    completed: true,
    payload: { photovoltaicInstallationSurfaceSquareMeters: 1000 },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
    completed: true,
    payload: { photovoltaicExpectedAnnualProduction: 5000 },
  },
});

describe("Renewable energy - photovoltaic power change cascade sequencing", () => {
  it("stashes the production + surface-twin cascade as pending without applying it (power is the key parameter)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("POWER", 10000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 20000 },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion?.showAlert).toBe(true);
    expect(form.pendingStepCompletion?.changes.cascadingChanges).toEqual([
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE", action: "invalidate" },
    ]);
    // Nothing applied yet.
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.payload).toEqual({
      photovoltaicInstallationElectricalPowerKWc: 10000,
    });
  });

  it("invalidates production and the surface twin and navigates to surface on confirmation (power is the key parameter)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("POWER", 10000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 20000 },
      }),
    );
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const form = getForm(store);
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.completed).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed).toBe(
      false,
    );
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.payload).toEqual({
      photovoltaicInstallationElectricalPowerKWc: 20000,
    });
    expect(form.pendingStepCompletion).toBeUndefined();
  });

  it("invalidates only production, leaving the surface untouched, when surface is the key parameter", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("SURFACE", 10000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 20000 },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion?.changes.cascadingChanges).toEqual([
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION", action: "invalidate" },
    ]);

    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const confirmedForm = getForm(store);
    expect(confirmedForm.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.completed).toBe(true);
    expect(
      confirmedForm.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed,
    ).toBe(false);
  });

  it("applies immediately with no pending dialog when power is re-entered unchanged", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("POWER", 10000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed).toBe(
      true,
    );
  });
});
