import { ReinstatementExpensePurpose } from "shared";

import { EconomicBalanceMainName } from "@/features/projects/domain/projectImpactsEconomicBalance";
import { CO2BenefitDetails } from "@/features/projects/domain/projectImpactsEnvironmental";
import { SocioEconomicMainImpactName } from "@/features/projects/domain/projectImpactsSocioEconomic";

export const getSocioEconomicImpactColor = (impactName: SocioEconomicMainImpactName) => {
  switch (impactName) {
    case "avoided_friche_costs":
      return "#E73518";
    case "property_transfer_duties_income":
      return "#A29674";
    case "rental_income":
      return "#F5E900";
    case "roads_and_utilities_maintenance_expenses":
      return "#9E89CC";
    case "local_property_value_increase":
      return "#8DC85D";
    case "local_transfer_duties_increase":
      return "#D2E4AF";
    case "taxes_income":
      return "#1D5DA2";
    case "avoided_car_related_expenses":
      return "#D3C800";
    case "avoided_air_conditioning_expenses":
      return "#AFF6FF";
    case "travel_time_saved":
      return "#FD63BA";
    case "avoided_traffic_accidents":
      return "#FF9700";
    case "avoided_property_damages_expenses":
      return "#F7735A";
    case "avoided_air_pollution":
      return "#7CCFFD";
    case "avoided_co2_eq_emissions":
      return "#CAD3DB";
    case "ecosystem_services":
      return "#7ACE14";
    case "water_regulation":
      return "#038FDD";
  }
};

export const getEconomicBalanceImpactColor = (name: EconomicBalanceMainName): string => {
  switch (name) {
    case "buildings_resale":
    case "site_resale":
    case "site_purchase":
      return "#C649CA";
    case "site_reinstatement":
      return "#DE3317";
    case "financial_assistance":
      return "#66D6FF";
    case "development_plan_installation":
      return "#FF9700";
    case "photovoltaic_development_plan_installation":
      return "#FF9700";
    case "urban_project_development_plan_installation":
      return "#E4D1AF";
    case "operations_costs":
      return "#F5E900";
    case "operations_revenues":
      return "#57B54B";
  }
};

export const getSiteReinstatementDetailsColor = (impactName: ReinstatementExpensePurpose) => {
  switch (impactName) {
    case "asbestos_removal":
      return "#F4C00A";
    case "deimpermeabilization":
      return "#039CF2";
    case "demolition":
      return "#85341B";
    case "other_reinstatement":
      return "#DE3317";
    case "remediation":
      return "#F6DB1F";
    case "sustainable_soils_reinstatement":
      return "#7ACA17";
    case "waste_collection":
      return "#298435";
  }
};

export const getAvoidedCo2eqEmissionsDetailsColor = (impactName: CO2BenefitDetails) => {
  switch (impactName) {
    case "avoided_co2_eq_emissions_with_production":
      return "#F6E900";
    case "avoided_air_conditioning_co2_eq_emissions":
      return "#1F60FB";
    case "avoided_car_traffic_co2_eq_emissions":
      return "#C750CA";
    case "stored_co2_eq":
      return "#FF8910";
  }
};

export const getFullTimeJobsDetailsColor = (
  impactName: "operations_full_time_jobs" | "conversion_full_time_jobs",
) => {
  switch (impactName) {
    case "operations_full_time_jobs":
      return "#C4C5C6";
    case "conversion_full_time_jobs":
      return "#E73518";
  }
};

export const getPermeableSurfaceDetailsColor = (impactName: "mineral_soil" | "green_soil") => {
  switch (impactName) {
    case "green_soil":
      return "#7ACA17";
    case "mineral_soil":
      return "#70706A";
  }
};
