import { ReconversionProjectProps } from "../usecases/createReconversionProject.usecase";
import { ReconversionProject } from "./reconversionProject";

const baseReconversionProjectProps: ReconversionProjectProps = {
  id: "64789135-afad-46ea-97a2-f14ba460d485",
  createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
  relatedSiteId: "f590f643-cd9a-4187-8973-f90e9f1998c8",
  name: "Centrale photovoltaique",
  developmentPlans: [
    {
      type: "PHOTOVOLTAIC_POWER_PLANT",
      cost: 1300,
      features: {
        surfaceArea: 1200,
        contractDuration: 25,
        electricalPowerKWc: 10000,
        expectedAnnualProduction: 12000,
      },
    },
  ],
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
} as const;

export const buildMinimalReconversionProjectProps = (
  propsOverride?: Partial<ReconversionProjectProps>,
): ReconversionProjectProps => {
  return {
    ...baseReconversionProjectProps,
    ...propsOverride,
  };
};

export const buildExhaustiveReconversionProjectProps = (): Required<ReconversionProjectProps> => {
  return {
    ...baseReconversionProjectProps,
    developmentPlans: [
      {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        cost: 1300,
        features: {
          surfaceArea: 1200,
          contractDuration: 25,
          electricalPowerKWc: 10000,
          expectedAnnualProduction: 12000,
        },
        installationSchedule: {
          startDate: new Date("2028-07-01"),
          endDate: new Date("2029-03-01"),
        },
      },
    ],
    description: "Description of reconversion project",
    futureOperator: {
      name: "Future operating company name",
      structureType: "company",
    },
    futureSiteOwner: {
      name: "Future site owner company name",
      structureType: "company",
    },
    conversionFullTimeJobsInvolved: 0.3,
    operationsFullTimeJobsInvolved: 2,
    // reinstatement
    reinstatementFullTimeJobsInvolved: 0.2,
    reinstatementContractOwner: {
      name: "Reinstatement company",
      structureType: "company",
    },
    reinstatementCost: 90000,
    realEstateTransactionSellingPrice: 150000,
    realEstateTransactionPropertyTransferDuties: 12000,
    reinstatementFinancialAssistanceAmount: 14999.99,
    reinstatementSchedule: {
      startDate: new Date("2025-02-01"),
      endDate: new Date("2028-06-30"),
    },
    operationsFirstYear: 2029,
    projectPhase: "design",
    projectPhaseDetails: "design_final_draft",
  };
};

export const buildReconversionProject = (
  props?: Partial<ReconversionProject>,
): ReconversionProject => {
  return {
    ...buildMinimalReconversionProjectProps(),
    createdAt: new Date(),
    ...props,
  };
};
