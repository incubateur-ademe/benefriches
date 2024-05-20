import {
  Expense,
  ProjectPhase,
  ProjectPhaseDetails,
  ProjectStakeholder,
  Revenue,
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
  createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
  relatedSiteId: "f590f643-cd9a-4187-8973-f90e9f1998c8",
  name: "Centrale photovoltaique",
  soilsDistribution: {
    BUILDINGS: 3000,
    ARTIFICIAL_TREE_FILLED: 5000,
    FOREST_MIXED: 60000,
    MINERAL_SOIL: 5000,
    IMPERMEABLE_SOILS: 1300,
  },
  yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }] as Expense[],
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }] as Revenue[],
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
  reinstatementCost: 90000,
  realEstateTransactionSellingPrice: 150000,
  realEstateTransactionPropertyTransferDuties: 12000,
  reinstatementFinancialAssistanceAmount: 14999.99,
  reinstatementSchedule: {
    startDate: new Date("2025-02-01"),
    endDate: new Date("2028-06-30"),
  },
  operationsFirstYear: 2029,
  projectPhase: "design" as ProjectPhase,
  projectPhaseDetails: "design_final_draft" as ProjectPhaseDetails,
};