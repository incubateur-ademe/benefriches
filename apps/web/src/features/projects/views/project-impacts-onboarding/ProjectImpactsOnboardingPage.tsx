import { useLayoutEffect, useState } from "react";

import { KeyImpactIndicatorData } from "../../application/projectKeyImpactIndicators.selectors";
import { ProjectOverallImpact } from "../../domain/projectKeyImpactIndicators";
import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

type Props = {
  onFinalNext: () => void;
  evaluationPeriod: number;
  projectOverallImpact: ProjectOverallImpact;
  mainKeyImpactIndicators: KeyImpactIndicatorData[];
};

export default function ProjectImpactsOnboardingPage({
  onFinalNext,
  evaluationPeriod,
  projectOverallImpact,
  mainKeyImpactIndicators,
}: Props) {
  const [currentStep, setStep] = useState(1);
  const goToStep = (nextStep: number) => () => {
    setStep(nextStep);
  };

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  return (
    <div className="fr-container tw-my-8 md:tw-my-20" id="step-container">
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
            return <Step3 onNextClick={goToStep(4)} onBackClick={goToStep(2)} />;
          case 4:
            return <Step4 onNextClick={onFinalNext} onBackClick={goToStep(3)} />;
        }
      })()}
    </div>
  );
}
