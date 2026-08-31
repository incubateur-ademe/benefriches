import {
  CUSTOM_ANSWER_STEP_IDS,
  CUSTOM_INFO_STEP_IDS,
} from "@/features/create-site/core/custom/customSteps";

import { customStepToComponent } from "./stepToComponent";

describe("customStepToComponent", () => {
  it("maps every custom step id to a step view, with no missing and no extra entry", () => {
    // Arrange
    const expectedStepIds = [...CUSTOM_INFO_STEP_IDS, ...CUSTOM_ANSWER_STEP_IDS].slice().sort();

    // Act
    const mappedStepIds = Object.keys(customStepToComponent).slice().sort();

    // Assert
    expect(mappedStepIds).toEqual(expectedStepIds);
  });
});
