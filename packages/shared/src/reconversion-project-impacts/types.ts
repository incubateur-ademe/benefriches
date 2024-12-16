import {
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
import { SoilType } from "../soils";
import { SocioEconomicImpact } from "./socioEconomic.types";

export type DevelopmentPlanInstallationCost = {
  purpose: "technical_studies" | "installation_works" | "development_works" | "other";
  amount: number;
};

type CostsTotalAndDetails<TExpense> = {
  total: number;
  costs: TExpense[];
};

export type EconomicBalanceImpactResult = {
  total: number;
  bearer?: string;
  costs: {
    total: number;
    operationsCosts?: CostsTotalAndDetails<RecurringExpense>;
    developmentPlanInstallation?: CostsTotalAndDetails<DevelopmentPlanInstallationCost>;
    siteReinstatement?: CostsTotalAndDetails<ReinstatementExpense>;
    sitePurchase?: number;
  };
  revenues: {
    total: number;
    siteResale?: number;
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

export type AvoidedCO2WithEnergyProductionImpact = {
  current: 0;
  forecast: number;
};

export type HouseholdsPoweredByRenewableEnergyImpact = {
  current: number;
  forecast: number;
};

export type NonContaminatedSurfaceAreaImpact = {
  current: number;
  forecast: number;
  difference: number;
};

export type PermeableSurfaceAreaImpactResult = {
  base: number;
  forecast: number;
  difference: number;
  mineralSoil: {
    base: number;
    forecast: number;
    difference: number;
  };
  greenSoil: {
    base: number;
    forecast: number;
    difference: number;
  };
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
  nonContaminatedSurfaceArea?: NonContaminatedSurfaceAreaImpact;
  permeableSurfaceArea: PermeableSurfaceAreaImpactResult;
  soilsCarbonStorage: SoilsCarbonStorageImpactResult;
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

type SocioEconomicImpacts = {
  socioeconomic: {
    impacts: SocioEconomicImpact[];
    total: number;
  };
};

export type ReconversionProjectImpacts = {
  economicBalance: EconomicBalanceImpactResult;
} & SocioEconomicImpacts &
  SocialImpacts &
  EnvironmentalSoilsRelatedImpacts &
  EnvironmentalCo2RelatedImpacts;