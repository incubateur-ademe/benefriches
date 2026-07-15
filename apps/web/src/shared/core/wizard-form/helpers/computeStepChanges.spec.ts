import { describe, it, expect } from "vitest";

import { AnswerStepHandlerRegistry, StepInvalidationRule } from "../stepHandler.type";
import { computeStepChanges } from "./computeStepChanges";

type TestStepId = "STEP_A" | "STEP_B" | "STEP_C" | "STEP_D" | "STEP_NEXT";
type TestAnswers = {
  STEP_A: { value: string };
  STEP_B: { value: number };
  STEP_C: { value: number };
  STEP_D: { value: number };
};

function makeRegistry(
  overrides: Partial<AnswerStepHandlerRegistry<TestStepId, undefined, TestAnswers>>,
): AnswerStepHandlerRegistry<TestStepId, undefined, TestAnswers> {
  return {
    STEP_A: { stepId: "STEP_A", getNextStepId: () => "STEP_NEXT" },
    STEP_B: { stepId: "STEP_B", getNextStepId: () => "STEP_NEXT" },
    STEP_C: { stepId: "STEP_C", getNextStepId: () => "STEP_NEXT" },
    STEP_D: { stepId: "STEP_D", getNextStepId: () => "STEP_NEXT" },
    ...overrides,
  };
}

describe("computeStepChanges", () => {
  it("should return dependency rules from the completed step", () => {
    const rules: StepInvalidationRule<keyof TestAnswers>[] = [
      { stepId: "STEP_B", action: "invalidate" },
    ];
    const registry = makeRegistry({
      STEP_A: {
        stepId: "STEP_A",
        getNextStepId: () => "STEP_NEXT",
        getDependencyRules: () => rules,
      },
    });

    const result = computeStepChanges(
      registry,
      undefined,
      {},
      { stepId: "STEP_A", answers: { value: "foo" } },
    );

    expect(result.cascadingChanges).toEqual(rules);
  });

  it("should merge shortcut-completed step's dependency rules into cascading changes", () => {
    // Step A has dependency rules targeting step D (invalidate), and a shortcut that completes
    // step B. Step B has its own dependency rules targeting step C (delete).
    // Expected: cascading changes contain rules for both D and C.
    const registry = makeRegistry({
      STEP_A: {
        stepId: "STEP_A",
        getNextStepId: () => "STEP_NEXT",
        getDependencyRules: () => [{ stepId: "STEP_D", action: "invalidate" }],
        getShortcut: () => ({
          complete: [{ stepId: "STEP_B", answers: { value: 1 } }],
          next: "STEP_NEXT",
        }),
      },
      STEP_B: {
        stepId: "STEP_B",
        getNextStepId: () => "STEP_NEXT",
        getDependencyRules: () => [{ stepId: "STEP_C", action: "delete" }],
      },
    });

    const result = computeStepChanges(
      registry,
      undefined,
      {},
      { stepId: "STEP_A", answers: { value: "foo" } },
    );

    expect(result.cascadingChanges).toEqual(
      expect.arrayContaining([
        { stepId: "STEP_D", action: "invalidate" },
        { stepId: "STEP_C", action: "delete" },
      ]),
    );
    expect(result.cascadingChanges).toHaveLength(2);
  });

  it("should remove rules targeting shortcut-completed steps", () => {
    // Step A's dependency rules target both step B (invalidate) and step D (invalidate). Step A
    // also has a shortcut that completes step B directly.
    // Expected: the invalidation rule for B is dropped since B is already completed by the shortcut.
    const registry = makeRegistry({
      STEP_A: {
        stepId: "STEP_A",
        getNextStepId: () => "STEP_NEXT",
        getDependencyRules: () => [
          { stepId: "STEP_B", action: "invalidate" },
          { stepId: "STEP_D", action: "invalidate" },
        ],
        getShortcut: () => ({
          complete: [{ stepId: "STEP_B", answers: { value: 1 } }],
          next: "STEP_NEXT",
        }),
      },
    });

    const result = computeStepChanges(
      registry,
      undefined,
      {},
      { stepId: "STEP_A", answers: { value: "foo" } },
    );

    expect(result.cascadingChanges).toEqual([{ stepId: "STEP_D", action: "invalidate" }]);
  });

  it("should prefer shortcut step's rules when both target the same step", () => {
    // Step A invalidates step D. The shortcut completes step B, whose own dependency rules
    // delete step D. Expected: step D ends up "delete" (from B's rule), not "invalidate".
    const registry = makeRegistry({
      STEP_A: {
        stepId: "STEP_A",
        getNextStepId: () => "STEP_NEXT",
        getDependencyRules: () => [{ stepId: "STEP_D", action: "invalidate" }],
        getShortcut: () => ({
          complete: [{ stepId: "STEP_B", answers: { value: 1 } }],
          next: "STEP_NEXT",
        }),
      },
      STEP_B: {
        stepId: "STEP_B",
        getNextStepId: () => "STEP_NEXT",
        getDependencyRules: () => [{ stepId: "STEP_D", action: "delete" }],
      },
    });

    const result = computeStepChanges(
      registry,
      undefined,
      {},
      { stepId: "STEP_A", answers: { value: "foo" } },
    );

    expect(result.cascadingChanges).toEqual([{ stepId: "STEP_D", action: "delete" }]);
  });
});
