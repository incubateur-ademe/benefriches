import { describe, expect, it } from "vitest";

import { relatedSiteData } from "../../__tests__/siteData.mock";
import { getProjectData } from "../helpers/readers/projectDataReaders";
import {
  nextStepRequested,
  previousStepRequested,
  stepCompletionRequested,
} from "../renewableEnergy.actions";
import { getCurrentStep, StoreBuilder } from "./_testStoreHelpers";

/**
 * Store-seam regression tests for the photovoltaic creation flow.
 *
 * These tests dispatch the same actions the UI would dispatch (stepCompletionRequested,
 * nextStepRequested, previousStepRequested) and assert only on `getCurrentStep` and the
 * final submitted `getProjectData(...)` output. They intentionally do NOT assert on the
 * internal per-step `{ completed, payload }` record shape, so they survive a wizard-engine
 * refactor as long as navigation and the submitted payload stay behaviourally the same.
 *
 * The related site (see `relatedSiteData` in `../../__tests__/siteData.mock.ts`) is a
 * FRICHE with soils: BUILDINGS 3000, MINERAL_SOIL 5000, ARTIFICIAL_GRASS_OR_BUSHES_FILLED
 * 10000, FOREST_DECIDUOUS 12000 (total 30000). Suitable soils for photovoltaic panels are
 * MINERAL_SOIL + ARTIFICIAL_GRASS_OR_BUSHES_FILLED = 15000 m2.
 */
