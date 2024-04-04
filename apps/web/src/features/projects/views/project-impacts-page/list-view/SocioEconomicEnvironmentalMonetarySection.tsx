import { getActorLabel } from "../impacts/socio-economic/socioEconomicImpacts";
import { ImpactDescriptionModalCategory } from "../modals/ImpactDescriptionModal";
import { formatMonetaryImpact } from "./formatImpactValue";
import ImpactDetailLabel from "./ImpactDetailLabel";
import ImpactDetailRow from "./ImpactItemDetailRow";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactItemRow from "./ImpactItemRow";
import ImpactLabel from "./ImpactLabel";
import ImpactSectionTitle from "./ImpactSectionTitle";
import ImpactValue from "./ImpactValue";

import {
  AvoidedCO2EqWithEnRImpact,
  EcosystemServicesImpact,
  ReconversionProjectImpacts,
  WaterRegulationImpact,
} from "@/features/projects/domain/impacts.types";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
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

const getEcosystemServiceOnClick = (
  impact: EcosystemServicesImpact["details"][number]["impact"],
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
): (() => void) | undefined => {
  switch (impact) {
    case "carbon_storage":
      return () => {
        openImpactDescriptionModal("carbon-storage-monetary-value");
      };
    default:
      return undefined;
  }
};

const SocioEconomicEnvironmentalMonetaryImpactsSection = ({
  socioEconomicImpacts,
  openImpactDescriptionModal,
}: Props) => {
  const ecosystemServicesImpact = socioEconomicImpacts.find(
    (impact): impact is EcosystemServicesImpact => impact.impact === "ecosystem_services",
  );

  const avoidedCO2WithEnrImpact = socioEconomicImpacts.find(
    (impact): impact is AvoidedCO2EqWithEnRImpact => impact.impact === "avoided_co2_eq_with_enr",
  );

  const waterRegulationImpact = socioEconomicImpacts.find(
    (impact): impact is WaterRegulationImpact => impact.impact === "water_regulation",
  );

  const total = socioEconomicImpacts
    .filter(({ impactCategory }) => impactCategory === "environmental_monetary")
    .reduce((total, { amount }) => total + amount, 0);

  return (
    <section className="fr-mb-5w">
      <ImpactItemRow>
        <ImpactSectionTitle>Impacts environnementaux monétarisés</ImpactSectionTitle>
        <ImpactValue isTotal>{formatMonetaryImpact(total)}</ImpactValue>
      </ImpactItemRow>
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

      {waterRegulationImpact && (
        <ImpactItemGroup>
          <ImpactLabel>🚰 Régulation de la qualité de l’eau</ImpactLabel>
          <ImpactDetailRow key={waterRegulationImpact.actor + waterRegulationImpact.amount}>
            <ImpactDetailLabel>{getActorLabel(waterRegulationImpact.actor)}</ImpactDetailLabel>
            <ImpactValue>{formatMonetaryImpact(waterRegulationImpact.amount)}</ImpactValue>
          </ImpactDetailRow>
        </ImpactItemGroup>
      )}

      {ecosystemServicesImpact && (
        <>
          <ImpactItemGroup
            onClick={() => {
              openImpactDescriptionModal("ecosystem-services");
            }}
          >
            <ImpactLabel>🌻 Services écosystémiques</ImpactLabel>
            <ImpactDetailRow key={ecosystemServicesImpact.actor + ecosystemServicesImpact.amount}>
              <ImpactDetailLabel>{getActorLabel(ecosystemServicesImpact.actor)}</ImpactDetailLabel>
              <ImpactValue isTotal>
                {formatMonetaryImpact(ecosystemServicesImpact.amount)}
              </ImpactValue>
            </ImpactDetailRow>
          </ImpactItemGroup>
          {ecosystemServicesImpact.details.map(({ amount, impact }) => (
            <ImpactDetailRow
              key={impact}
              onClick={getEcosystemServiceOnClick(impact, openImpactDescriptionModal)}
            >
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
