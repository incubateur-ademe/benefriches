import {
  FinancialAssistanceRevenue,
  ProjectPhase,
  ProjectPhaseDetails,
  ProjectStakeholder,
  RecurringCost,
  RecurringRevenue,
  ReinstatementCosts,
} from "../domain/project.types";

export const projectSiteData = {
  id: "site-uuid-123",
  name: "Ma friche",
  isFriche: false,
  owner: {
    name: "Mairie de Grenoble",
    structureType: "municipality",
  },
  tenant: {
    name: "SARL Locataire",
    structureType: "company",
  },
  address: {
    lat: 2,
    long: 52,
    city: "Paris",
    id: "",
    cityCode: "75112",
    postCode: "75000",
    value: "",
  },
  surfaceArea: 1200,
  hasContaminatedSoils: false,
  soilsDistribution: {},
};

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
  yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }] as RecurringCost[],
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] as RecurringRevenue[],
  projectPhase: "planning",
} as const;

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
    costs: [{ amount: 34500, purpose: "demolition" }] as ReinstatementCosts["costs"],
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
  firstYearOfOperation: 2029,
  projectPhase: "design" as ProjectPhase,
  projectPhaseDetails: "design_final_draft" as ProjectPhaseDetails,
} as const;