describe("Photovoltaic creation flow (behaviour-net)", () => {
  it("completes the POWER key-parameter happy path with no reinstatement and no decontamination", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "POWER" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 8000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
        answers: { photovoltaicExpectedAnnualProduction: 12000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        answers: { photovoltaicContractDuration: 20 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "none" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        answers: { soilsTransformationProject: "custom" },
      }),
    );
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
    );

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        answers: { futureSoilsSelection: [] },
      }),
    );
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
    );

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        answers: {
          soilsDistribution: {
            MINERAL_SOIL: 15000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
            BUILDINGS: 3000,
            FOREST_DECIDUOUS: 7000,
          },
        },
      }),
    );
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",
    );

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_SUMMARY");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_CARBON_STORAGE");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "SolarDev", structureType: "company" } },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        answers: { futureOperator: { name: "SolarDev", structureType: "company" } },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        answers: { willSiteBePurchased: false },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
        answers: {
          photovoltaicPanelsInstallationExpenses: [
            { amount: 20000, purpose: "installation_works" },
          ],
        },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
        answers: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
        answers: { yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
        answers: { financialAssistanceRevenues: [] },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SCHEDULE_PROJECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
        answers: { firstYearOfOperation: 2029 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NAMING");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_NAMING",
        answers: { name: "Centrale photovoltaique" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");

    const projectData = getProjectData(
      store.getState().projectCreation.renewableEnergyProject.steps,
    );

    expect(projectData.developmentPlan.type).toBe("PHOTOVOLTAIC_POWER_PLANT");
    expect(projectData.developmentPlan.features.electricalPowerKWc).toBe(10000);
    expect(projectData.developmentPlan.features.surfaceArea).toBe(8000);
    expect(projectData.involvesReinstatement).toBe(false);
    expect(projectData.reinstatementContractOwner).toBeUndefined();
    expect(projectData.decontaminatedSoilSurface).toBe(0);
    expect(projectData.name).toBe("Centrale photovoltaique");
  });

  it("completes the SURFACE-first key-parameter path, deriving power afterwards", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "SURFACE" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 9000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 9500 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
        answers: { photovoltaicExpectedAnnualProduction: 11000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        answers: { photovoltaicContractDuration: 20 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "none" },
      }),
    );
    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        answers: { soilsTransformationProject: "custom" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        answers: { futureSoilsSelection: [] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        answers: {
          soilsDistribution: {
            MINERAL_SOIL: 15000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
            BUILDINGS: 3000,
            FOREST_DECIDUOUS: 7000,
          },
        },
      }),
    );
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CLIMATE_AND_BIODIVERSITY_IMPACT_NOTICE",
    );

    dispatch(nextStepRequested());
    dispatch(nextStepRequested());
    dispatch(nextStepRequested());
    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "SolarDev", structureType: "company" } },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        answers: { futureOperator: { name: "SolarDev", structureType: "company" } },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        answers: { willSiteBePurchased: false },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
        answers: {
          photovoltaicPanelsInstallationExpenses: [
            { amount: 20000, purpose: "installation_works" },
          ],
        },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
        answers: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
        answers: { yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
        answers: { financialAssistanceRevenues: [] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
        answers: { firstYearOfOperation: 2029 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_NAMING",
        answers: { name: "Centrale photovoltaique" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");

    const projectData = getProjectData(
      store.getState().projectCreation.renewableEnergyProject.steps,
    );

    expect(projectData.developmentPlan.features.surfaceArea).toBe(9000);
    expect(projectData.developmentPlan.features.electricalPowerKWc).toBe(9500);
  });

  it("completes the friche path with reinstatement and partial decontamination", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "POWER" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 8000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
        answers: { photovoltaicExpectedAnnualProduction: 12000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        answers: { photovoltaicContractDuration: 20 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: true },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "partial" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
        answers: { decontaminatedSurfaceArea: 1500 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        answers: { soilsTransformationProject: "custom" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        answers: { futureSoilsSelection: [] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        answers: {
          soilsDistribution: {
            MINERAL_SOIL: 15000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 5000,
            BUILDINGS: 3000,
            FOREST_DECIDUOUS: 7000,
          },
        },
      }),
    );
    dispatch(nextStepRequested()); // climate notice -> soils summary
    dispatch(nextStepRequested()); // soils summary -> soils carbon storage
    dispatch(nextStepRequested()); // soils carbon storage -> stakeholders introduction
    dispatch(nextStepRequested()); // stakeholders introduction -> project developer
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "SolarDev", structureType: "company" } },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        answers: { futureOperator: { name: "SolarDev", structureType: "company" } },
      }),
    );
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
    );

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER",
        answers: {
          reinstatementContractOwner: { name: "Reinstatement company", structureType: "company" },
        },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        answers: { willSiteBePurchased: false },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT",
        answers: { reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }] },
      }),
    );
    expect(getCurrentStep(store)).toBe(
      "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
    );

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
        answers: {
          photovoltaicPanelsInstallationExpenses: [
            { amount: 20000, purpose: "installation_works" },
          ],
        },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
        answers: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
        answers: { yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
        answers: { financialAssistanceRevenues: [] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
        answers: {
          firstYearOfOperation: 2029,
          reinstatementSchedule: {
            startDate: "2025-02-01T00:00:00.000Z",
            endDate: "2028-06-30T00:00:00.000Z",
          },
        },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_NAMING",
        answers: { name: "Friche photovoltaique" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");

    const projectData = getProjectData(
      store.getState().projectCreation.renewableEnergyProject.steps,
    );

    expect(projectData.involvesReinstatement).toBe(true);
    expect(projectData.decontaminatedSoilSurface).toBe(1500);
    expect(projectData.reinstatementContractOwner).toEqual({
      name: "Reinstatement company",
      structureType: "company",
    });
    expect(projectData.reinstatementCosts).toEqual([{ amount: 34500, purpose: "demolition" }]);
  });

  it("completes the non-suitable-soils path when the photovoltaic surface exceeds suitable soils", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "SURFACE" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 20000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 15000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
        answers: { photovoltaicExpectedAnnualProduction: 18000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        answers: { photovoltaicContractDuration: 20 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: false },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "none" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_NOTICE");

    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION",
        answers: { nonSuitableSoilsToTransform: ["FOREST_DECIDUOUS"] },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE",
        answers: { nonSuitableSoilsSurfaceAreaToTransform: { FOREST_DECIDUOUS: 5000 } },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION",
        answers: { soilsTransformationProject: "custom" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION",
        answers: { futureSoilsSelection: [] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION",
        answers: {
          soilsDistribution: {
            MINERAL_SOIL: 15000,
            ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
            BUILDINGS: 3000,
            FOREST_DECIDUOUS: 2000,
          },
        },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(nextStepRequested());
    dispatch(nextStepRequested());
    dispatch(nextStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER");

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER",
        answers: { projectDeveloper: { name: "SolarDev", structureType: "company" } },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR",
        answers: { futureOperator: { name: "SolarDev", structureType: "company" } },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE",
        answers: { willSiteBePurchased: false },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION",
        answers: {
          photovoltaicPanelsInstallationExpenses: [
            { amount: 20000, purpose: "installation_works" },
          ],
        },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES",
        answers: { yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }] },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE",
        answers: { yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE",
        answers: { financialAssistanceRevenues: [] },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SCHEDULE_PROJECTION",
        answers: { firstYearOfOperation: 2029 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_NAMING",
        answers: { name: "Centrale photovoltaique non suitable soils" },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_FINAL_SUMMARY");

    const projectData = getProjectData(
      store.getState().projectCreation.renewableEnergyProject.steps,
    );

    expect(projectData.developmentPlan.features.surfaceArea).toBe(20000);
    expect(projectData.involvesReinstatement).toBe(false);
  });

  it("navigates back to the key-parameter step from the surface step", () => {
    const store = new StoreBuilder().build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "POWER" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE");

    dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER");

    dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER");
  });

  it("navigates back from the soils transformation introduction to the contract duration step when the site has no recorded contaminated soil surface", () => {
    const store = new StoreBuilder()
      .withSiteData({ ...relatedSiteData, contaminatedSoilSurface: undefined })
      .build();
    const dispatch = store.dispatch;

    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER",
        answers: { photovoltaicKeyParameter: "POWER" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER",
        answers: { photovoltaicInstallationElectricalPowerKWc: 10000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE",
        answers: { photovoltaicInstallationSurfaceSquareMeters: 8000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION",
        answers: { photovoltaicExpectedAnnualProduction: 12000 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION",
        answers: { photovoltaicContractDuration: 20 },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT",
        answers: { involvesReinstatement: true },
      }),
    );
    dispatch(nextStepRequested());
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION",
        answers: { decontaminationPlan: "partial" },
      }),
    );
    dispatch(
      stepCompletionRequested({
        stepId: "RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA",
        answers: { decontaminatedSurfaceArea: 1500 },
      }),
    );
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_SOILS_TRANSFORMATION_INTRODUCTION");

    dispatch(previousStepRequested());
    expect(getCurrentStep(store)).toBe("RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION");
  });
});
