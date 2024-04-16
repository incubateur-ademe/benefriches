import {
  AvoidedCO2EqWithEnRImpact,
  EcosystemServicesImpact,
  ReconversionProjectImpacts,
  WaterRegulationImpact,
} from "@/features/projects/domain/impacts.types";
import ImpactDetailLabel from "@/features/projects/views/project-impacts-page/list-view/ImpactDetailLabel";
import ImpactDetailRow from "@/features/projects/views/project-impacts-page/list-view/ImpactItemDetailRow";
import ImpactItemGroup from "@/features/projects/views/project-impacts-page/list-view/ImpactItemGroup";
import ImpactItemRow from "@/features/projects/views/project-impacts-page/list-view/ImpactItemRow";
import ImpactLabel from "@/features/projects/views/project-impacts-page/list-view/ImpactLabel";
import ImpactSectionTitle from "@/features/projects/views/project-impacts-page/list-view/ImpactSectionTitle";
import ImpactValue from "@/features/projects/views/project-impacts-page/list-view/ImpactValue";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";
import { getActorLabel } from "@/features/projects/views/shared/socioEconomicLabels";

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
      return "🍄 Cycle de l'azote";
    case "pollination":
      return "🐝 Pollinisation";
    case "soil_erosion":
      return "🌾 Régulation de l'érosion des sols";
    case "water_cycle":
      return "💧 Cycle de l'eau";
    case "carbon_storage":
      return "🍂️ Carbone stocké dans les sols";
  }
};

const getEcosystemServiceOnClick = (
  impact: EcosystemServicesImpact["details"][number]["impact"],
  openImpactDescriptionModal: Props["openImpactDescriptionModal"],
): (() => void) | undefined => {
  switch (impact) {
    case "nature_related_wellness_and_leisure":
      return () => {
        openImpactDescriptionModal("socio-economic-nature-related-wellness-and-leisure");
      };
    case "carbon_storage":
      return () => {
        openImpactDescriptionModal("socio-economic-carbon-storage");
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
        <ImpactValue isTotal value={total} type="monetary" />
      </ImpactItemRow>
      {avoidedCO2WithEnrImpact && (
        <>
          <ImpactItemGroup>
            <ImpactLabel>☁️ Emissions de CO2-eq évitées</ImpactLabel>
            <ImpactDetailRow>
              <ImpactDetailLabel>{getActorLabel(avoidedCO2WithEnrImpact.actor)}</ImpactDetailLabel>
              <ImpactValue isTotal value={avoidedCO2WithEnrImpact.amount} type="monetary" />
            </ImpactDetailRow>
          </ImpactItemGroup>
          <ImpactDetailRow
            onClick={() => {
              openImpactDescriptionModal("socio-economic-avoided-co2-renewable-energy");
            }}
          >
            <ImpactDetailLabel>
              ⚡️️ Grâce à la production d'énergies renouvelables
            </ImpactDetailLabel>
            <ImpactValue value={avoidedCO2WithEnrImpact.amount} type="monetary" />
          </ImpactDetailRow>
        </>
      )}

      {waterRegulationImpact && (
        <ImpactItemGroup
          onClick={() => {
            openImpactDescriptionModal("socio-economic-water-regulation");
          }}
        >
          <ImpactLabel>🚰 Régulation de la qualité de l'eau</ImpactLabel>
          <ImpactDetailRow>
            <ImpactDetailLabel>{getActorLabel(waterRegulationImpact.actor)}</ImpactDetailLabel>
            <ImpactValue value={waterRegulationImpact.amount} type="monetary" />
          </ImpactDetailRow>
        </ImpactItemGroup>
      )}

      {ecosystemServicesImpact && (
        <>
          <ImpactItemGroup
            onClick={() => {
              openImpactDescriptionModal("socio-economic-ecosystem-services");
            }}
          >
            <ImpactLabel>🌻 Services écosystémiques</ImpactLabel>
            <ImpactDetailRow>
              <ImpactDetailLabel>{getActorLabel(ecosystemServicesImpact.actor)}</ImpactDetailLabel>
              <ImpactValue isTotal value={ecosystemServicesImpact.amount} type="monetary" />
            </ImpactDetailRow>
          </ImpactItemGroup>
          {ecosystemServicesImpact.details.map(({ amount, impact }) => (
            <ImpactDetailRow
              key={impact}
              onClick={getEcosystemServiceOnClick(impact, openImpactDescriptionModal)}
            >
              <ImpactDetailLabel>{getLabelForEcosystemServicesImpact(impact)}</ImpactDetailLabel>
              <ImpactValue isTotal value={amount} type="monetary" />
            </ImpactDetailRow>
          ))}
        </>
      )}
    </section>
  );
};

export default SocioEconomicEnvironmentalMonetaryImpactsSection;
