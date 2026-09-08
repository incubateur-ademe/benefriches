import { describe, expect, it } from "vitest";

import { routes } from "@/app/router";

import { getOnboardingStepInfo } from "./onboardingSteps";

describe("getOnboardingStepInfo", () => {
  it("returns no previous route and a Suivant forward button pointing to methodology for the welcome step", () => {
    const stepInfo = getOnboardingStepInfo("welcome");

    expect(stepInfo).toEqual({
      stepNumber: 1,
      totalSteps: 3,
      previousRoute: undefined,
      forwardLabel: "Suivant",
      forwardRoute: routes.onBoardingMethodology,
    });
  });

  it("returns welcome as previous route and a Suivant forward button pointing to testimonials for the methodology step", () => {
    const stepInfo = getOnboardingStepInfo("methodology");

    expect(stepInfo).toEqual({
      stepNumber: 2,
      totalSteps: 3,
      previousRoute: routes.onBoardingWelcome,
      forwardLabel: "Suivant",
      forwardRoute: routes.onBoardingTestimonials,
    });
  });

  it("returns methodology as previous route and a Commencer forward button pointing to my evaluations for the testimonials step", () => {
    const stepInfo = getOnboardingStepInfo("testimonials");

    expect(stepInfo).toEqual({
      stepNumber: 3,
      totalSteps: 3,
      previousRoute: routes.onBoardingMethodology,
      forwardLabel: "Commencer",
      forwardRoute: routes.myEvaluations,
    });
  });
});
