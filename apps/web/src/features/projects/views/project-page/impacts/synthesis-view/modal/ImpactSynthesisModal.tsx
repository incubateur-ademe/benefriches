import { useEffect, useMemo } from "react";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import ImpactSynthesisAvoidedCo2eqEmissions from "../impacts/AvoidedCo2eqEmissions";
import ImpactSynthesisAvoidedFricheCostsForLocalAuthority from "../impacts/AvoidedFricheCostsForLocalAuthority";
import ImpactSynthesisFullTimeJobs from "../impacts/FullTimeJobs";
import ImpactSynthesisHouseholdsPoweredByRenewableEnergy from "../impacts/HouseholdsPoweredByRenewableEnergy";
import ImpactSynthesisLocalPropertyValueIncrease from "../impacts/LocalPropertyValueIncrease";
import ImpactSynthesisNonContaminatedSurfaceArea from "../impacts/NonContaminatedSurfaceArea";
import ImpactSynthesisPermeableSurfaceArea from "../impacts/PermeableSurfaceArea";
import ImpactSynthesisProjectBalance from "../impacts/ProjectBalance";
import ImpactSynthesisTaxesIncome from "../impacts/TaxesIncome";
import ImpactSynthesisZanCompliance from "../impacts/ZanCompliance";

import { SyntheticImpact } from "@/features/projects/application/projectImpactsSynthetics.selectors";

const modal = createModal({
  id: "impact-sythesis-modal",
  isOpenedByDefault: true,
});

type Props = {
  syntheticImpactsList: SyntheticImpact[];
  evaluationPeriod: number;
};

const HIGH_POSITIVE_ORDER_PRIORITY = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "taxesIncomesImpact",
  "fullTimeJobs",
  "avoidedCo2eqEmissions",
  "nonContaminatedSurfaceArea",
  "permeableSurfaceArea",
  "householdsPoweredByRenewableEnergy",
  "localPropertyValueIncrease",
];

const NEGATIVE_OR_LESS_POSITIVE_ORDER_PRIORITY = [
  "zanCompliance",
  "projectImpactBalance",
  "avoidedFricheCostsForLocalAuthority",
  "taxesIncomesImpact",
  "fullTimeJobs",
  "avoidedCo2eqEmissions",
  "nonContaminatedSurfaceArea",
  "permeableSurfaceArea",
  "householdsPoweredByRenewableEnergy",
  "localPropertyValueIncrease",
];

const ImpactSynthesisModal = ({ syntheticImpactsList, evaluationPeriod }: Props) => {
  useEffect(() => {
    setTimeout(() => {
      modal.open();
    }, 150);
  }, []);

  const projectImpactBalance = syntheticImpactsList.find(
    ({ name }) => name === "projectImpactBalance",
  );
  const projectImpactBalanceStatus = projectImpactBalance?.isSuccess;

  const positiveSyntheticImpacts = syntheticImpactsList.filter(({ isSuccess }) => isSuccess);
  const negativeSyntheticImpacts = syntheticImpactsList.filter(({ isSuccess }) => !isSuccess);

  const priority =
    positiveSyntheticImpacts.length > 4 && projectImpactBalanceStatus
      ? HIGH_POSITIVE_ORDER_PRIORITY
      : NEGATIVE_OR_LESS_POSITIVE_ORDER_PRIORITY;

  const title = useMemo(() => {
    if (projectImpactBalanceStatus) {
      return positiveSyntheticImpacts.length < 5
        ? "Votre projet aura un impact plutôt positif."
        : "Félicitations ! 🎉 Votre projet aura un fort impact positif";
    }

    return negativeSyntheticImpacts.length < 5
      ? "Votre projet présente des impacts négatifs"
      : "Attention ! 🚨 Votre projet présente des impacts négatifs notables.";
  }, [
    negativeSyntheticImpacts.length,
    positiveSyntheticImpacts.length,
    projectImpactBalanceStatus,
  ]);

  return (
    <modal.Component
      title={title}
      buttons={[
        {
          doClosesModal: true,
          children: "Découvrir tous les impacts",
        },
      ]}
    >
      <p>
        En {evaluationPeriod} {evaluationPeriod === 1 ? "an" : "ans"}, il génèrera notamment :
      </p>
      <div className="tw-flex tw-flex-col tw-gap-6">
        {(projectImpactBalanceStatus ? positiveSyntheticImpacts : negativeSyntheticImpacts)
          .sort(
            ({ name: aName }, { name: bName }) => priority.indexOf(aName) - priority.indexOf(bName),
          )
          .slice(0, 3)
          .map(({ name, value, isSuccess }) => {
            switch (name) {
              case "zanCompliance":
                return (
                  <ImpactSynthesisZanCompliance
                    small
                    isAgriculturalFriche={value.isAgriculturalFriche}
                    isSuccess={isSuccess}
                  />
                );
              case "projectImpactBalance":
                return <ImpactSynthesisProjectBalance isSuccess={isSuccess} small {...value} />;

              case "avoidedFricheCostsForLocalAuthority":
                return (
                  <ImpactSynthesisAvoidedFricheCostsForLocalAuthority
                    small
                    isSuccess={isSuccess}
                    {...value}
                  />
                );
              case "taxesIncomesImpact":
                return <ImpactSynthesisTaxesIncome isSuccess={isSuccess} small value={value} />;
              case "fullTimeJobs":
                return <ImpactSynthesisFullTimeJobs isSuccess={isSuccess} small {...value} />;
              case "avoidedCo2eqEmissions":
                return (
                  <ImpactSynthesisAvoidedCo2eqEmissions small isSuccess={isSuccess} value={value} />
                );
              case "nonContaminatedSurfaceArea":
                return (
                  <ImpactSynthesisNonContaminatedSurfaceArea
                    isSuccess={isSuccess}
                    small
                    {...value}
                  />
                );
              case "permeableSurfaceArea":
                return (
                  <ImpactSynthesisPermeableSurfaceArea small isSuccess={isSuccess} {...value} />
                );
              case "householdsPoweredByRenewableEnergy":
                return <ImpactSynthesisHouseholdsPoweredByRenewableEnergy small value={value} />;
              case "localPropertyValueIncrease":
                return <ImpactSynthesisLocalPropertyValueIncrease small value={value} />;
            }
          })}
      </div>
    </modal.Component>
  );
};

export default ImpactSynthesisModal;
