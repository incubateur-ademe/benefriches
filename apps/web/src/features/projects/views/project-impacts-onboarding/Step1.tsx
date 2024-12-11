import Button from "@codegouvfr/react-dsfr/Button";
import { ReactNode } from "react";

import { KeyImpactIndicatorData } from "../../application/projectKeyImpactIndicators.selectors";
import { ProjectOverallImpact } from "../../domain/projectKeyImpactIndicators";
import ImpactSummaryAvoidedCo2eqEmissions from "../project-page/impacts/summary-view/impacts/AvoidedCo2eqEmissions";
import ImpactSummaryAvoidedFricheCostsForLocalAuthority from "../project-page/impacts/summary-view/impacts/AvoidedFricheCostsForLocalAuthority";
import ImpactSummaryFullTimeJobs from "../project-page/impacts/summary-view/impacts/FullTimeJobs";
import ImpactSummaryHouseholdsPoweredByRenewableEnergy from "../project-page/impacts/summary-view/impacts/HouseholdsPoweredByRenewableEnergy";
import ImpactSummaryLocalPropertyValueIncrease from "../project-page/impacts/summary-view/impacts/LocalPropertyValueIncrease";
import ImpactSummaryNonContaminatedSurfaceArea from "../project-page/impacts/summary-view/impacts/NonContaminatedSurfaceArea";
import ImpactSummaryPermeableSurfaceArea from "../project-page/impacts/summary-view/impacts/PermeableSurfaceArea";
import ImpactSummaryProjectBalance from "../project-page/impacts/summary-view/impacts/ProjectBalance";
import ImpactSummaryTaxesIncome from "../project-page/impacts/summary-view/impacts/TaxesIncome";
import ImpactSummaryZanCompliance from "../project-page/impacts/summary-view/impacts/ZanCompliance";

type Props = {
  evaluationPeriod: number;
  projectOverallImpact: ProjectOverallImpact;
  mainKeyImpactIndicators: KeyImpactIndicatorData[];
  onNextClick: () => void;
};

function getTitle(projectOverallImpact: ProjectOverallImpact): ReactNode {
  switch (projectOverallImpact) {
    case "strong_negative":
      return (
        <>
          Attention !<br />
          🚨 Votre projet présente des{" "}
          <span className="tw-bg-[#F06767] tw-text-black">impacts négatifs notables</span>.
        </>
      );
    case "negative":
      return (
        <>
          Votre projet présente des{" "}
          <span className="tw-bg-[#F0BB67] tw-text-black">impacts négatifs</span>.
        </>
      );
    case "positive":
      return (
        <>
          Votre projet aura un impact{" "}
          <span className="tw-bg-[#8CF07A] tw-text-black">plutôt positif</span>.
        </>
      );
    case "strong_positive":
      return (
        <>
          Félicitations ! 🎉
          <br />
          Votre projet aura un{" "}
          <span className="tw-bg-[#34EB7B] tw-text-black">fort impact positif</span>.
        </>
      );
  }
}

const getOverallImpactIllustrationUrl = (projectOverallImpact: ProjectOverallImpact) => {
  switch (projectOverallImpact) {
    case "strong_negative":
      return "/img/pictograms/project-impacts-onboarding/project-overall-impact-strong-negative.svg";
    case "negative":
      return "/img/pictograms/project-impacts-onboarding/project-overall-impact-negative.svg";
    case "positive":
      return "/img/pictograms/project-impacts-onboarding/project-overall-impact-positive.svg";
    case "strong_positive":
      return "/img/pictograms/project-impacts-onboarding/project-overall-impact-strong-positive.svg";
  }
};

export default function Step1({
  projectOverallImpact,
  mainKeyImpactIndicators,
  evaluationPeriod,
  onNextClick,
}: Props) {
  return (
    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-6 tw-items-start">
      <img
        src={getOverallImpactIllustrationUrl(projectOverallImpact)}
        aria-hidden="true"
        alt="pictogramme curseur des impacts"
        className="tw-w-[90%] md:tw-w-1/3 tw-mx-auto"
      />
      <div className="md:tw-w-2/3">
        <h1 className="tw-text-[32px]">{getTitle(projectOverallImpact)}</h1>
        <p className="tw-text-lg tw-font-bold">
          Voici les atouts principaux de votre projet sur{" "}
          {evaluationPeriod <= 1
            ? `la première année :`
            : `les ${evaluationPeriod} premières années :`}
        </p>
        <section className="tw-flex tw-flex-col tw-space-y-6">
          {mainKeyImpactIndicators.map(({ name, value, isSuccess }) => {
            switch (name) {
              case "zanCompliance":
                return (
                  <ImpactSummaryZanCompliance
                    isAgriculturalFriche={value.isAgriculturalFriche}
                    isSuccess={isSuccess}
                  />
                );
              case "projectImpactBalance":
                return <ImpactSummaryProjectBalance isSuccess={isSuccess} {...value} />;

              case "avoidedFricheCostsForLocalAuthority":
                return (
                  <ImpactSummaryAvoidedFricheCostsForLocalAuthority
                    isSuccess={isSuccess}
                    {...value}
                  />
                );
              case "taxesIncomesImpact":
                return <ImpactSummaryTaxesIncome isSuccess={isSuccess} value={value} />;
              case "fullTimeJobs":
                return <ImpactSummaryFullTimeJobs isSuccess={isSuccess} {...value} />;
              case "avoidedCo2eqEmissions":
                return <ImpactSummaryAvoidedCo2eqEmissions isSuccess={isSuccess} value={value} />;
              case "nonContaminatedSurfaceArea":
                return <ImpactSummaryNonContaminatedSurfaceArea isSuccess={isSuccess} {...value} />;
              case "permeableSurfaceArea":
                return <ImpactSummaryPermeableSurfaceArea isSuccess={isSuccess} {...value} />;
              case "householdsPoweredByRenewableEnergy":
                return <ImpactSummaryHouseholdsPoweredByRenewableEnergy value={value} />;
              case "localPropertyValueIncrease":
                return <ImpactSummaryLocalPropertyValueIncrease value={value} />;
            }
          })}
        </section>
        <div className="tw-flex tw-flex-row-reverse tw-mt-5">
          <Button onClick={onNextClick}>Suivant (1/3)</Button>
        </div>
      </div>
    </div>
  );
}
