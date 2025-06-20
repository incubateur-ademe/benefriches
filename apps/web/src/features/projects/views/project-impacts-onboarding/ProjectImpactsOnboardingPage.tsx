import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useEffect, useLayoutEffect, useState } from "react";

import Step1 from "./Step1";
import Step2 from "./Step2";
import Step3 from "./Step3";
import Step4 from "./Step4";

const STEPS = {
  1: "1-types-impacts",
  2: "2-entites-concernes",
  3: "3-details-calculs",
  4: "4-persistence-donnees",
};

type Props = {
  onFinalNext: () => void;
  onNextToStep: (step: string) => void;
  onBackToStep: (step: string) => void;
  routeStep?: string;
};

const DEFAULT_STEP = STEPS[1];

const parseRouteStep = (step?: string) =>
  step && Object.values(STEPS).includes(step) ? step : DEFAULT_STEP;

export default function ProjectImpactsOnboardingPage({
  onBackToStep,
  onNextToStep,
  onFinalNext,
  routeStep,
}: Props) {
  const currentStep = parseRouteStep(routeStep);

  const [stepsHistory, setStepsHistory] = useState<string[]>([]);

  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);

  useEffect(() => {
    if (routeStep !== currentStep) {
      onBackToStep(currentStep);
    }
  }, [currentStep, onBackToStep, routeStep]);

  const { breakpointsValues } = useBreakpointsValuesPx();
  const { windowInnerWidth } = useWindowInnerSize();

  const shouldDisableStepByStepAnimation = windowInnerWidth < breakpointsValues.md;

  return (
    <div className="fr-container tw-my-8 md:tw-my-20">
      <div className="md:tw-w-3/4 tw-mx-auto">
        {(() => {
          switch (currentStep) {
            case STEPS[1]:
              return (
                <Step1
                  onNextClick={() => {
                    setStepsHistory((current) => [...current, STEPS[1]]);
                    onNextToStep(STEPS[2]);
                  }}
                  skipStepByStepAnimation={
                    shouldDisableStepByStepAnimation || stepsHistory.includes(STEPS[1])
                  }
                />
              );
            case STEPS[2]:
              return (
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
                />
              );
            case STEPS[3]:
              return (
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
                />
              );
            case STEPS[4]:
              return (
                <Step4
                  onNextClick={onFinalNext}
                  onBackClick={() => {
                    onBackToStep(STEPS[3]);
                  }}
                  skipStepByStepAnimation={shouldDisableStepByStepAnimation}
                />
              );
          }
        })()}
      </div>
    </div>
  );
}
