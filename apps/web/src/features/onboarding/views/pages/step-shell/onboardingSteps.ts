import { z } from "zod";

import { routes } from "@/app/router";

export const onboardingStepKeySchema = z.enum(["welcome", "methodology", "testimonials"]);
export type OnboardingStepKey = z.infer<typeof onboardingStepKeySchema>;

type OnboardingRoute =
  | typeof routes.onBoardingWelcome
  | typeof routes.onBoardingMethodology
  | typeof routes.onBoardingTestimonials
  | typeof routes.myEvaluations;

type OnboardingStepDefinition = {
  key: OnboardingStepKey;
  route: OnboardingRoute;
  forwardLabel: "Suivant" | "Commencer";
};

const onboardingSteps: OnboardingStepDefinition[] = [
  { key: "welcome", route: routes.onBoardingWelcome, forwardLabel: "Suivant" },
  { key: "methodology", route: routes.onBoardingMethodology, forwardLabel: "Suivant" },
  { key: "testimonials", route: routes.onBoardingTestimonials, forwardLabel: "Commencer" },
];

export type OnboardingStepInfo = {
  stepNumber: number;
  totalSteps: number;
  previousRoute: OnboardingRoute | undefined;
  forwardLabel: "Suivant" | "Commencer";
  forwardRoute: OnboardingRoute;
};

export function getOnboardingStepInfo(stepKey: OnboardingStepKey): OnboardingStepInfo {
  const stepIndex = onboardingSteps.findIndex((step) => step.key === stepKey);
  const step = onboardingSteps[stepIndex];

  if (!step) {
    throw new Error(`Unknown onboarding step: ${stepKey}`);
  }

  const previousStep = onboardingSteps[stepIndex - 1];
  const nextStep = onboardingSteps[stepIndex + 1];

  return {
    stepNumber: stepIndex + 1,
    totalSteps: onboardingSteps.length,
    previousRoute: previousStep?.route,
    forwardLabel: step.forwardLabel,
    forwardRoute: nextStep ? nextStep.route : routes.myEvaluations,
  };
}
