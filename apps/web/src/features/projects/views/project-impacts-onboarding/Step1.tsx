import { ReactNode } from "react";
import Button from "@codegouvfr/react-dsfr/Button";
import { SyntheticImpact } from "../../application/projectImpactsSynthetics.selectors";
import { ProjectOverallImpact } from "../../domain/projectKeyImpactIndicators";
import ImpactSynthesisAvoidedCo2eqEmissions from "../project-page/impacts/synthesis-view/impacts/AvoidedCo2eqEmissions";
import ImpactSynthesisAvoidedFricheCostsForLocalAuthority from "../project-page/impacts/synthesis-view/impacts/AvoidedFricheCostsForLocalAuthority";
import ImpactSynthesisFullTimeJobs from "../project-page/impacts/synthesis-view/impacts/FullTimeJobs";
import ImpactSynthesisHouseholdsPoweredByRenewableEnergy from "../project-page/impacts/synthesis-view/impacts/HouseholdsPoweredByRenewableEnergy";
import ImpactSynthesisLocalPropertyValueIncrease from "../project-page/impacts/synthesis-view/impacts/LocalPropertyValueIncrease";
import ImpactSynthesisNonContaminatedSurfaceArea from "../project-page/impacts/synthesis-view/impacts/NonContaminatedSurfaceArea";
import ImpactSynthesisPermeableSurfaceArea from "../project-page/impacts/synthesis-view/impacts/PermeableSurfaceArea";
import ImpactSynthesisProjectBalance from "../project-page/impacts/synthesis-view/impacts/ProjectBalance";
import ImpactSynthesisTaxesIncome from "../project-page/impacts/synthesis-view/impacts/TaxesIncome";
import ImpactSynthesisZanCompliance from "../project-page/impacts/synthesis-view/impacts/ZanCompliance";

type Props = {
  evaluationPeriod: number;
  projectOverallImpact: ProjectOverallImpact;
  mainKeyImpactIndicators: SyntheticImpact[];
  onNextClick: () => void;
};

function getTitle(projectOverallImpact: ProjectOverallImpact): ReactNode {
  switch (projectOverallImpact) {
    case "strong_negative":
      return (
        <>
          Attention !<br />
          🚨 Votre projet présente des{" "}
          <span className="tw-bg-[#F06767]">impacts négatifs notables</span>.
        </>
      );
    case "negative":
      return (
        <>
          Votre projet présente des <span className="tw-bg-[#F0BB67]">impacts négatifs</span>.
        </>
      );
    case "positive":
      return (
        <>
          Votre projet aura un impact <span className="tw-bg-[#8CF07A]">plutôt positif</span>.
        </>
      );
    case "strong_positive":
      return (
        <>
          Félicitations ! 🎉
          <br />
          Votre projet aura un <span className="tw-bg-[#34EB7B]">fort impact positif</span>.
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
    <div className="tw-flex tw-flex-col md:tw-flex-row md:tw-space-x-6">
      <div className="tw-m-auto md:tw-m-0 tw-p-6">
        <img
          src={getOverallImpactIllustrationUrl(projectOverallImpact)}
          aria-hidden="true"
          alt="pictogramme curseur des impacts"
          width="384px"
        />
      </div>
      <div>
        <h1 className="tw-text-[32px]">{getTitle(projectOverallImpact)}</h1>
        <p className="tw-text-lg tw-font-bold">
          En {evaluationPeriod} {evaluationPeriod <= 1 ? "an" : "ans"}, il génèrera notamment :
        </p>
        <section className="tw-flex tw-flex-col tw-space-y-6">
          {mainKeyImpactIndicators.map(({ name, value, isSuccess }) => {
            switch (name) {
              case "zanCompliance":
                return (
                  <ImpactSynthesisZanCompliance
                    isAgriculturalFriche={value.isAgriculturalFriche}
                    isSuccess={isSuccess}
                  />
                );
              case "projectImpactBalance":
                return <ImpactSynthesisProjectBalance isSuccess={isSuccess} {...value} />;

              case "avoidedFricheCostsForLocalAuthority":
                return (
                  <ImpactSynthesisAvoidedFricheCostsForLocalAuthority
                    isSuccess={isSuccess}
                    {...value}
                  />
                );
              case "taxesIncomesImpact":
                return <ImpactSynthesisTaxesIncome isSuccess={isSuccess} value={value} />;
              case "fullTimeJobs":
                return <ImpactSynthesisFullTimeJobs isSuccess={isSuccess} {...value} />;
              case "avoidedCo2eqEmissions":
                return <ImpactSynthesisAvoidedCo2eqEmissions isSuccess={isSuccess} value={value} />;
              case "nonContaminatedSurfaceArea":
                return (
                  <ImpactSynthesisNonContaminatedSurfaceArea isSuccess={isSuccess} {...value} />
                );
              case "permeableSurfaceArea":
                return <ImpactSynthesisPermeableSurfaceArea isSuccess={isSuccess} {...value} />;
              case "householdsPoweredByRenewableEnergy":
                return <ImpactSynthesisHouseholdsPoweredByRenewableEnergy value={value} />;
              case "localPropertyValueIncrease":
                return <ImpactSynthesisLocalPropertyValueIncrease value={value} />;
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
