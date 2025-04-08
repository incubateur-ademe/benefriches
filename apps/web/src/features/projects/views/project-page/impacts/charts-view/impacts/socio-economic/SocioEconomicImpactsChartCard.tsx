import { useContext } from "react";

import {
  SocioEconomicImpactByActor,
  SocioEconomicMainImpactName,
} from "@/features/projects/domain/projectImpactsSocioEconomic";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

import { getSocioEconomicImpactColor } from "../../../getImpactColor";
import { ImpactModalDescriptionContext } from "../../../impact-description-modals/ImpactModalDescriptionContext";
import ImpactColumnChart from "../../ImpactChartCard/ImpactColumnChart";
import ImpactsChartsSection from "../../ImpactsChartsSection";

type Props = {
  socioEconomicImpacts: SocioEconomicImpactByActor;
};

const getSocioEconomicImpactLabel = (name: SocioEconomicMainImpactName) => {
  switch (name) {
    case "rental_income":
      return "Revenu locatif";
    case "avoided_friche_costs":
      return "Dépenses de gestion et sécurisation de la friche évitées";
    case "taxes_income":
      return "Recettes fiscales";
    case "property_transfer_duties_income":
      return "Droits de mutation sur la transaction foncière";
    case "local_property_value_increase":
      return "Valeur patrimoniale des bâtiments alentour";
    case "local_transfer_duties_increase":
      return "Droits de mutation sur les ventes immobilières alentour";
    /// Projet urbain
    case "avoided_property_damages_expenses":
      return "Dépenses d’entretien et réparation évitées";
    case "avoided_car_related_expenses":
      return "Dépenses automobiles évitées";
    case "avoided_air_conditioning_expenses":
      return "Dépenses de climatisation évitées";
    case "roads_and_utilities_maintenance_expenses":
      return "Dépenses d’entretien des VRD";
    // Sociaux monétarisés
    /// Projet urbain
    case "travel_time_saved":
      return "Valeur monétaire du temps passé en moins dans les transports";
    case "avoided_traffic_accidents":
      return "Dépenses de santé évitées grâce à la diminution des accidents de la route";
    // Environementaux monétarisés
    case "avoided_co2_eq_emissions":
      return "Valeur monétaire de la décarbonation ";
    case "avoided_air_pollution":
      return "Dépenses de santé évitées grâce à la réduction de la pollution de l’air";
    case "water_regulation":
      return "Dépenses de traitement de l’eau évitées";
    // Services écosystémiques
    case "ecosystem_services":
      return "Valeur monétaire des services écosystémiques";
  }
};

function SocioEconomicChartCard({ socioEconomicImpacts }: Props) {
  const { openImpactModalDescription } = useContext(ImpactModalDescriptionContext);

  return (
    <ImpactsChartsSection
      onClick={() => {
        openImpactModalDescription({ sectionName: "socio_economic" });
      }}
      title="Impacts socio-économiques"
      subtitle="Par bénéficiaires"
    >
      <ImpactColumnChart
        data={socioEconomicImpacts.map(({ name, impacts }) => ({
          label: getActorLabel(name),
          values: impacts.map(({ value, name }) => ({
            value,
            label: getSocioEconomicImpactLabel(name),
            color: getSocioEconomicImpactColor(name),
          })),
        }))}
      />
    </ImpactsChartsSection>
  );
}

export default SocioEconomicChartCard;
