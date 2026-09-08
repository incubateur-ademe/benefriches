import type { Link } from "type-route";
import { z } from "zod";

import { routes } from "@/app/router";

import type { OnboardingVariant } from "./onboardingVariant";

export const onboardingStepKeySchema = z.enum(["welcome", "methodology", "testimonials"]);
export type OnboardingStepKey = z.infer<typeof onboardingStepKeySchema>;

type OnboardingStepRoute =
  | typeof routes.onBoardingWelcome
  | typeof routes.onBoardingMethodology
  | typeof routes.onBoardingTestimonials;

type OnboardingStepDefinition = {
  key: OnboardingStepKey;
  route: OnboardingStepRoute;
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
  previousLinkProps: Link | undefined;
  forwardLabel: "Suivant" | "Commencer";
  forwardLinkProps: Link;
};

function getFlowExitLink(variant?: OnboardingVariant): Link {
  if (variant === "evaluation-impacts") {
    return routes.createSite({ evaluationMode: "impacts" }).link;
  }
  if (variant === "evaluation-mutabilite") {
    return routes.evaluateReconversionCompatibility().link;
  }
  return routes.myEvaluations().link;
}

export function getOnboardingStepInfo(
  stepKey: OnboardingStepKey,
  variant?: OnboardingVariant,
): OnboardingStepInfo {
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
    previousLinkProps: previousStep
      ? previousStep.route({ fonctionnalite: variant }).link
      : undefined,
    forwardLabel: step.forwardLabel,
    forwardLinkProps: nextStep
      ? nextStep.route({ fonctionnalite: variant }).link
      : getFlowExitLink(variant),
  };
}
