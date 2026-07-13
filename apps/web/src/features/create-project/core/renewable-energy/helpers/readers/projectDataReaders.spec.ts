import { exhaustiveSteps, minimalSteps } from "../../__tests__/projectData.mock";
import type { RenewableEnergyStepsState } from "../../step-handlers/stepHandler.type";
import { getProjectData } from "./projectDataReaders";

/**
 * Behaviour-level safety net for the submitted photovoltaic project payload.
 *
 * These tests assert the full DTO shape produced from the wizard steps — not the
 * internal `{ completed, payload }` step representation. They pin the contract the
 * generic-wizard-engine extraction promises to preserve ("final payload unchanged"),
 * so they should stay green through that refactor and fail only on a real regression.
 */
describe("renewable energy - getProjectData reader", () => {
  it("maps the minimal wizard steps to the submitted project data", () => {
    const result = getProjectData(minimalSteps);

    expect(result).toEqual({
      name: "Centrale photovoltaique",
      description: undefined,
      futureOperator: { name: "SolarDev", structureType: "company" },
      futureSiteOwner: { name: "SolarDev", structureType: "company" },
      reinstatementContractOwner: undefined,
      reinstatementCosts: undefined,
      sitePurchaseSellingPrice: undefined,
      sitePurchasePropertyTransferDuties: undefined,
      financialAssistanceRevenues: [],
      yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }],
      yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
      soilsDistribution: [
        { soilType: "BUILDINGS", surfaceArea: 3000 },
        { soilType: "ARTIFICIAL_TREE_FILLED", surfaceArea: 5000 },
        { soilType: "FOREST_MIXED", surfaceArea: 60000 },
        { soilType: "MINERAL_SOIL", surfaceArea: 5000 },
        { soilType: "IMPERMEABLE_SOILS", surfaceArea: 1300 },
      ],
      reinstatementSchedule: undefined,
      operationsFirstYear: undefined,
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        developer: { name: "SolarDev", structureType: "company" },
        costs: [
          { amount: 20000, purpose: "installation_works" },
          { amount: 210000, purpose: "technical_studies" },
        ],
        installationSchedule: undefined,
        features: {
          surfaceArea: 40000,
          electricalPowerKWc: 10000,
          expectedAnnualProduction: 50000,
          contractDuration: 20,
        },
      },
      involvesReinstatement: false,
      decontaminatedSoilSurface: undefined,
    });
  });

  it("drops reinstatement fields when the project does not involve reinstatement, even if the steps hold reinstatement data", () => {
    // exhaustiveSteps carries reinstatement owner/costs/schedule but never sets
    // RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT, so involvesReinstatement defaults to false.
    const result = getProjectData(exhaustiveSteps);

    expect(result.involvesReinstatement).toBe(false);
    expect(result.reinstatementContractOwner).toBeUndefined();
    expect(result.reinstatementCosts).toBeUndefined();
    expect(result.reinstatementSchedule).toBeUndefined();
  });

  it("includes reinstatement fields when the project involves reinstatement", () => {
    const steps: RenewableEnergyStepsState = {
      ...exhaustiveSteps,
      RENEWABLE_ENERGY_INVOLVES_REINSTATEMENT: {
        completed: true,
        payload: { involvesReinstatement: true },
      },
    };

    const result = getProjectData(steps);

    expect(result.involvesReinstatement).toBe(true);
    expect(result.reinstatementContractOwner).toEqual({
      name: "Reinstatement company",
      structureType: "company",
    });
    expect(result.reinstatementCosts).toEqual([{ amount: 34500, purpose: "demolition" }]);
    expect(result.reinstatementSchedule).toEqual({
      startDate: "2025-02-01T00:00:00.000Z",
      endDate: "2028-06-30T00:00:00.000Z",
    });
  });

  it("reads decontaminated surface from the dedicated surface-area step when present", () => {
    // exhaustiveSteps sets both the selection ("partial") and the explicit surface (1000).
    const result = getProjectData(exhaustiveSteps);

    expect(result.decontaminatedSoilSurface).toBe(1000);
  });

  it("falls back to the decontamination selection surface when the surface-area step is absent", () => {
    const steps: RenewableEnergyStepsState = {
      ...minimalSteps,
      RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: {
        completed: true,
        payload: { decontaminationPlan: "partial", decontaminatedSurfaceArea: 750 },
      },
    };

    const result = getProjectData(steps);

    expect(result.decontaminatedSoilSurface).toBe(750);
  });

  it("prefers the custom surface-area allocation over the project selection for soils distribution", () => {
    const steps: RenewableEnergyStepsState = {
      ...minimalSteps,
      RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SURFACE_AREA_ALLOCATION: {
        completed: true,
        payload: { soilsDistribution: { BUILDINGS: 1000, PRAIRIE_GRASS: 2000 } },
      },
    };

    const result = getProjectData(steps);

    expect(result.soilsDistribution).toEqual([
      { soilType: "BUILDINGS", surfaceArea: 1000 },
      { soilType: "PRAIRIE_GRASS", surfaceArea: 2000 },
    ]);
  });
});
