import {
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
import { SoilType } from "../soils";
import { SocioEconomicImpact } from "./socioEconomic.types";

export type DevelopmentPlanInstallationExpenses = {
  purpose: "technical_studies" | "installation_works" | "development_works" | "other";
  amount: number;
};

type ExpensesDetailledTotal<TExpense> = {
  total: number;
  costs: TExpense[];
};

export type EconomicBalanceImpactResult = {
  total: number;
  bearer?: string;
  costs: {
    total: number;
    operationsCosts?: ExpensesDetailledTotal<RecurringExpense>;
    developmentPlanInstallation?: ExpensesDetailledTotal<DevelopmentPlanInstallationExpenses>;
    siteReinstatement?: ExpensesDetailledTotal<ReinstatementExpense>;
    sitePurchase?: number;
  };
  revenues: {
    total: number;
    siteResale?: number;
    buildingsResale?: number;
    operationsRevenues?: {
      bearer?: string;
      total: number;
      revenues: RecurringRevenue[];
    };
    financialAssistance?: {
      total: number;
      revenues: FinancialAssistanceRevenue[];
    };
  };
};

export type Impact = {
  base: number;
  forecast: number;
  difference: number;
};

export type AvoidedCO2WithEnergyProductionImpact = {
  current: 0;
  forecast: number;
};

export type HouseholdsPoweredByRenewableEnergyImpact = {
  current: number;
  forecast: number;
};

export type FullTimeJobsImpactResult = {
  current: number;
  forecast: number;
  operations: {
    current: number;
    forecast: number;
  };
  conversion: {
    current: number;
    forecast: number;
  };
};

export type SoilsCarbonStorageImpactResult =
  | {
      isSuccess: true;
      current: {
        total: number;
        soils: {
          type: SoilType;
          surfaceArea: number;
          carbonStorage: number;
        }[];
      };
      forecast: {
        total: number;
        soils: {
          type: SoilType;
          surfaceArea: number;
          carbonStorage: number;
        }[];
      };
    }
  | { isSuccess: false };

export type AccidentsImpactResult = {
  current: number;
  forecast: 0;
  severeInjuries: {
    current: number;
    forecast: 0;
  };
  minorInjuries: {
    current: number;
    forecast: 0;
  };
  deaths: {
    current: number;
    forecast: 0;
  };
};

export type EnvironmentalSoilsRelatedImpacts = {
  nonContaminatedSurfaceArea?: Impact;
  permeableSurfaceArea: Impact & {
    mineralSoil: Impact;
    greenSoil: Impact;
  };
  soilsCo2eqStorage?: Impact;
};

export type EnvironmentalCo2RelatedImpacts = {
  avoidedAirConditioningCo2EqEmissions?: number;
  avoidedCarTrafficCo2EqEmissions?: number;
  avoidedCO2TonsWithEnergyProduction?: AvoidedCO2WithEnergyProductionImpact;
};

export type SocialImpacts = {
  fullTimeJobs?: FullTimeJobsImpactResult;
  accidents?: AccidentsImpactResult;
  avoidedVehiculeKilometers?: number;
  travelTimeSaved?: number;
  avoidedTrafficAccidents?: {
    total: number;
    minorInjuries: number;
    severeInjuries: number;
    deaths: number;
  };
  householdsPoweredByRenewableEnergy?: HouseholdsPoweredByRenewableEnergyImpact;
};

export type ReconversionProjectImpacts = {
  economicBalance: EconomicBalanceImpactResult;
  socioeconomic: {
    impacts: SocioEconomicImpact[];
    total: number;
  };
  social: SocialImpacts;
  environmental: EnvironmentalSoilsRelatedImpacts & EnvironmentalCo2RelatedImpacts;
};
