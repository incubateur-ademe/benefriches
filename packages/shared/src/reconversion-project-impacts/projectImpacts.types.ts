import { LOCAL_AUTHORITIES } from "../local-authority";
import {
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
import { BuildingsConstructionExpense } from "../reconversion-projects/urban-project/buildingsConstructionExpenses";
import { SiteStakeholderStructureType } from "../site";
import { SoilType } from "../soils";
import { DevelopmentPlanInstallationExpenses } from "./format-impacts/types";

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

// --- IMPACTS

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

export type SiteReconversionIndirectEconomicImpactName =
  | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
  | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
  | "previousSiteOperationBenefitLoss"
  | "oldRentalIncomeLoss";

// Situation --> impacts du projet sur le site
type AggregatedReconversionProjectOnSiteImpactName =
  | SoilsRelatedIndirectEconomicImpactName
  | ProjectIndirectEconomicImpactName
  | SiteReconversionIndirectEconomicImpactName;

export type AvoidedFricheCostsIndirectEconomicImpactItemView = {
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
export type AggregatedReconversionProjectOnSiteImpactItemView =
  | ProjectIndirectImpactItemView<AggregatedReconversionProjectOnSiteImpactName>
  | AvoidedFricheCostsIndirectEconomicImpactItemView;

// Situation --> comparaison coût de l'inaction, impacts seuls du projet
type ReconversionProjectOnSiteImpactName =
  | SoilsRelatedIndirectEconomicImpactName
  | ProjectIndirectEconomicImpactName;

export type ReconversionProjectOnSiteIndirectEconomicImpactItemView =
  ProjectIndirectImpactItemView<ReconversionProjectOnSiteImpactName>;

// Situation --> comparaison extension urbaine
type UrbanSprawlComparisonIndirectEconomicImpactName =
  | SoilsRelatedIndirectEconomicImpactName
  | ProjectIndirectEconomicImpactName
  | "avoidedRoadsAndUtilitiesMaintenanceExpenses"
  | "avoidedRoadsAndUtilitiesConstructionExpenses";

export type UrbanSprawlComparisonIndirectEconomicImpactItemView =
  ProjectIndirectImpactItemView<UrbanSprawlComparisonIndirectEconomicImpactName>;

// IMPACTS DATA VIEWS

export type ProjectIndirectImpactItemView<
  T extends
    | ReconversionProjectOnSiteImpactName
    | UrbanSprawlComparisonIndirectEconomicImpactName
    | AggregatedReconversionProjectOnSiteImpactName =
    | ReconversionProjectOnSiteImpactName
    | UrbanSprawlComparisonIndirectEconomicImpactName
    | AggregatedReconversionProjectOnSiteImpactName,
> =
  | {
      total: number;
      detailsByYear: number[];
      cumulativeByYear: number[];
      name: T;
      details?: undefined;
    }
  | AvoidedFricheCostsIndirectEconomicImpactItemView;

export type IndirectEconomicImpactName =
  | AggregatedReconversionProjectOnSiteImpactName
  | UrbanSprawlComparisonIndirectEconomicImpactName
  | ReconversionProjectOnSiteImpactName;

export type ProjectEconomicBalance = {
  total: number;
  details: (ProjectDevelopmentEconomicBalanceItem | ProjectOperatingEconomicBalanceItem)[];
};

export type IndirectEconomicImpactDataView<
  T extends
    | ReconversionProjectOnSiteIndirectEconomicImpactItemView
    | AggregatedReconversionProjectOnSiteImpactItemView
    | UrbanSprawlComparisonIndirectEconomicImpactItemView =
    | ReconversionProjectOnSiteIndirectEconomicImpactItemView
    | AggregatedReconversionProjectOnSiteImpactItemView
    | UrbanSprawlComparisonIndirectEconomicImpactItemView,
> = {
  total: number;
  details: (T | ProjectOperatingEconomicBalanceItem)[];
};

export type AggregatedReconversionIndirectEconomicImpactsDataView =
  IndirectEconomicImpactDataView<AggregatedReconversionProjectOnSiteImpactItemView>;

export type ReconversionProjectOnSiteIndirectEconomicImpactsDataView =
  IndirectEconomicImpactDataView<ReconversionProjectOnSiteIndirectEconomicImpactItemView>;

export type UrbanSprawlComparisonProjectImpactsDataView =
  IndirectEconomicImpactDataView<UrbanSprawlComparisonIndirectEconomicImpactItemView>;

/// --- Impacts metrics
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
