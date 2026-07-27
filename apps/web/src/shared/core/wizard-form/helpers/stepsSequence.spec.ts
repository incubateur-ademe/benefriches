import { describe, expect, it } from "vitest";

import {
  AnswerStepHandlerRegistry,
  InfoStepHandler,
  WizardFormStepsState,
} from "../stepHandler.type";
import { computeStepsSequence } from "./stepsSequence";

type TestStepId = "STEP_A" | "STEP_BRANCH" | "STEP_END";
type TestAnswers = {
  STEP_A: { takeBranch: boolean };
  STEP_BRANCH: { value: number };
};

// STEP_A branches on its own answer — the same shape as the wizards' real branching steps
// (site purchase, uses selection): the second parameter carries the step's answers.
const registry: AnswerStepHandlerRegistry<TestStepId, undefined, TestAnswers> & {
  STEP_END: InfoStepHandler<TestStepId, "STEP_END", undefined, TestAnswers>;
} = {
  STEP_A: {
    stepId: "STEP_A",
    getNextStepId: (_params, answers) => (answers?.takeBranch ? "STEP_BRANCH" : "STEP_END"),
  },
  STEP_BRANCH: { stepId: "STEP_BRANCH", getNextStepId: () => "STEP_END" },
  STEP_END: { stepId: "STEP_END" },
};

describe("computeStepsSequence", () => {
  it("walks into the branch selected by an already-answered step", () => {
    const answers: WizardFormStepsState<TestAnswers> = {
      STEP_A: { completed: true, payload: { takeBranch: true } },
    };

    const sequence = computeStepsSequence({ context: undefined, answers }, "STEP_A", registry);

    expect(sequence).toEqual(["STEP_A", "STEP_BRANCH", "STEP_END"]);
  });

  it("skips the branch when the answered step did not select it", () => {
    const answers: WizardFormStepsState<TestAnswers> = {
      STEP_A: { completed: true, payload: { takeBranch: false } },
    };

    const sequence = computeStepsSequence({ context: undefined, answers }, "STEP_A", registry);

    expect(sequence).toEqual(["STEP_A", "STEP_END"]);
  });

  it("skips the branch when the step has not been answered yet", () => {
    const sequence = computeStepsSequence({ context: undefined, answers: {} }, "STEP_A", registry);

    expect(sequence).toEqual(["STEP_A", "STEP_END"]);
  });
});
