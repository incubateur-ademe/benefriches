import { SocioEconomicImpactRow } from ".";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";
import ImpactItemGroup from "@/features/projects/views/project-impacts-page/list-view/ImpactItemGroup";
import ImpactItemRow from "@/features/projects/views/project-impacts-page/list-view/ImpactItemRow";
import ImpactLabel from "@/features/projects/views/project-impacts-page/list-view/ImpactLabel";
import ImpactSectionTitle from "@/features/projects/views/project-impacts-page/list-view/ImpactSectionTitle";
import ImpactValue from "@/features/projects/views/project-impacts-page/list-view/ImpactValue";
import { formatMonetaryImpact } from "@/features/projects/views/shared/formatImpactValue";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
};

const SocioEconomicIndirectImpactsSection = ({ socioEconomicImpacts }: Props) => {
  const taxesIncomeImpacts = socioEconomicImpacts.filter(
    (impact) => impact.impact === "taxes_income",
  );

  const hasTaxesIncomeImpacts = taxesIncomeImpacts.length > 0;
  const propertyTransferDutiesIncomeImpact =
    socioEconomicImpacts.find((i) => i.impact === "property_transfer_duties_income") ?? null;

  const economicIndirectTotal = socioEconomicImpacts
    .filter(({ impactCategory }) => impactCategory === "economic_indirect")
    .reduce((total, { amount }) => total + amount, 0);

  return (
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
  );
};

export default SocioEconomicIndirectImpactsSection;
