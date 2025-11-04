import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useState } from "react";

import HtmlTitle from "@/shared/views/components/HtmlTitle/HtmlTitle";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";
import { DEFAULT_STEP, STEPS } from "./steps";

type Props = {
  onFinalNext: () => void;
  onNextToStep: (step: string) => void;
  onBackToStep: (step: string) => void;
  routeStep?: string;
  canSkipOnboarding: boolean;
};

const parseRouteStep = (step?: string) =>
  step && Object.values(STEPS).includes(step) ? step : DEFAULT_STEP;

export default function ProjectImpactsOnboardingPage({
  onBackToStep,
  onNextToStep,
  onFinalNext,
  routeStep,
  canSkipOnboarding,
}: Props) {
  const currentStep = parseRouteStep(routeStep);

  const [stepsHistory, setStepsHistory] = useState<string[]>([]);

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const shouldDisableStepByStepAnimation = windowInnerWidth < breakpointsValues.md;

  return (
    <div className="fr-container">
      <div className="md:w-3/4 mx-auto">
        {(() => {
          switch (currentStep) {
            case STEPS[1]:
              return (
                <>
                  <HtmlTitle>Types d'impacts - Introduction - Impacts du projet</HtmlTitle>
                  <Step1
                    onNextClick={() => {
                      setStepsHistory((current) => [...current, STEPS[1]]);
                      onNextToStep(STEPS[2]);
                    }}
                    skipStepByStepAnimation={
                      shouldDisableStepByStepAnimation || stepsHistory.includes(STEPS[1])
                    }
                    canSkipOnboarding={canSkipOnboarding}
                    skipOnboarding={onFinalNext}
                  />
                </>
              );
            case STEPS[2]:
              return (
                <>
                  <HtmlTitle>Types d'entités - Introduction - Impacts du projet</HtmlTitle>
                  <Step2
                    onNextClick={() => {
                      setStepsHistory((current) => [...current, STEPS[2]]);
                      onNextToStep(STEPS[3]);
                    }}
                    onBackClick={() => {
                      onBackToStep(STEPS[1]);
                    }}
                    skipStepByStepAnimation={
                      shouldDisableStepByStepAnimation || stepsHistory.includes(STEPS[2])
                    }
                    canSkipOnboarding={canSkipOnboarding}
                    skipOnboarding={onFinalNext}
                  />
                </>
              );
            case STEPS[3]:
              return (
                <>
                  <HtmlTitle>Détails des calculs - Introduction - Impacts du projet</HtmlTitle>
                  <Step3
                    onNextClick={() => {
                      setStepsHistory((current) => [...current, STEPS[3]]);
                      onNextToStep(STEPS[4]);
                    }}
                    onBackClick={() => {
                      onBackToStep(STEPS[2]);
                    }}
                    skipStepByStepAnimation={
                      shouldDisableStepByStepAnimation || stepsHistory.includes(STEPS[3])
                    }
                    canSkipOnboarding={canSkipOnboarding}
                    skipOnboarding={onFinalNext}
                  />
                </>
              );
            case STEPS[4]:
              return (
                <>
                  <HtmlTitle>Sauvegarde - Introduction - Impacts du projet</HtmlTitle>
                  <Step4
                    onNextClick={onFinalNext}
                    onBackClick={() => {
                      onBackToStep(STEPS[3]);
                    }}
                    skipStepByStepAnimation={shouldDisableStepByStepAnimation}
                    canSkipOnboarding={canSkipOnboarding}
                    skipOnboarding={onFinalNext}
                  />
                </>
              );
          }
        })()}
      </div>
    </div>
  );
}
