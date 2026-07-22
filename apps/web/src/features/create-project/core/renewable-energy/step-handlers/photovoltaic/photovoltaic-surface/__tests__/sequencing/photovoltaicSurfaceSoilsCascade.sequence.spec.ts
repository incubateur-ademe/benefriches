import { describe, expect, it } from "vitest";

import { getCurrentStep, StoreBuilder } from "../../../../../__tests__/_testStoreHelpers";
import { creationRenewableEnergyFormActions } from "../../../../../renewableEnergy.actions";
import type { RenewableEnergyProjectState } from "../../../../../renewableEnergy.reducer";
import type { AnswersByStep } from "../../../../../renewableEnergySteps";

// The StoreBuilder's default site (relatedSiteData) has 5000 m² MINERAL_SOIL + 10000 m²
// ARTIFICIAL_GRASS_OR_BUSHES_FILLED = 15000 m² of soils suitable for photovoltaic panels; BUILDINGS
// and FOREST_DECIDUOUS are not. So a panel surface <= 15000 m² can be accommodated (no non-suitable
// steps), > 15000 m² cannot.
const SUITABLE_SURFACE_AREA = 15000;
const NON_SUITABLE_SURFACE = SUITABLE_SURFACE_AREA + 5000; // 20000

const getForm = (store: {
  getState: () => { projectCreation: { renewableEnergyProject: RenewableEnergyProjectState } };
}): RenewableEnergyProjectState => store.getState().projectCreation.renewableEnergyProject;

// A project past the soils-transformation project selection, on a site whose panels exceed the
// suitable area (so the non-suitable steps are in play). Key parameter is POWER so editing surface
// does not fire the power/production twin — the cascade is purely the soils-transformation branch.
const stepsPastProjectSelection = (
  soilsTransformationProject: AnswersByStep["RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION"]["soilsTransformationProject"],
  surfaceSquareMeters: number = NON_SUITABLE_SURFACE,
): RenewableEnergyProjectState["steps"] => {
  const isCustom = soilsTransformationProject === "custom";
  return {
    RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: {
      completed: true,
      payload: { photovoltaicKeyParameter: "POWER" },
    },
    RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: {
      completed: true,
      payload: { photovoltaicInstallationElectricalPowerKWc: 10000 },
    },
    RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: {
      completed: true,
      payload: { photovoltaicInstallationSurfaceSquareMeters: surfaceSquareMeters },
    },
    RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: {
      completed: true,
      payload: { photovoltaicExpectedAnnualProduction: 5000 },
    },
    RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: {
      completed: true,
      payload: { nonSuitableSoilsToTransform: ["BUILDINGS"] },
    },
    RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: {
      completed: true,
      payload: { nonSuitableSoilsSurfaceAreaToTransform: { BUILDINGS: 3000 } },
    },
    RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: {
      completed: true,
      payload: { soilsTransformationProject },
    },
    ...(isCustom && {
      RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: {
        completed: true,
        payload: { futureSoilsSelection: ["PRAIRIE_GRASS"] },
      },
      RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION: {
        completed: true,
        payload: { soilsDistribution: { PRAIRIE_GRASS: 1000 } },
      },
    }),
  };
};

const changeSurfaceTo = (surfaceSquareMeters: number) =>
  creationRenewableEnergyFormActions.stepCompletionRequested({
    stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
    answers: { photovoltaicInstallationSurfaceSquareMeters: surfaceSquareMeters },
  });

describe("Renewable energy - photovoltaic surface change soils-transformation cascade sequencing", () => {
  it("stashes the soils cascade as pending without applying it (custom, still non-suitable)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsPastProjectSelection("custom"))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(changeSurfaceTo(SUITABLE_SURFACE_AREA + 10000)); // 25000, still non-suitable

    const form = getForm(store);
    expect(form.pendingStepCompletion?.showAlert).toBe(true);
    expect(form.pendingStepCompletion?.changes.cascadingChanges).toEqual([
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION", action: "invalidate" },
      { stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE", action: "invalidate" },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        action: "invalidate",
      },
      {
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        action: "invalidate",
      },
    ]);
    // Nothing applied yet.
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION?.completed).toBe(
      true,
    );
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.payload).toEqual({
      photovoltaicInstallationSurfaceSquareMeters: NON_SUITABLE_SURFACE,
    });
  });

  it("invalidates the non-suitable and custom steps and keeps PROJECT_SELECTION on confirmation (custom, still non-suitable)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsPastProjectSelection("custom"))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(changeSurfaceTo(SUITABLE_SURFACE_AREA + 10000));
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const form = getForm(store);
    // Surface is not the key parameter, so navigation follows the surface handler's own next step.
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION");
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION?.completed).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE?.completed).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION?.completed).toBe(
      false,
    );
    expect(
      form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION?.completed,
    ).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION?.completed).toBe(
      true,
    );
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.payload).toEqual({
      photovoltaicInstallationSurfaceSquareMeters: SUITABLE_SURFACE_AREA + 10000,
    });
    expect(form.pendingStepCompletion).toBeUndefined();
  });

  it("deletes the non-suitable steps on confirmation when the new surface makes the site suitable (custom)", () => {
    const store = new StoreBuilder()
      .withSteps(stepsPastProjectSelection("custom"))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(changeSurfaceTo(SUITABLE_SURFACE_AREA - 5000)); // 10000, now suitable
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const form = getForm(store);
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION?.completed).toBe(
      false,
    );
    expect(
      form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION?.completed,
    ).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION?.completed).toBe(
      true,
    );
  });

  it("invalidates PROJECT_SELECTION on confirmation for a renaturation transformation", () => {
    const store = new StoreBuilder()
      .withSteps(stepsPastProjectSelection("renaturation"))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(changeSurfaceTo(SUITABLE_SURFACE_AREA + 10000));
    store.dispatch(creationRenewableEnergyFormActions.stepCompletionConfirmed());

    const form = getForm(store);
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION?.completed).toBe(
      false,
    );
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION?.completed).toBe(false);
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE?.completed).toBe(false);
  });

  it("applies immediately with no dialog when PROJECT_SELECTION has not been reached", () => {
    const steps = stepsPastProjectSelection("custom");
    delete steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION;
    delete steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION;
    delete steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION;

    const store = new StoreBuilder()
      .withSteps(steps)
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(changeSurfaceTo(SUITABLE_SURFACE_AREA + 10000));

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION");
    expect(form.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE?.payload).toEqual({
      photovoltaicInstallationSurfaceSquareMeters: SUITABLE_SURFACE_AREA + 10000,
    });
  });

  it("applies immediately with no dialog when the surface value is unchanged", () => {
    const store = new StoreBuilder()
      .withSteps(stepsPastProjectSelection("custom"))
      .withCurrentStep("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE")
      .build();

    store.dispatch(changeSurfaceTo(NON_SUITABLE_SURFACE));

    const form = getForm(store);
    expect(form.pendingStepCompletion).toBeUndefined();
    expect(form.steps.RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION?.completed).toBe(true);
    expect(form.steps.RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION?.completed).toBe(
      true,
    );
  });

  describe("backward navigation", () => {
    it("navigates from the soils-transformation project selection back to the non-suitable soils surface step", () => {
      const store = new StoreBuilder()
        .withSteps(stepsPastProjectSelection("custom"))
        .withCurrentStep("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION")
        .build();

      store.dispatch(creationRenewableEnergyFormActions.previousStepRequested());

      expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE");
    });
  });
});
