import { SocioEconomicImpactRow } from ".";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import ImpactItemGroup from "@/features/projects/views/project-impacts-page/list-view/ImpactItemGroup";
import ImpactItemRow from "@/features/projects/views/project-impacts-page/list-view/ImpactItemRow";
import ImpactLabel from "@/features/projects/views/project-impacts-page/list-view/ImpactLabel";
import ImpactSectionTitle from "@/features/projects/views/project-impacts-page/list-view/ImpactSectionTitle";
import ImpactValue from "@/features/projects/views/project-impacts-page/list-view/ImpactValue";
import { ImpactDescriptionModalCategory } from "@/features/projects/views/project-impacts-page/modals/ImpactDescriptionModalWizard";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
  openImpactDescriptionModal: (category: ImpactDescriptionModalCategory) => void;
};

const SocioEconomicDirectImpactsSection = ({
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

  const economicDirectTotal = socioEconomicImpacts
    .filter(({ impactCategory }) => impactCategory === "economic_direct")
    .reduce((total, { amount }) => total + amount, 0);

  return (
    <section className="fr-mb-5w">
      <ImpactItemRow>
        <ImpactSectionTitle>Impacts économiques directs</ImpactSectionTitle>
        <ImpactValue isTotal value={economicDirectTotal} type="monetary" />
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
  );
};

export default SocioEconomicDirectImpactsSection;
