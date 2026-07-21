import { describe, expect, it } from "vitest";

import { StoreBuilder } from "../../../../../__tests__/_testStoreHelpers";
import { creationRenewableEnergyFormActions } from "../../../../../renewableEnergy.actions";
import type { RenewableEnergyProjectState } from "../../../../../renewableEnergy.reducer";

const getForm = (store: {
  getState: () => { projectCreation: { renewableEnergyProject: RenewableEnergyProjectState } };
}): RenewableEnergyProjectState => store.getState().projectCreation.renewableEnergyProject;

const stepsWithKeyParameter = (
  keyParameter: "POWER" | "SURFACE",
): RenewableEnergyProjectState["steps"] => ({
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
    completed: true,
    payload: { photovoltaicKeyParameter: keyParameter },
  },
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
    completed: true,
    payload: { photovoltaicInstallationElectricalPowerKWc: 10000 },
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

describe("Renewable energy - photovoltaic key parameter change sequencing", () => {
  it("switching the key parameter with prefilled values kept invalidates nothing and shows no dialog", () => {
    const store = new StoreBuilder()
      .withSteps(stepsWithKeyParameter("POWER"))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER")
      .build();

    store.dispatch(
      creationRenewableEnergyFormActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "SURFACE" },
      }),
    );

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION?.completed).toBe(
      true,
    );
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER?.payload).toEqual({
      photovoltaicKeyParameter: "SURFACE",
    });
  });
});
