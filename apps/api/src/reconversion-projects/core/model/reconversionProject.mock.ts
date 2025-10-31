import {
  ReconversionProjectSoilsDistribution,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpensePurpose,
} from "shared";

import { ReconversionProjectSavePropsDto, ReconversionProjectSaveDto } from "./reconversionProject";
import { UrbanProjectFeatures } from "./urbanProjects";

const baseReconversionProjectProps = {
  id: "64789135-afad-46ea-97a2-f14ba460d485",
  createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
  relatedSiteId: "f590f643-cd9a-4187-8973-f90e9f1998c8",
  name: "Centrale photovoltaique",
  developmentPlan: {
    type: "PHOTOVOLTAIC_POWER_PLANT",
    costs: [{ amount: 130000, purpose: "installation_works" }],
    developer: {
      structureType: "company",
      name: "Terre cuite d’occitanie",
    },
    features: {
      surfaceArea: 1200,
      contractDuration: 25,
      electricalPowerKWc: 10000,
      expectedAnnualProduction: 12000,
    },
  },

  soilsDistribution: [
    {
      soilType: "BUILDINGS",
      surfaceArea: 3000,
    },
    {
      soilType: "ARTIFICIAL_TREE_FILLED",
      surfaceArea: 5000,
    },
    {
      soilType: "FOREST_MIXED",
      surfaceArea: 60000,
    },
    {
      soilType: "MINERAL_SOIL",
      surfaceArea: 5000,
    },
    {
      soilType: "IMPERMEABLE_SOILS",
      surfaceArea: 1300,
    },
  ],
  yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }],
  yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
  projectPhase: "planning",
} as const satisfies ReconversionProjectSavePropsDto;

export const buildMinimalReconversionProjectProps = (
  propsOverride?: Partial<ReconversionProjectSavePropsDto>,
): ReconversionProjectSavePropsDto => {
  return {
    ...baseReconversionProjectProps,
    ...propsOverride,
  };
};

