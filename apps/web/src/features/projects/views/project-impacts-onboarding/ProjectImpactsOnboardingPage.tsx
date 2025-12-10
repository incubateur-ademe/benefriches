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

  switch (currentStep) {
    case STEPS[1]:
      return (
        <Step1
          onNextClick={() => {
            onNextToStep(STEPS[2]);
          }}
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
        />
      );
    case STEPS[2]:
      return (
        <Step2
          onNextClick={() => {
            onNextToStep(STEPS[3]);
          }}
          onBackClick={() => {
            onBackToStep(STEPS[1]);
          }}
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
        />
      );
    case STEPS[3]:
      return (
        <Step3
          onNextClick={() => {
            onNextToStep(STEPS[4]);
          }}
          onBackClick={() => {
            onBackToStep(STEPS[2]);
          }}
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
          canSkipOnboarding={canSkipOnboarding}
          skipOnboarding={onFinalNext}
        />
      );
  }
}
