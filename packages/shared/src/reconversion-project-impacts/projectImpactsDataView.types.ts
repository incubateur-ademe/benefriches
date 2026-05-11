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

type SocioEconomicMonetaryImpactName =
  | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
  | "avoidedFricheMaintenanceAndSecuringCostsForTenant"
  | "avoidedAirConditioningExpenses"
  | "previousSiteOperationBenefitLoss"
  | "propertyTransferDutiesIncome"
  | "localPropertyValueIncrease"
  | "localTransferDutiesIncrease"
  | "avoidedCo2eqWithEnergyProduction"
  | "avoidedAirConditioningCo2eqEmissions"
  | "storedCo2Eq"
  | "natureRelatedWelnessAndLeisure"
  | "forestRelatedProduct"
  | "pollination"
  | "invasiveSpeciesRegulation"
  | "waterCycle"
  | "nitrogenCycle"
  | "soilErosion"
  | "waterRegulation"
  | "projectNewHousesTaxesIncome"
  | "projectNewCompanyTaxationIncome"
  | "projectPhotovoltaicTaxesIncome"
  | "avoidedPropertyDamageExpenses"
  | "avoidedCarRelatedExpenses"
  | "travelTimeSavedPerTravelerExpenses"
  | "avoidedTrafficCo2EqEmissions"
  | "avoidedAirPollutionHealthExpenses"
  | "avoidedAccidentsMinorInjuriesExpenses"
  | "avoidedAccidentsSevereInjuriesExpenses"
  | "avoidedAccidentsDeathsExpenses"
  | "projectedRentalIncome"
  | "projectedRentalIncomeIncrease"
  | "oldRentalIncomeLoss"
  | "fricheRoadsAndUtilitiesExpenses";

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
  name:
    | "avoidedFricheMaintenanceAndSecuringCostsForOwner"
    | "avoidedFricheMaintenanceAndSecuringCostsForTenant";
};
export type IndirectEconomicImpact =
  | {
      total: number;
      detailsByYear: number[];
      cumulativeByYear: number[];
      name: SocioEconomicMonetaryImpactName;
    }
  | AvoidedFricheCostsIndirectEconomicImpacts;

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

export type ReconversionProjectImpactsBreakEvenLevel = {
  breakEvenYear?: string;
  projectionYears: string[];
  cumulativeBalanceByYear: number[];
  economicBalance: {
    total: number;
    details: (ProjectDevelopmentEconomicBalanceItem | ProjectOperatingEconomicBalanceItem)[];
  };
  indirectEconomicImpacts: {
    total: number;
    details: (IndirectEconomicImpact | ProjectOperatingEconomicBalanceItem)[];
  };
  stakeholders: {
    current: { operator?: Stakeholder; tenant?: Stakeholder; owner: Stakeholder };
    future: { owner?: Stakeholder; operator?: Stakeholder };
    project: { developer: Stakeholder; reinstatementContractOwner: Stakeholder };
  };
};
