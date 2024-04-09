import { getActorLabel } from "../impacts/socio-economic/socioEconomicImpacts";
import { ImpactDescriptionModalCategory } from "../modals/ImpactDescriptionModalWizard";
import { formatMonetaryImpact } from "./formatImpactValue";
import ImpactDetailLabel from "./ImpactDetailLabel";
import ImpactDetailRow from "./ImpactItemDetailRow";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactItemRow from "./ImpactItemRow";
import ImpactLabel from "./ImpactLabel";
import ImpactMainTitle from "./ImpactMainTitle";
import ImpactSectionTitle from "./ImpactSectionTitle";
import ImpactValue from "./ImpactValue";
import SocioEconomicEnvironmentalMonetaryImpactsSection from "./SocioEconomicEnvironmentalMonetarySection";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

type SocioEconomicImpactRowProps = {
  impact: Props["socioEconomicImpacts"][number];
};

const sumSocioEconomicImpactsByCategory = (
  socioEconomicImpacts: Props["socioEconomicImpacts"],
  category: Props["socioEconomicImpacts"][number]["impactCategory"],
) =>
  socioEconomicImpacts
    .filter(({ impactCategory }) => impactCategory === category)
    .reduce((total, { amount }) => total + amount, 0);

const SocioEconomicImpactRow = ({ impact }: SocioEconomicImpactRowProps) => {
  return (
    <ImpactDetailRow key={impact.actor + impact.amount}>
      <ImpactDetailLabel>{getActorLabel(impact.actor)}</ImpactDetailLabel>
      <ImpactValue>{formatMonetaryImpact(impact.amount)}</ImpactValue>
    </ImpactDetailRow>
  );
};

const SocioEconomicImpactsListSection = ({
  socioEconomicImpacts,
  openImpactDescriptionModal,
}: Props) => {
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

  const economicDirectTotal = sumSocioEconomicImpactsByCategory(
    socioEconomicImpacts,
    "economic_direct",
  );

  const economicIndirectTotal = sumSocioEconomicImpactsByCategory(
    socioEconomicImpacts,
    "economic_indirect",
  );

  return (
    <section className="fr-mb-5w">
      <ImpactMainTitle
        title="Impacts socio-économiques"
        onClick={() => {
          openImpactDescriptionModal("socio-economic");
        }}
      />
      <section className="fr-mb-5w">
        <ImpactItemRow>
          <ImpactSectionTitle>Impacts économiques directs</ImpactSectionTitle>
          <ImpactValue isTotal>{formatMonetaryImpact(economicDirectTotal)}</ImpactValue>
        </ImpactItemRow>
        {hasRentalIncomeImpacts && (
          <ImpactItemGroup>
            <ImpactLabel>🔑 Revenu locatif</ImpactLabel>
            {rentalIncomeImpacts.map((impact) => {
              return <SocioEconomicImpactRow key={impact.actor + impact.amount} impact={impact} />;
            })}
          </ImpactItemGroup>
        )}
        {hasAvoidedFricheCostsImpacts && (
          <ImpactItemGroup
            onClick={() => {
              openImpactDescriptionModal("socio-economic-avoided-friche-costs");
            }}
          >
            <ImpactLabel>🏚 Dépenses de gestion et sécurisation de la friche évitées</ImpactLabel>
            {avoidedFricheCostsImpacts.map((impact) => {
              return <SocioEconomicImpactRow key={impact.actor + impact.amount} impact={impact} />;
            })}
          </ImpactItemGroup>
        )}
      </section>
      <section className="fr-mb-5w">
        <ImpactItemRow>
          <ImpactSectionTitle>Impacts économiques indirects</ImpactSectionTitle>
          <ImpactValue isTotal>{formatMonetaryImpact(economicIndirectTotal)}</ImpactValue>
        </ImpactItemRow>
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
      <SocioEconomicEnvironmentalMonetaryImpactsSection
        socioEconomicImpacts={socioEconomicImpacts}
        openImpactDescriptionModal={openImpactDescriptionModal}
      />
    </section>
  );
};

export default SocioEconomicImpactsListSection;
