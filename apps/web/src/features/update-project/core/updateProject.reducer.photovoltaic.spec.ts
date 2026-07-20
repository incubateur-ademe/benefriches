import { describe, expect, it } from "vitest";

import { updateProjectFormRenewableEnergyActions } from "./updateProject.actions";
import { reconversionProjectUpdateInitiated } from "./updateProject.actions";
import updateProjectReducer from "./updateProject.reducer";
import { UpdateProjectView } from "./updateProject.types";

const BASE_PROJECT_DATA: UpdateProjectView["projectData"] = {
  id: "project-1",
  createdBy: "user-1",
  createdAt: "2026-01-01",
  creationMode: "custom",
  name: "Centrale de test",
  relatedSiteId: "site-1",
  involvesReinstatement: false,
  projectPhase: "planning",
  developmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT",
    developer: { name: "Dev Corp", structureType: "company" },
    costs: [{ purpose: "installation_works", amount: 100000 }],
    features: {
      surfaceArea: 5000,
      electricalPowerKWc: 800,
      expectedAnnualProduction: 900,
      contractDuration: 30,
    },
  },
  soilsDistribution: [{ soilType: "IMPERMEABLE_SOILS", surfaceArea: 5000 }],
  yearlyProjectedCosts: [{ purpose: "maintenance", amount: 1000 }],
  yearlyProjectedRevenues: [{ source: "operations", amount: 50000 }],
  futureOperator: { name: "Operator Corp", structureType: "company" },
};

const BASE_SITE_DATA: UpdateProjectView["siteData"] = {
  id: "site-1",
  name: "Friche test",
  nature: "FRICHE",
  isExpressSite: false,
  owner: { structureType: "company", name: "Owner" },
  hasContaminatedSoils: false,
  soilsDistribution: { IMPERMEABLE_SOILS: 5000 },
  surfaceArea: 5000,
  address: {
    banId: "addr-1",
    city: "Paris",
    cityCode: "75056",
    postCode: "75001",
    streetName: "Rue",
    streetNumber: "1",
    value: "1 Rue, 75001 Paris",
    long: 2.35,
    lat: 48.85,
  },
};

const hydrate = () => {
  const initialState = updateProjectReducer(undefined, { type: "@@INIT" });
  const hydratedState = updateProjectReducer(
    initialState,
    reconversionProjectUpdateInitiated.fulfilled(
      { projectData: BASE_PROJECT_DATA, siteData: BASE_SITE_DATA },
      "request-1",
      "project-1",
    ),
  );
  return structuredClone(hydratedState);
};

describe("update project reducer - photovoltaic", () => {
  it("hydrates a saved photovoltaic project's answers and lands on the final summary", () => {
    const state = hydrate();

    expect(state.projectData.projectType).toBe("PHOTOVOLTAIC_POWER_PLANT");
    expect(state.renewableEnergyProject.currentStep).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");
    expect(state.renewableEnergyProject.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER).toEqual({
      completed: true,
      payload: { photovoltaicInstallationElectricalPowerKWc: 800 },
    });
    expect(state.renewableEnergyProject.steps.RENEWABLE_ENERGY_NAMING).toEqual({
      completed: true,
      payload: { name: "Centrale de test", description: undefined },
    });
  });

  it("reconstructs the POWER branch path: navigating back from the power step lands on the key parameter step", () => {
    const state = hydrate();
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER";

    const previousState = updateProjectReducer(
      state,
      updateProjectFormRenewableEnergyActions.previousStepRequested(),
    );

    expect(previousState.renewableEnergyProject.currentStep).toBe(
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
    );
  });

  it("reconstructs the POWER branch path: navigating forward from the surface step lands on the expected annual production step", () => {
    const state = hydrate();
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE";

    const nextState = updateProjectReducer(
      state,
      updateProjectFormRenewableEnergyActions.nextStepRequested(),
    );

    expect(nextState.renewableEnergyProject.currentStep).toBe(
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
  });

  it("editing one answer preserves the other previously hydrated answers and returns to the final summary", () => {
    const state = hydrate();
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION";

    const editedState = updateProjectReducer(
      state,
      updateProjectFormRenewableEnergyActions.stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        answers: { photovoltaicContractDuration: 25 },
      }),
    );

    expect(
      editedState.renewableEnergyProject.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION,
    ).toEqual({
      completed: true,
      payload: { photovoltaicContractDuration: 25 },
    });
    expect(editedState.renewableEnergyProject.steps.RENEWABLE_ENERGY_NAMING).toEqual({
      completed: true,
      payload: { name: "Centrale de test", description: undefined },
    });
    expect(editedState.renewableEnergyProject.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER).toEqual({
      completed: true,
      payload: { photovoltaicInstallationElectricalPowerKWc: 800 },
    });
    expect(editedState.renewableEnergyProject.currentStep).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");
  });

  it("navigating back then forward through an edited step keeps the edited answer and other answers intact", () => {
    const state = hydrate();
    state.renewableEnergyProject.currentStep = "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION";
    const editedState = structuredClone(
      updateProjectReducer(
        state,
        updateProjectFormRenewableEnergyActions.stepCompletionRequested({
          stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
          answers: { photovoltaicContractDuration: 25 },
        }),
      ),
    );
    editedState.renewableEnergyProject.currentStep =
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION";

    const backState = updateProjectReducer(
      editedState,
      updateProjectFormRenewableEnergyActions.previousStepRequested(),
    );
    const forwardState = updateProjectReducer(
      backState,
      updateProjectFormRenewableEnergyActions.nextStepRequested(),
    );

    expect(backState.renewableEnergyProject.currentStep).toBe(
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
    );
    expect(forwardState.renewableEnergyProject.currentStep).toBe(
      "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
    );
    expect(
      forwardState.renewableEnergyProject.steps.RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION,
    ).toEqual({
      completed: true,
      payload: { photovoltaicContractDuration: 25 },
    });
    expect(forwardState.renewableEnergyProject.steps.RENEWABLE_ENERGY_NAMING).toEqual({
      completed: true,
      payload: { name: "Centrale de test", description: undefined },
    });
  });
});
