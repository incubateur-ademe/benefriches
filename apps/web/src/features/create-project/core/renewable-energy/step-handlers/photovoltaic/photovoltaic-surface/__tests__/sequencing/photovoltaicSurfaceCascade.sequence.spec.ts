import { describe, expect, it } from "vitest";

import { getCurrentStep, StoreBuilder } from "../../../../../__tests__/_testStoreHelpers";
import { creationRenewableEnergyFormActions } from "../../../../../renewableEnergy.actions";
import type { RenewableEnergyProjectState } from "../../../../../renewableEnergy.reducer";

const getForm = (store: {
  getState: () => { projectCreation: { renewableEnergyProject: RenewableEnergyProjectState } };
}): RenewableEnergyProjectState => store.getState().projectCreation.renewableEnergyProject;

const stepsWith = (
  keyParameter: "POWER" | "SURFACE",
  surfaceSquareMeters: number,
): RenewableEnergyProjectState["steps"] => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
    completed: true,
    payload: { photovoltaicKeyParameter: keyParameter },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
    completed: true,
    payload: { photovoltaicInstallationSurfaceSquareMeters: surfaceSquareMeters },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
    completed: true,
    payload: { photovoltaicInstallationElectricalPowerKWc: 10000 },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
    completed: true,
    payload: { photovoltaicExpectedAnnualProduction: 5000 },
  },
});

describe("Renewable energy - photovoltaic surface change cascade sequencing", () => {
  it("stashes the power-twin + production cascade as pending without applying it (surface is the key parameter)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("SURFACE", 1000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 2000 },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion?.showAlert).toBe(true);
    expect(form.pendingStepCompletion?.changes.cascadingChanges).toEqual([
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION", action: "invalidate" },
    ]);
    // Nothing applied yet.
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.payload).toEqual({
      photovoltaicInstallationSurfaceSquareMeters: 1000,
    });
  });

  it("invalidates the power twin and production and navigates to power on confirmation (surface is the key parameter)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("SURFACE", 1000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 2000 },
      }),
    );
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const form = getForm(store);
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.completed).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed).toBe(
      false,
    );
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.payload).toEqual({
      photovoltaicInstallationSurfaceSquareMeters: 2000,
    });
    expect(form.pendingStepCompletion).toBeUndefined();
  });

  it("does not touch power or production and shows no dialog when surface changes but power is the key parameter", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("POWER", 1000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 2000 },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed).toBe(
      true,
    );
  });

  it("applies immediately with no pending dialog when surface is re-entered unchanged", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWith("SURFACE", 1000))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 1000 },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed).toBe(
      true,
    );
  });
});