export const buildExhaustiveReconversionProjectProps = (): ReconversionProjectSavePropsDto => {
  return {
    ...baseReconversionProjectProps,
    developmentPlan: {
      type: "PHOTOVOLTAIC_POWER_PLANT",
      costs: [
        { amount: 130000, purpose: "installation_works" },
        { amount: 59999, purpose: "technical_studies" },
      ],
      developer: {
        name: "developer company name",
        structureType: "company",
      },
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
    description: "Description of reconversion project",
    futureOperator: {
      name: "Future operating company name",
      structureType: "company",
    },
    futureSiteOwner: {
      name: "Future site owner company name",
      structureType: "company",
    },
    // reinstatement
    reinstatementContractOwner: {
      name: "Reinstatement company",
      structureType: "company",
    },
    reinstatementCosts: [
      { amount: 120000, purpose: "waste_collection" },
      { amount: 33333, purpose: "deimpermeabilization" },
      { amount: 44444, purpose: "sustainable_soils_reinstatement" },
      { amount: 1, purpose: "other_reinstatement_costs" },
    ],
    sitePurchaseSellingPrice: 150000,
    sitePurchasePropertyTransferDuties: 12000,
    financialAssistanceRevenues: [
      { amount: 14000, source: "public_subsidies" },
      { amount: 999.99, source: "other" },
    ],
    reinstatementSchedule: {
      startDate: new Date("2025-02-01"),
      endDate: new Date("2028-06-30"),
    },
    operationsFirstYear: 2029,
    projectPhase: "design",
    decontaminatedSoilSurface: 3000,
  };
};

export const buildReconversionProject = (
  props?: Partial<ReconversionProjectSaveDto>,
): ReconversionProjectSaveDto => {
  return {
    ...buildMinimalReconversionProjectProps(),
    createdAt: new Date(),
    creationMode: "custom",
    ...props,
  };
};

export const buildUrbanProjectReconversionProjectProps = (): ReconversionProjectSavePropsDto => {
  return {
    ...baseReconversionProjectProps,
    developmentPlan: {
      type: "URBAN_PROJECT",
      costs: [
        { amount: 130000, purpose: "development_works" },
        { amount: 59999, purpose: "technical_studies" },
      ],
      developer: {
        name: "developer company name",
        structureType: "company",
      },
      features: {
        spacesDistribution: {
          BUILDINGS_FOOTPRINT: 1500,
          PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS: 1000,
          PUBLIC_GREEN_SPACES: 5000,
        },
        buildingsFloorAreaDistribution: {
          RESIDENTIAL: 250,
          LOCAL_STORE: 250,
          ARTISANAL_OR_INDUSTRIAL_OR_SHIPPING_PREMISES: 250,
          MULTI_STORY_PARKING: 250,
        },
      },
      installationSchedule: {
        startDate: new Date("2028-07-01"),
        endDate: new Date("2029-03-01"),
      },
    },
    description: "Description of reconversion project",
    // reinstatement
    reinstatementContractOwner: {
      name: "Reinstatement company",
      structureType: "company",
    },
    reinstatementCosts: [
      { amount: 120000, purpose: "waste_collection" },
      { amount: 33333, purpose: "deimpermeabilization" },
      { amount: 44444, purpose: "sustainable_soils_reinstatement" },
      { amount: 1, purpose: "other_reinstatement_costs" },
    ],
    sitePurchaseSellingPrice: 150000,
    sitePurchasePropertyTransferDuties: 12000,
    siteResaleExpectedPropertyTransferDuties: 20000,
    siteResaleExpectedSellingPrice: 2000000,
    buildingsResaleExpectedSellingPrice: 149000,
    buildingsResaleExpectedPropertyTransferDuties: 9999,
    financialAssistanceRevenues: [
      { amount: 14000, source: "public_subsidies" },
      { amount: 999.99, source: "other" },
    ],
    reinstatementSchedule: {
      startDate: new Date("2025-02-01"),
      endDate: new Date("2028-06-30"),
    },
    operationsFirstYear: 2029,
    projectPhase: "design",
    decontaminatedSoilSurface: 3000,
  };
};

export class UrbanProjectBuilder {
  private readonly props: ReconversionProjectSaveDto;

  constructor() {
    this.props = {
      ...buildUrbanProjectReconversionProjectProps(),
      createdAt: new Date(),
      creationMode: "custom",
    };
  }

  withId(id: string): this {
    this.props.id = id;
    return this;
  }

  withCreatedBy(createdBy: string): this {
    this.props.createdBy = createdBy;
    return this;
  }

  withRelatedSiteId(relatedSiteId: string): this {
    this.props.relatedSiteId = relatedSiteId;
    return this;
  }

  withName(name: string): this {
    this.props.name = name;
    return this;
  }

  withSoilsDistribution(soilsDistribution: ReconversionProjectSoilsDistribution): this {
    this.props.soilsDistribution = soilsDistribution;
    return this;
  }

  withDevelopmentPlan(features: UrbanProjectFeatures): this {
    this.props.developmentPlan.features = features;
    return this;
  }

  withYearlyExpenses(expenses: RecurringExpense[]): this {
    this.props.yearlyProjectedCosts = expenses;
    return this;
  }

  withYearlyRevenues(revenues: RecurringRevenue[]): this {
    this.props.yearlyProjectedRevenues = revenues;
    return this;
  }

  // todo: use shared type for structureType
  withFutureOperator(name: string, structureType: string): this {
    this.props.futureOperator = { name, structureType };
    return this;
  }

  // todo: use shared type for structureType
  withDeveloper(name: string, structureType: string): this {
    this.props.developmentPlan.developer = { name, structureType };
    return this;
  }

  // todo: use shared type for structureType
  withFutureSiteOwner(name: string, structureType: string): this {
    this.props.futureSiteOwner = { name, structureType };
    return this;
  }

  withReinstatement({
    contractOwner,
    costs,
    schedule,
  }: {
    contractOwner: { name: string; structureType: string };
    costs: { amount: number; purpose: ReinstatementExpensePurpose }[];
    schedule: { startDate: Date; endDate: Date };
  }): this {
    this.props.reinstatementContractOwner = contractOwner;
    this.props.reinstatementCosts = costs;
    this.props.reinstatementSchedule = schedule;
    return this;
  }

  build(): ReconversionProjectSaveDto {
    return this.props;
  }
}
