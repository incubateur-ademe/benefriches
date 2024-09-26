import { useState } from "react";
import { SyntheticImpact } from "../../application/projectImpactsSynthetics.selectors";
import { ProjectOverallImpact } from "../../domain/projectKeyImpactIndicators";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";

import { routes } from "@/app/views/router";

type Props = {
  projectId: string;
  evaluationPeriod: number;
  projectOverallImpact: ProjectOverallImpact;
  mainKeyImpactIndicators: SyntheticImpact[];
};

export default function ProjectImpactsOnboardingPage({
  projectId,
  evaluationPeriod,
  projectOverallImpact,
  mainKeyImpactIndicators,
}: Props) {
  const [currentStep, setStep] = useState(1);
  const goToStep = (nextStep: number) => () => {
    setStep(nextStep);
  };

  return (
    <div className="fr-container tw-my-8 md:tw-my-20">
      {(() => {
        switch (currentStep) {
          case 1:
            return (
              <Step1
                onNextClick={goToStep(2)}
                evaluationPeriod={evaluationPeriod}
                projectOverallImpact={projectOverallImpact}
                mainKeyImpactIndicators={mainKeyImpactIndicators}
              />
            );
          case 2:
            return <Step2 onNextClick={goToStep(3)} onBackClick={goToStep(1)} />;
          case 3:
            return (
              <Step3
                onNextClick={() => {
                  routes.projectImpacts({ projectId }).push();
                }}
                onBackClick={goToStep(2)}
              />
            );
        }
      })()}
    </div>
  );
}
