import { useWindowInnerSize } from "@codegouvfr/react-dsfr/tools/useWindowInnerSize";
import { useBreakpointsValuesPx } from "@codegouvfr/react-dsfr/useBreakpointsValuesPx";
import { useState } from "react";

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
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
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
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
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
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
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
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
        />
      );
  }
}
