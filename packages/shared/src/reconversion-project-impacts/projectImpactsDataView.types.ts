import { LOCAL_AUTHORITIES } from "../local-authority";
import {
  BuildingsUseDistribution,
  FinancialAssistanceRevenue,
  ReconversionProjectSoilsDistribution,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
import { BuildingsConstructionExpense } from "../reconversion-projects/urban-project/buildingsConstructionExpenses";
import { SiteStakeholderStructureType } from "../site";
import { SoilType } from "../soils";
import { DevelopmentPlanInstallationExpenses } from "./types";

export type DevelopmentPlanFeatures =
  | {
      type: "PHOTOVOLTAIC_POWER_PLANT";
      features: {
        electricalPowerKWc: number;
        surfaceArea: number;
        expectedAnnualProduction: number;
        contractDuration: number;
      };
    }
  | {
      type: "URBAN_PROJECT";
      features: {
        buildingsFloorAreaDistribution: BuildingsUseDistribution;
      };
    };

export type ReconversionProjectImpactsDataView<TSchedule> = {
  id: string;
  name: string;
  relatedSiteId: string;
  involvesReinstatement: boolean;
  soilsDistribution: ReconversionProjectSoilsDistribution;
  isExpressProject: boolean;
  conversionSchedule?: TSchedule;
  reinstatementSchedule?: TSchedule;
  futureOperatorStructureType?: string;
  futureOperatorName?: string;
  futureSiteOwnerName?: string;
  futureSiteOwnerStructureType?: string;
  reinstatementContractOwnerName?: string;
  reinstatementContractOwnerStructureType?: string;
  sitePurchaseTotalAmount?: number;
  sitePurchasePropertyTransferDutiesAmount?: number;
  reinstatementExpenses: ReinstatementExpense[];
  buildingsConstructionAndRehabilitationExpenses?: BuildingsConstructionExpense[];
  financialAssistanceRevenues: FinancialAssistanceRevenue[];
  yearlyProjectedExpenses: RecurringExpense[];
  yearlyProjectedRevenues: RecurringRevenue[];
  developmentPlan: {
    installationCosts: DevelopmentPlanInstallationExpenses[];
    installationSchedule?: TSchedule;
    developerName?: string;
    developerStructureType: string;
  } & DevelopmentPlanFeatures;
  operationsFirstYear?: number;
  siteResaleSellingPrice?: number;
  buildingsResaleSellingPrice?: number;
  siteResaleExpectedPropertyTransferDutiesAmount?: number;
  buildingsResaleExpectedPropertyTransferDutiesAmount?: number;
  decontaminatedSoilSurface?: number;
};

// IMPACTS

type SoilsRelatedIndirectEconomicImpactName =
  | "storedCo2Eq"
  | "newStoredCo2Eq"
  | "natureRelatedWelnessAndLeisure"
  | "forestRelatedProduct"
  | "pollination"
  | "invasiveSpeciesRegulation"
  | "waterCycle"
  | "nitrogenCycle"
  | "soilErosion"
  | "waterRegulation";

type ProjectIndirectEconomicImpactName =
  | "avoidedAirConditioningExpenses"
  | "avoidedCo2eqWithEnergyProduction"
  | "avoidedAirConditioningCo2eqEmissions"
  | "avoidedPropertyDamageExpenses"
  | "avoidedCarRelatedExpenses"
  | "avoidedTrafficCo2EqEmissions"
  | "avoidedAirPollutionHealthExpenses"
  | "avoidedAccidentsMinorInjuriesExpenses"
  | "avoidedAccidentsSevereInjuriesExpenses"
  | "avoidedAccidentsDeathsExpenses"
  | "travelTimeSavedPerTravelerExpenses"
  | "propertyTransferDutiesIncome"
  | "localPropertyValueIncrease"
  | "localTransferDutiesIncrease"
  | "projectNewHousesTaxesIncome"
  | "projectNewCompanyTaxationIncome"
  | "projectPhotovoltaicTaxesIncome"
  | "projectedRentalIncome"
  | "fricheRoadsAndUtilitiesExpenses";

type SiteReconversionIndirectEconomicImpactName =
  | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
  | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
  | "previousSiteOperationBenefitLoss"
  | "oldRentalIncomeLoss";

// Situation --> impacts du projet sur le site
type AggregatedReconversionProjectOnSiteImpactName =
  | SoilsRelatedIndirectEconomicImpactName
  | ProjectIndirectEconomicImpactName
  | UrbanSprawlComparisonIndirectEconomicImpactName
  | SiteReconversionIndirectEconomicImpactName;

export type AvoidedFricheCostsIndirectEconomicImpacts = {
  total: number;
  detailsByYear: number[];
  cumulativeByYear: number[];
  details:
    | "security"
    | "illegalDumpingCost"
    | "accidentsCost"
    | "otherSecuringCosts"
    | "maintenance";
  name: Extract<
    SiteReconversionIndirectEconomicImpactName,
    | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
    | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
  >;
};
export type AggregatedReconversionIndirectEconomicImpact =
  | ImpactDataView
  | AvoidedFricheCostsIndirectEconomicImpacts;

// Situation --> comparaison coût de l'inaction, impacts seuls du projet
type ReconversionProjectOnSiteImpactName =
  | SoilsRelatedIndirectEconomicImpactName
  | ProjectIndirectEconomicImpactName;

export type ImpactDataView<
  T extends
    | ReconversionProjectOnSiteImpactName
    | UrbanSprawlComparisonIndirectEconomicImpactName
    | AggregatedReconversionProjectOnSiteImpactName =
    | ReconversionProjectOnSiteImpactName
    | UrbanSprawlComparisonIndirectEconomicImpactName
    | AggregatedReconversionProjectOnSiteImpactName,
> = {
  total: number;
  detailsByYear: number[];
  cumulativeByYear: number[];
  name: T;
};

export type ReconversionProjectOnSiteIndirectEconomicImpact =
  ImpactDataView<ReconversionProjectOnSiteImpactName>;

// Situation --> comparaison extension urbaine
type UrbanSprawlComparisonIndirectEconomicImpactName =
  | SoilsRelatedIndirectEconomicImpactName
  | ProjectIndirectEconomicImpactName
  | "avoidedRoadsAndUtilitiesMaintenanceExpenses"
  | "avoidedRoadsAndUtilitiesConstructionExpenses";

export type UrbanSprawlComparisonIndirectEconomicImpact =
  ImpactDataView<UrbanSprawlComparisonIndirectEconomicImpactName>;

export type IndirectEconomicImpactName =
  | AggregatedReconversionProjectOnSiteImpactName
  | UrbanSprawlComparisonIndirectEconomicImpactName
  | ReconversionProjectOnSiteImpactName;

// ECONOMIC BALANCES
export type ProjectOperatingEconomicBalanceItem = {
  total: number;
  detailsByYear: number[];
  cumulativeByYear: number[];
  details: RecurringExpense["purpose"] | RecurringRevenue["source"];
  name: "projectOperatingEconomicBalance";
};

export type ProjectDevelopmentEconomicBalanceItem =
  | {
      total: number;
      details: DevelopmentPlanInstallationExpenses["purpose"];
      name: "projectInstallation";
    }
  | {
      total: number;
      details: BuildingsConstructionExpense["purpose"];
      name: "projectBuildingsInstallation";
    }
  | {
      total: number;
      details: ReinstatementExpense["purpose"];
      name: "siteReinstatement";
    }
  | {
      total: number;
      details: FinancialAssistanceRevenue["source"];
      name: "financialAssistanceRevenues";
    }
  | {
      total: number;
      name: "sitePurchase" | "siteResaleRevenue" | "buildingsResaleRevenue";
    };

// STAKEHOLDERS
type UserStructureType = "local_authority" | "company";
type StakeholderStructure = SiteStakeholderStructureType | UserStructureType | "unknown";
type Stakeholder = {
  structureType: StakeholderStructure;
  structureName?: string;
};

export const isStakeholderLocalAuthority = (stakeholder: Stakeholder) =>
  LOCAL_AUTHORITIES.some((s) => stakeholder.structureType === s);

export const isSameStakeholders = (stakeholder_A: Stakeholder, stakeholder_B: Stakeholder) =>
  stakeholder_A.structureType === stakeholder_B.structureType &&
  stakeholder_A.structureName &&
  stakeholder_B.structureName &&
  stakeholder_A.structureName === stakeholder_B.structureName;

export type ReconversionStakeholders = {
  current: { operator?: Stakeholder; tenant?: Stakeholder; owner: Stakeholder };
  future: { owner?: Stakeholder; operator?: Stakeholder };
  project: { developer: Stakeholder; reinstatementContractOwner: Stakeholder };
};

// IMPACTS DATA VIEWS

export type ProjectEconomicBalance = {
  total: number;
  details: (ProjectDevelopmentEconomicBalanceItem | ProjectOperatingEconomicBalanceItem)[];
};

export type IndirectEconomicImpacts<
  T extends
    | ReconversionProjectOnSiteIndirectEconomicImpact
    | AggregatedReconversionIndirectEconomicImpact
    | UrbanSprawlComparisonIndirectEconomicImpact =
    | ReconversionProjectOnSiteIndirectEconomicImpact
    | AggregatedReconversionIndirectEconomicImpact
    | UrbanSprawlComparisonIndirectEconomicImpact,
> = {
  total: number;
  details: (T | ProjectOperatingEconomicBalanceItem)[];
};

export type AggregatedReconversionIndirectEconomicImpacts = IndirectEconomicImpacts;

export type ReconversionProjectOnSiteIndirectEconomicImpacts =
  IndirectEconomicImpacts<ReconversionProjectOnSiteIndirectEconomicImpact>;

export type UrbanSprawlComparisonProjectImpacts =
  IndirectEconomicImpacts<UrbanSprawlComparisonIndirectEconomicImpact>;

export type ProjectOnSiteImpactMetric =
  | {
      total: number;
      detailsByYear?: number[];
      name:
        | "avoidedAirConditioningCo2eqEmissions"
        | "avoidedVehiculeKilometers"
        | "timeTravelSavedInHours"
        | "avoidedTrafficCo2EqEmissions"
        | "avoidedTrafficAccidentsDeaths"
        | "avoidedTrafficAccidentsSevereInjuries"
        | "avoidedTrafficAccidentsMinorInjuries"
        | "avoidedCO2TonsWithEnergyProduction"
        | "householdsPoweredByRenewableEnergy"
        | "newStoredCo2Eq"
        | "newPermeableMineralSurface"
        | "newPermeableGreenSurface"
        | "decontaminatedSurface"
        | "operationsFullTimeJobs"
        | "conversionFullTimeJobs"
        | "reinstatementFullTimeJobs";
    }
  | {
      total: number;
      soilType: SoilType;
      name: "soilsDistribution";
    };

export type AggregatedProjectImpactMetric = {
  total: number;
  detailsByYear?: number[];
  name:
    | ProjectOnSiteImpactMetric["name"]
    | "oldOperationsFullTimeJobsLoss"
    | "avoidedFricheAccidentsDeaths"
    | "avoidedFricheAccidentsSevereInjuries"
    | "avoidedFricheAccidentsMinorInjuries";
};
