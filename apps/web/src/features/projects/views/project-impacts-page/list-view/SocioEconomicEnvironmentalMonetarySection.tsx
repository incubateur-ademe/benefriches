import { getActorLabel } from "../impacts/socio-economic/socioEconomicImpacts";
import { formatMonetaryImpact } from "./formatImpactValue";
import ImpactDetailLabel from "./ImpactDetailLabel";
import ImpactDetailRow from "./ImpactItemDetailRow";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactLabel from "./ImpactLabel";
import ImpactValue from "./ImpactValue";

import {
  AvoidedCO2EqWithEnRImpact,
  EcosystemServicesImpact,
  ReconversionProjectImpacts,
} from "@/features/projects/domain/impacts.types";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
};

const getLabelForEcosystemServicesImpact = (
  label: EcosystemServicesImpact["details"][number]["impact"],
) => {
  switch (label) {
    case "forest_related_product":
      return "🪵 Produits issus de la forêt";
    case "invasive_species_regulation":
      return "🦔 Régulation des espèces invasives";
    case "nature_related_wellness_and_leisure":
      return "🚵‍♂️ Bien-être et loisirs liés à la nature";
    case "nitrogen_cycle":
      return "🍄 Cycle de l’azote";
    case "pollination":
      return "🐝 Pollinisation";
    case "soil_erosion":
      return "🌾 Régulation de l’érosion des sols";
    case "water_cycle":
      return "💧 Cycle de l’eau";
    case "carbon_storage":
      return "🍂️ Carbone stocké dans les sols";
  }
};

const SocioEconomicEnvironmentalMonetaryImpactsSection = ({ socioEconomicImpacts }: Props) => {
  const ecosystemServicesImpact = socioEconomicImpacts.find(
    (impact): impact is EcosystemServicesImpact => impact.impact === "ecosystem_services",
  );

  const avoidedCO2WithEnrImpact = socioEconomicImpacts.find(
    (impact): impact is AvoidedCO2EqWithEnRImpact => impact.impact === "avoided_co2_eq_with_enr",
  );

  return (
    <section className="fr-mb-5w">
      <h4>Impacts environnementaux monétarisés</h4>
      {avoidedCO2WithEnrImpact && (
        <>
          <ImpactItemGroup>
            <ImpactLabel>☁️ Emissions de CO2-eq évitées</ImpactLabel>
            <ImpactDetailRow key={avoidedCO2WithEnrImpact.actor + avoidedCO2WithEnrImpact.amount}>
              <ImpactDetailLabel>{getActorLabel(avoidedCO2WithEnrImpact.actor)}</ImpactDetailLabel>
              <ImpactValue isTotal>
                {formatMonetaryImpact(avoidedCO2WithEnrImpact.amount)}
              </ImpactValue>
            </ImpactDetailRow>
          </ImpactItemGroup>
          <ImpactDetailRow key={avoidedCO2WithEnrImpact.impact}>
            <ImpactDetailLabel>
              ⚡️️ Grâce à la production d’énergies renouvelables
            </ImpactDetailLabel>
            <ImpactValue>{formatMonetaryImpact(avoidedCO2WithEnrImpact.amount)}</ImpactValue>
          </ImpactDetailRow>
        </>
      )}

      {ecosystemServicesImpact && (
        <>
          <ImpactItemGroup>
            <ImpactLabel>🌻 Services écosystémiques</ImpactLabel>
            <ImpactDetailRow key={ecosystemServicesImpact.actor + ecosystemServicesImpact.amount}>
              <ImpactDetailLabel>{getActorLabel(ecosystemServicesImpact.actor)}</ImpactDetailLabel>
              <ImpactValue isTotal>
                {formatMonetaryImpact(ecosystemServicesImpact.amount)}
              </ImpactValue>
            </ImpactDetailRow>
          </ImpactItemGroup>
          {ecosystemServicesImpact.details.map(({ amount, impact }) => (
            <ImpactDetailRow key={impact}>
              <ImpactDetailLabel>{getLabelForEcosystemServicesImpact(impact)}</ImpactDetailLabel>
              <ImpactValue>{formatMonetaryImpact(amount)}</ImpactValue>
            </ImpactDetailRow>
          ))}
        </>
      )}
    </section>
  );
};

export default SocioEconomicEnvironmentalMonetaryImpactsSection;
