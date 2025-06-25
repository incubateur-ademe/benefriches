import { SoilType } from "../../soils";

type BaseEconomicImpact = { actor: string; amount: number };

type SiteRentalIncomeImpact = BaseEconomicImpact;

export type SiteFricheCostsImpact = BaseEconomicImpact & {
  details: {
    amount: number;
    impact:
      | "site_statu_quo_security_costs"
      | "site_statu_quo_illegal_dumping_costs"
      | "site_statu_quo_accidents_costs"
      | "site_statu_quo_other_securing_costs"
      | "site_statu_quo_maintenance_costs";
  }[];
};

export type SiteTaxesIncomeImpact = {
  amount: number;
  details: {
    impact:
      | "site_statu_quo_taxes"
      | "site_statu_quo_property_taxes"
      | "site_statu_quo_operation_taxes";
    amount: number;
  }[];
};

type SiteWaterRegulationImpact = number;

type SiteEcosystemServicesImpact = {
  storedCo2Eq?: number;
  natureRelatedWelnessAndLeisure: number;
  forestRelatedProduct: number;
  pollination: number;
  invasiveSpeciesRegulation: number;
  waterCycle: number;
  nitrogenCycle: number;
  soilErosion: number;
};

type SiteSocioEconomicImpact = {
  direct: { fricheCosts?: SiteFricheCostsImpact[]; rentalIncome?: SiteRentalIncomeImpact };
  indirect: { taxesIncomes?: SiteTaxesIncomeImpact };
  environmentalMonetary: {
    waterRegulation?: SiteWaterRegulationImpact;
    ecosystemServices: SiteEcosystemServicesImpact;
  };
};

export type StatuQuoSiteImpacts = {
  socioEconomic: SiteSocioEconomicImpact;
  environmental: {
    contaminatedSurfaceArea?: number;
    permeableSurfaceArea: {
      total: number;
      mineralSoil: number;
      greenSoil: number;
    };
    soilsCo2eqStorage?: number;
    soilsCarbonStorage?: {
      total: number;
    } & Partial<Record<SoilType, number>>;
  };
  social: {
    fullTimeJobs?: number;
    accidents?: {
      total: number;
      severeInjuries: number;
      minorInjuries: number;
      deaths: number;
    };
  };
};
