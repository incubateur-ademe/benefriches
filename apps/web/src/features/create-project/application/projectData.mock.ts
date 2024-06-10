import {
  FinancialAssistanceRevenue,
  PhotovoltaicKeyParameter,
  ProjectStakeholder,
  ReconversionProjectCreationData,
} from "../domain/project.types";

export const projectWithMinimalData = {
  id: "64789135-afad-46ea-97a2-f14ba460d485",
  relatedSiteId: "f590f643-cd9a-4187-8973-f90e9f1998c8",
  name: "Centrale photovoltaique",
  soilsDistribution: {
    BUILDINGS: 3000,
    ARTIFICIAL_TREE_FILLED: 5000,
    FOREST_MIXED: 60000,
    MINERAL_SOIL: 5000,
    IMPERMEABLE_SOILS: 1300,
  },
  yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }],
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
  projectPhase: "planning",
  developmentPlanCategories: ["RENEWABLE_ENERGY"],
  renewableEnergyTypes: ["PHOTOVOLTAIC_POWER_PLANT"],
  photovoltaicKeyParameter: PhotovoltaicKeyParameter.POWER,
  photovoltaicInstallationElectricalPowerKWc: 10000,
  photovoltaicInstallationSurfaceSquareMeters: 40000,
  photovoltaicExpectedAnnualProduction: 50000,
  photovoltaicContractDuration: 20,
  photovoltaicPanelsInstallationCosts: [
    { amount: 20000, purpose: "installation_work" },
    { amount: 210000, purpose: "technical_studies" },
  ],
  financialAssistanceRevenues: [],
  projectDeveloper: { name: "SolarDev", structureType: "company" },
  futureOperator: { name: "SolarDev", structureType: "company" },
  futureSiteOwner: { name: "SolarDev", structureType: "company" },
  baseSoilsDistributionForTransformation: {},
  nonSuitableSoilsToTransform: [],
  futureSoilsSelection: [],
  hasRealEstateTransaction: false,
} as const satisfies ReconversionProjectCreationData;

export const projectWithExhaustiveData = {
  ...projectWithMinimalData,
  description: "Description of reconversion project",
  projectDeveloper: {
    name: "developer company name",
    structureType: "company",
  } as ProjectStakeholder,
  futureOperator: {
    name: "Future operating company name",
    structureType: "company",
  } as ProjectStakeholder,
  futureSiteOwner: {
    name: "Future site owner company name",
    structureType: "company",
  } as ProjectStakeholder,
  conversionFullTimeJobsInvolved: 0.3,
  operationsFullTimeJobsInvolved: 2,
  // reinstatement
  reinstatementFullTimeJobsInvolved: 0.2,
  reinstatementContractOwner: {
    name: "Reinstatement company",
    structureType: "company",
  } as ProjectStakeholder,
  reinstatementCosts: {
    total: 34500,
    costs: [{ amount: 34500, purpose: "demolition" }],
  },
  realEstateTransactionSellingPrice: 150000,
  realEstateTransactionPropertyTransferDuties: 12000,
  financialAssistanceRevenues: [
    { source: "local_or_regional_authority_participation", amount: 10000 },
    { source: "public_subsidies", amount: 4000 },
    { source: "other", amount: 999.99 },
  ] as FinancialAssistanceRevenue[],
  reinstatementSchedule: {
    startDate: new Date("2025-02-01"),
    endDate: new Date("2028-06-30"),
  },
  photovoltaicInstallationSchedule: { startDate: new Date(), endDate: new Date() },
  firstYearOfOperation: 2029,
  projectPhase: "design",
  projectPhaseDetails: "design_final_draft",
} as const satisfies Required<ReconversionProjectCreationData>;
