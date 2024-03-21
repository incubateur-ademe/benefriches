import { formatMonetaryImpact } from "./formatImpactValue";
import ImpactDetailLabel from "./ImpactDetailLabel";
import ImpactDetailRow from "./ImpactItemDetailRow";
import ImpactItemGroup from "./ImpactItemGroup";
import ImpactLabel from "./ImpactLabel";
import ImpactValue from "./ImpactValue";

import { ReconversionProjectImpacts } from "@/features/projects/domain/impacts.types";

type Props = {
  socioEconomicImpacts: ReconversionProjectImpacts["socioeconomic"]["impacts"];
};

type SocioEconomicImpactRowProps = {
  impact: Props["socioEconomicImpacts"][number];
};

const SocioEconomicImpactRow = ({ impact }: SocioEconomicImpactRowProps) => {
  return (
    <ImpactDetailRow key={impact.actor + impact.amount}>
      <ImpactDetailLabel>{impact.actor}</ImpactDetailLabel>
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
  const hasTaxesIncomeImpacts = socioEconomicImpacts.length > 0;

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
      <section>
        <h4>Impacts économiques indirects</h4>
        {hasTaxesIncomeImpacts && (
          <ImpactItemGroup>
            <ImpactLabel>🏛 Recettes fiscales</ImpactLabel>
            {taxesIncomeImpacts.map((impact) => {
              return <SocioEconomicImpactRow key={impact.actor + impact.amount} impact={impact} />;
            })}
          </ImpactItemGroup>
        )}
      </section>
    </section>
  );
};

export default SocioEconomicImpactsListSection;
