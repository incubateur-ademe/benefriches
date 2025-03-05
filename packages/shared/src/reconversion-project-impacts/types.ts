import {
  FinancialAssistanceRevenue,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
} from "../reconversion-projects";
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

type EnvironmentalImpacts = {
  nonContaminatedSurfaceArea?: Impact;
  permeableSurfaceArea: Impact & {
    mineralSoil: Impact;
    greenSoil: Impact;
  };
  soilsCo2eqStorage?: Impact;
} & EnvironmentalCo2RelatedImpacts;

export type EnvironmentalCo2RelatedImpacts = {
  avoidedAirConditioningCo2EqEmissions?: number;
  avoidedCarTrafficCo2EqEmissions?: number;
  avoidedCO2TonsWithEnergyProduction?: number;
};

export type SocialImpacts = {
  fullTimeJobs?: Impact & {
    operations: Impact;
    conversion: Impact;
  };
  accidents?: Impact & {
    severeInjuries: Impact;
    minorInjuries: Impact;
    deaths: Impact;
  };
  avoidedVehiculeKilometers?: number;
  travelTimeSaved?: number;
  avoidedTrafficAccidents?: {
    total: number;
    minorInjuries: number;
    severeInjuries: number;
    deaths: number;
  };
  householdsPoweredByRenewableEnergy?: Impact;
};

export type ReconversionProjectImpacts = {
  economicBalance: EconomicBalanceImpactResult;
  socioeconomic: {
    impacts: SocioEconomicImpact[];
    total: number;
  };
  social: SocialImpacts;
  environmental: EnvironmentalImpacts;
};
