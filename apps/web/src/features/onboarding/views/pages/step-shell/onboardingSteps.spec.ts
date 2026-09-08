import { describe, expect, it } from "vitest";

import { routes } from "@/app/router";

import { getOnboardingStepInfo } from "./onboardingSteps";

describe("getOnboardingStepInfo", () => {
  it("returns no previous link and a Suivant forward link pointing to methodology for the welcome step with no variant", () => {
    const stepInfo = getOnboardingStepInfo("welcome");

    expect({
      stepNumber: stepInfo.stepNumber,
      totalSteps: stepInfo.totalSteps,
      previousHref: stepInfo.previousLinkProps?.href,
      forwardLabel: stepInfo.forwardLabel,
      forwardHref: stepInfo.forwardLinkProps.href,
    }).toEqual({
      stepNumber: 1,
      totalSteps: 3,
      previousHref: undefined,
      forwardLabel: "Suivant",
      forwardHref: routes.onBoardingMethodology({}).link.href,
    });
  });

  it("returns welcome as previous link and a Suivant forward link pointing to testimonials for the methodology step with no variant", () => {
    const stepInfo = getOnboardingStepInfo("methodology");

    expect({
      stepNumber: stepInfo.stepNumber,
      totalSteps: stepInfo.totalSteps,
      previousHref: stepInfo.previousLinkProps?.href,
      forwardLabel: stepInfo.forwardLabel,
      forwardHref: stepInfo.forwardLinkProps.href,
    }).toEqual({
      stepNumber: 2,
      totalSteps: 3,
      previousHref: routes.onBoardingWelcome({}).link.href,
      forwardLabel: "Suivant",
      forwardHref: routes.onBoardingTestimonials({}).link.href,
    });
  });

  it("returns methodology as previous link and a Commencer forward link pointing to my evaluations for the testimonials step with no variant", () => {
    const stepInfo = getOnboardingStepInfo("testimonials");

    expect({
      stepNumber: stepInfo.stepNumber,
      totalSteps: stepInfo.totalSteps,
      previousHref: stepInfo.previousLinkProps?.href,
      forwardLabel: stepInfo.forwardLabel,
      forwardHref: stepInfo.forwardLinkProps.href,
    }).toEqual({
      stepNumber: 3,
      totalSteps: 3,
      previousHref: routes.onBoardingMethodology({}).link.href,
      forwardLabel: "Commencer",
      forwardHref: routes.myEvaluations().link.href,
    });
  });

  it("carries the fonctionnalite variant through to the forward link between steps", () => {
    const stepInfo = getOnboardingStepInfo("welcome", "evaluation-mutabilite");

    expect(stepInfo.forwardLinkProps.href).toEqual(
      routes.onBoardingMethodology({ fonctionnalite: "evaluation-mutabilite" }).link.href,
    );
  });

  it("resolves the Commencer destination to the impacts site creation form for the evaluation-impacts variant", () => {
    const stepInfo = getOnboardingStepInfo("testimonials", "evaluation-impacts");

    expect(stepInfo.forwardLinkProps.href).toEqual(
      routes.createSite({ evaluationMode: "impacts" }).link.href,
    );
  });

  it("resolves the Commencer destination to the compatibility evaluation page for the evaluation-mutabilite variant", () => {
    const stepInfo = getOnboardingStepInfo("testimonials", "evaluation-mutabilite");

    expect(stepInfo.forwardLinkProps.href).toEqual(
      routes.evaluateReconversionCompatibility().link.href,
    );
  });
});
