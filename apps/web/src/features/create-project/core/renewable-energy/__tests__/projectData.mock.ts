import type { RenewableEnergyStepsState } from "../step-handlers/stepHandler.type";

/**
 * Converts flat project creation data into the new per-step state format.
 * Each step has `{ completed: true, payload: { ...stepData } }`.
 */
const makeStep = <T>(payload: T) => ({ completed: true, payload });

export const minimalSteps: RenewableEnergyStepsState = {
  RENEWABLE_ENERGY_PHOTOVOLTAIC_KEY_PARAMETER: makeStep({
    photovoltaicKeyParameter: "POWER" as const,
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_POWER: makeStep({
    photovoltaicInstallationElectricalPowerKWc: 10000,
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_SURFACE: makeStep({
    photovoltaicInstallationSurfaceSquareMeters: 40000,
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_EXPECTED_ANNUAL_PRODUCTION: makeStep({
    photovoltaicExpectedAnnualProduction: 50000,
  }),
  RENEWABLE_ENERGY_PHOTOVOLTAIC_CONTRACT_DURATION: makeStep({
    photovoltaicContractDuration: 20,
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: makeStep({
    projectDeveloper: { name: "SolarDev", structureType: "company" },
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: makeStep({
    futureOperator: { name: "SolarDev", structureType: "company" },
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: makeStep({
    futureSiteOwner: { name: "SolarDev", structureType: "company" },
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_SITE_PURCHASE: makeStep({
    willSiteBePurchased: false,
  }),
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SELECTION: makeStep({
    nonSuitableSoilsToTransform: [],
  }),
  RENEWABLE_ENERGY_NON_SUITABLE_SOILS_SURFACE: makeStep({
    nonSuitableSoilsSurfaceAreaToTransform: {},
    baseSoilsDistributionForTransformation: {},
  }),
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_PROJECT_SELECTION: makeStep({
    soilsTransformationProject: "custom" as const,
    soilsDistribution: {
      BUILDINGS: 3000,
      ARTIFICIAL_TREE_FILLED: 5000,
      FOREST_MIXED: 60000,
      MINERAL_SOIL: 5000,
      IMPERMEABLE_SOILS: 1300,
    },
  }),
  RENEWABLE_ENERGY_SOILS_TRANSFORMATION_CUSTOM_SOILS_SELECTION: makeStep({
    futureSoilsSelection: [],
  }),
  RENEWABLE_ENERGY_EXPENSES_PHOTOVOLTAIC_PANELS_INSTALLATION: makeStep({
    photovoltaicPanelsInstallationExpenses: [
      { amount: 20000, purpose: "installation_works" },
      { amount: 210000, purpose: "technical_studies" },
    ],
  }),
  RENEWABLE_ENERGY_EXPENSES_PROJECTED_YEARLY_EXPENSES: makeStep({
    yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }],
  }),
  RENEWABLE_ENERGY_REVENUE_PROJECTED_YEARLY_REVENUE: makeStep({
    yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
  }),
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: makeStep({
    financialAssistanceRevenues: [],
  }),
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: makeStep({}),
  RENEWABLE_ENERGY_PROJECT_PHASE: makeStep({
    phase: "design",
  }),
  RENEWABLE_ENERGY_NAMING: makeStep({
    name: "Centrale photovoltaique",
  }),
};

export const exhaustiveSteps: RenewableEnergyStepsState = {
  ...minimalSteps,
  RENEWABLE_ENERGY_STAKEHOLDERS_PROJECT_DEVELOPER: makeStep({
    projectDeveloper: { name: "developer company name", structureType: "company" },
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_OPERATOR: makeStep({
    futureOperator: { name: "Future operating company name", structureType: "company" },
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_FUTURE_SITE_OWNER: makeStep({
    futureSiteOwner: { name: "Future site owner company name", structureType: "company" },
  }),
  RENEWABLE_ENERGY_STAKEHOLDERS_REINSTATEMENT_CONTRACT_OWNER: makeStep({
    reinstatementContractOwner: { name: "Reinstatement company", structureType: "company" },
  }),
  RENEWABLE_ENERGY_EXPENSES_REINSTATEMENT: makeStep({
    reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }],
  }),
  RENEWABLE_ENERGY_EXPENSES_SITE_PURCHASE_AMOUNTS: makeStep({
    sellingPrice: 150000,
    propertyTransferDuties: 12000,
  }),
  RENEWABLE_ENERGY_REVENUE_FINANCIAL_ASSISTANCE: makeStep({
    financialAssistanceRevenues: [
      { source: "local_or_regional_authority_participation", amount: 10000 },
      { source: "public_subsidies", amount: 4000 },
      { source: "other", amount: 999.99 },
    ],
  }),
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SELECTION: makeStep({
    decontaminationPlan: "partial" as const,
  }),
  RENEWABLE_ENERGY_SOILS_DECONTAMINATION_SURFACE_AREA: makeStep({
    decontaminatedSurfaceArea: 1000,
  }),
  RENEWABLE_ENERGY_SCHEDULE_PROJECTION: makeStep({
    reinstatementSchedule: {
      startDate: "2025-02-01T00:00:00.000Z",
      endDate: "2028-06-30T00:00:00.000Z",
    },
    photovoltaicInstallationSchedule: {
      startDate: "2026-03-01T00:00:00.000Z",
      endDate: "2028-09-30T00:00:00.000Z",
    },
    firstYearOfOperation: 2029,
  }),
  RENEWABLE_ENERGY_PROJECT_PHASE: makeStep({
    phase: "design",
  }),
  RENEWABLE_ENERGY_NAMING: makeStep({
    name: "Centrale photovoltaique",
    description: "Description of reconversion project",
  }),
};

/**
 * Helper to override a specific step's payload in a steps state object.
 * Returns a new steps object with the specified step's payload replaced.
 */
export const withStepPayload = (
  steps: RenewableEnergyStepsState,
  stepId: keyof RenewableEnergyStepsState,
  payload: unknown,
): RenewableEnergyStepsState => ({
  ...steps,
  [stepId]: payload === undefined ? undefined : { completed: true, payload },
});
