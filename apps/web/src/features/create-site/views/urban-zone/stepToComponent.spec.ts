import {
  ANSWER_STEP_IDS,
  INTRODUCTION_STEPS,
  SUMMARY_STEPS,
} from "@/features/create-site/core/urban-zone/urbanZoneSteps";

import { urbanZoneStepToComponent } from "./stepToComponent";

describe("urbanZoneStepToComponent", () => {
  it("maps every urban-zone step id, including the generated per-parcel ids, to a step view", () => {
    // Arrange: ANSWER_STEP_IDS already includes the 8 per-parcel step ids (ADR-0008's static
    // source of truth); the per-parcel half of the map itself is built programmatically (see
    // stepToComponent.tsx), so its coverage isn't provable at the type level — this is the
    // runtime guard for it.
    const expectedStepIds = [...INTRODUCTION_STEPS, ...SUMMARY_STEPS, ...ANSWER_STEP_IDS]
      .slice()
      .sort();

    // Act
    const mappedStepIds = Object.keys(urbanZoneStepToComponent).slice().sort();

    // Assert
    expect(mappedStepIds).toEqual(expectedStepIds);
  });
});
