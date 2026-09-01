import { describe, expect, it } from "vitest";

import { AnswerStepHandlerRegistry } from "../stepHandler.type";
import {
  ApplyStepChangesConfig,
  applyStepChanges,
  MutableWizardFormSubState,
} from "./applyStepChanges";
import { StepRegistry } from "./navigateToStep";

// Group GROUP_A: STEP_A1 -> STEP_A2. Group GROUP_B: STEP_B1.
type TestStepId = "STEP_A1" | "STEP_A2" | "STEP_B1";
type TestAnswers = {
  STEP_A1: { value: string };
  STEP_A2: { value: string };
  STEP_B1: { value: string };
};
type TestGroupId = "GROUP_A" | "GROUP_B";

const GROUP_OF: Record<TestStepId, TestGroupId> = {
  STEP_A1: "GROUP_A",
  STEP_A2: "GROUP_A",
  STEP_B1: "GROUP_B",
};

const answerRegistry: AnswerStepHandlerRegistry<TestStepId, undefined, TestAnswers> = {
  STEP_A1: { stepId: "STEP_A1", getNextStepId: () => "STEP_A2" },
  STEP_A2: { stepId: "STEP_A2", getNextStepId: () => "STEP_B1" },
  STEP_B1: { stepId: "STEP_B1", getNextStepId: () => "STEP_B1" },
};

const registry: StepRegistry<TestStepId, undefined, TestAnswers> = answerRegistry;

// Simulates a fully-hydrated form: every step already marked completed, as after loading an
// existing site into the update wizard (see updateSite.reducer.ts, ticket 10 QA report defect 3).
function makeFullyCompletedForm(
  currentStep: TestStepId,
): MutableWizardFormSubState<TestStepId, TestAnswers> {
  return {
    currentStep,
    steps: {
      STEP_A1: { completed: true, payload: { value: "a1" } },
      STEP_A2: { completed: true, payload: { value: "a2" } },
      STEP_B1: { completed: true, payload: { value: "b1" } },
    },
    saveState: "idle",
    stepsSequence: ["STEP_A1", "STEP_A2", "STEP_B1"],
    firstSequenceStep: "STEP_A1",
  };
}

const baseConfig: ApplyStepChangesConfig<TestStepId> = {
  nextMode: "next_empty",
  finalSummaryFallbackStep: "STEP_B1",
};

describe("applyStepChanges — next_empty with groupOf", () => {
  it("without groupOf, completing a step of an already fully-answered form always falls back to the summary", () => {
    const form = makeFullyCompletedForm("STEP_A1");

    applyStepChanges(
      form,
      undefined,
      { payload: { stepId: "STEP_A1", answers: { value: "a1" } }, navigationTarget: "STEP_A2" },
      registry,
      answerRegistry,
      baseConfig,
    );

    expect(form.currentStep).toBe("STEP_B1");
  });

  it("with groupOf, completing a step whose next step is in the same group navigates there instead of the summary", () => {
    const form = makeFullyCompletedForm("STEP_A1");

    applyStepChanges(
      form,
      undefined,
      { payload: { stepId: "STEP_A1", answers: { value: "a1" } }, navigationTarget: "STEP_A2" },
      registry,
      answerRegistry,
      { ...baseConfig, groupOf: (stepId) => GROUP_OF[stepId] },
    );

    expect(form.currentStep).toBe("STEP_A2");
  });

  it("with groupOf, completing the group's last step falls back to the summary once the next step leaves the group", () => {
    const form = makeFullyCompletedForm("STEP_A2");

    applyStepChanges(
      form,
      undefined,
      { payload: { stepId: "STEP_A2", answers: { value: "a2" } }, navigationTarget: "STEP_B1" },
      registry,
      answerRegistry,
      { ...baseConfig, groupOf: (stepId) => GROUP_OF[stepId] },
    );

    expect(form.currentStep).toBe("STEP_B1");
  });
});
