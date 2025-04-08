import { SocioEconomicMainImpactName } from "@/features/projects/domain/projectImpactsSocioEconomic";

export const getSocioEconomicImpactColor = (impactName: SocioEconomicMainImpactName) => {
  switch (impactName) {
    case "avoided_friche_costs":
      return "#9542F0";
    case "property_transfer_duties_income":
      return "#B342F0";
    case "rental_income":
      return "#9F13EB";
    case "roads_and_utilities_maintenance_expenses":
      return "#7A13EB";
    case "local_property_value_increase":
      return "#A0B4F8";
    case "local_transfer_duties_increase":
      return "#718FF4";
    case "taxes_income":
      return "#4269F0";
    case "avoided_car_related_expenses":
      return "#1243EB";
    case "avoided_air_conditioning_expenses":
      return "#103ACC";
    case "travel_time_saved":
      return "#71D6F4";
    case "avoided_traffic_accidents":
      return "#42C8F0";
    case "avoided_property_damages_expenses":
      return "#0D30AA";
    case "avoided_air_pollution":
      return "#7A13EB";
    case "avoided_co2_eq_emissions":
      return "#14EA81";
    case "ecosystem_services":
      return "#11C56D";
    case "water_regulation":
      return "#98F6C8";
  }
};
