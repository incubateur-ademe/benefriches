import { ReconversionProjectCreationData } from "@/features/create-project/core/project.types";

export const projectWithMinimalData = {
  relatedSiteId: "f590f643-cd9a-4187-8973-f90e9f1998c8",
  name: "Centrale photovoltaique",
  soilsDistribution: {
    BUILDINGS: 3000,
    ARTIFICIAL_TREE_FILLED: 5000,
    FOREST_MIXED: 60000,
    MINERAL_SOIL: 5000,
    IMPERMEABLE_SOILS: 1300,
  },
  yearlyProjectedExpenses: [{ purpose: "rent", amount: 12000 }],
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
  projectPhase: "design",
  renewableEnergyType: "PHOTOVOLTAIC_POWER_PLANT",
  photovoltaicKeyParameter: "POWER",
  photovoltaicInstallationElectricalPowerKWc: 10000,
  photovoltaicInstallationSurfaceSquareMeters: 40000,
  photovoltaicExpectedAnnualProduction: 50000,
  photovoltaicContractDuration: 20,
  photovoltaicPanelsInstallationExpenses: [
    { amount: 20000, purpose: "installation_works" },
    { amount: 210000, purpose: "technical_studies" },
  ],
  financialAssistanceRevenues: [],
  projectDeveloper: { name: "SolarDev", structureType: "company" },
  futureOperator: { name: "SolarDev", structureType: "company" },
  futureSiteOwner: { name: "SolarDev", structureType: "company" },
  baseSoilsDistributionForTransformation: {},
  nonSuitableSoilsToTransform: [],
  futureSoilsSelection: [],
  willSiteBePurchased: false,
} as const satisfies ReconversionProjectCreationData;

export const projectWithExhaustiveData = {
  ...projectWithMinimalData,
  description: "Description of reconversion project",
  projectDeveloper: {
    name: "developer company name",
    structureType: "company",
  },
  futureOperator: {
    name: "Future operating company name",
    structureType: "company",
  },
  futureSiteOwner: {
    name: "Future site owner company name",
    structureType: "company",
  },
  reinstatementContractOwner: {
    name: "Reinstatement company",
    structureType: "company",
  },
  reinstatementExpenses: [{ amount: 34500, purpose: "demolition" }],
  sitePurchaseSellingPrice: 150000,
  sitePurchasePropertyTransferDuties: 12000,
  financialAssistanceRevenues: [
    { source: "local_or_regional_authority_participation", amount: 10000 },
    { source: "public_subsidies", amount: 4000 },
    { source: "other", amount: 999.99 },
  ],
  reinstatementSchedule: {
    startDate: "2025-02-01T00:00:00.000Z",
    endDate: "2028-06-30T00:00:00.000Z",
  },
  photovoltaicInstallationSchedule: {
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
  },
  firstYearOfOperation: 2029,
  projectPhase: "design",
  decontaminatedSurfaceArea: 1000,
  decontaminationPlan: "partial",
} as const satisfies Required<ReconversionProjectCreationData>;
