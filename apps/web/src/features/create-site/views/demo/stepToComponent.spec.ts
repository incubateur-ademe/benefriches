import {
  ANSWER_STEP_IDS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
} from "@/features/create-site/core/demo/demoSteps";

import { demoStepToComponent } from "./stepToComponent";

describe("demoStepToComponent", () => {
  it("maps every demo step id to a step view, with no missing and no extra entry", () => {
    // Arrange
    const expectedStepIds = [...INTRODUCTION_STEPS, ...SUMMARY_STEPS, ...ANSWER_STEP_IDS]
      .slice()
      .sort();

    // Act
    const mappedStepIds = Object.keys(demoStepToComponent).slice().sort();

    // Assert
    expect(mappedStepIds).toEqual(expectedStepIds);
  });
});
