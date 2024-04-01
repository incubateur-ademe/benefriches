import { getActorLabel } from "../impacts/socio-economic/socioEconomicImpacts";
import { formatMonetaryImpact } from "./formatImpactValue";
import ImpactDetailLabel from "./ImpactDetailLabel";
import ImpactDetailRow from "./ImpactItemDetailRow";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactLabel from "./ImpactLabel";
import ImpactValue from "./ImpactValue";

import {
  EcosystemServicesImpact,
  ReconversionProjectImpacts,
} from "@/features/projects/domain/impacts.types";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
};

type SocioEconomicImpactRowProps = {
  impact: Props["socioEconomicImpacts"][number];
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

const SocioEconomicImpactRow = ({ impact }: SocioEconomicImpactRowProps) => {
  return (
    <ImpactDetailRow key={impact.actor + impact.amount}>
      <ImpactDetailLabel>{getActorLabel(impact.actor)}</ImpactDetailLabel>
      <ImpactValue>{formatMonetaryImpact(impact.amount)}</ImpactValue>
    </ImpactDetailRow>
  );
};

const SocioEconomicImpactsListSection = ({ socioEconomicImpacts }: Props) => {
  const rentalIncomeImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "rental_income",
  );
  const hasRentalIncomeImpacts = rentalIncomeImpacts.length > 0;

  const avoidedFricheCostsImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "avoided_friche_costs",
  );
  const hasAvoidedFricheCostsImpacts = avoidedFricheCostsImpacts.length > 0;

  const taxesIncomeImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "taxes_income",
  );
  const hasTaxesIncomeImpacts = taxesIncomeImpacts.length > 0;
  const propertyTransferDutiesIncomeImpact =
    socioEconomicImpacts.find((i) => i.impact === "property_transfer_duties_income") ?? null;

  const ecosystemServicesImpact = socioEconomicImpacts.find(
    (impact) => impact.impact === "ecosystem_services",
  ) as EcosystemServicesImpact | undefined;

  return (
    <section className="fr-mb-5w">
      <h3>Impacts économiques</h3>
      <section className="fr-mb-5w">
        <h4>Impacts économiques directs</h4>
        {hasRentalIncomeImpacts && (
          <ImpactItemGroup>
            <ImpactLabel>🔑 Revenu locatif</ImpactLabel>
            {rentalIncomeImpacts.map((impact) => {
              return <SocioEconomicImpactRow key={impact.actor + impact.amount} impact={impact} />;
            })}
          </ImpactItemGroup>
        )}
        {hasAvoidedFricheCostsImpacts && (
          <ImpactItemGroup>
            <ImpactLabel>🏚 Dépenses de gestion et sécurisation de la friche évitées</ImpactLabel>
            {avoidedFricheCostsImpacts.map((impact) => {
              return <SocioEconomicImpactRow key={impact.actor + impact.amount} impact={impact} />;
            })}
          </ImpactItemGroup>
        )}
      </section>
      <section className="fr-mb-5w">
        <h4>Impacts économiques indirects</h4>
        {hasTaxesIncomeImpacts && (
          <ImpactItemGroup>
            <ImpactLabel>🏛 Recettes fiscales</ImpactLabel>
            {taxesIncomeImpacts.map((impact) => {
              return <SocioEconomicImpactRow key={impact.actor + impact.amount} impact={impact} />;
            })}
          </ImpactItemGroup>
        )}
        {propertyTransferDutiesIncomeImpact && (
          <ImpactItemGroup>
            <ImpactLabel>🏛 Droits de mutation sur la vente du site</ImpactLabel>
            <SocioEconomicImpactRow
              key={
                propertyTransferDutiesIncomeImpact.actor + propertyTransferDutiesIncomeImpact.amount
              }
              impact={propertyTransferDutiesIncomeImpact}
            />
          </ImpactItemGroup>
        )}
      </section>
      <section className="fr-mb-5w">
        <h4>Impacts environnementaux monétarisés</h4>
        {ecosystemServicesImpact && (
          <>
            <ImpactItemGroup>
              <ImpactLabel>🌻 Services écosystémiques</ImpactLabel>
              <ImpactDetailRow key={ecosystemServicesImpact.actor + ecosystemServicesImpact.amount}>
                <ImpactDetailLabel>
                  {getActorLabel(ecosystemServicesImpact.actor)}
                </ImpactDetailLabel>
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
    </section>
  );
};

export default SocioEconomicImpactsListSection;
