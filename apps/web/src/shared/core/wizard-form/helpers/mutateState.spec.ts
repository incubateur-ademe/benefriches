import { describe, it, expect, beforeEach } from "vitest";

import { MutableWizardFormState, MutateStateHelper } from "./mutateState";

type TestStepId = "STEP_A" | "STEP_B" | "STEP_C";
type TestAnswers = {
  STEP_A: { name: string; description: string };
  STEP_B: { name: string; description: string };
};

describe("MutateStateHelper", () => {
  let form: MutableWizardFormState<TestStepId, TestAnswers>;

  beforeEach(() => {
    form = {
      currentStep: "STEP_C",
      steps: {},
    };
  });

  describe("navigateToStep", () => {
    it("should update currentStep to the specified step", () => {
      MutateStateHelper.navigateToStep(form, "STEP_A");

      expect(form.currentStep).toBe("STEP_A");
    });

    it("should overwrite existing currentStep", () => {
      form.currentStep = "STEP_A";

      MutateStateHelper.navigateToStep(form, "STEP_B");

      expect(form.currentStep).toBe("STEP_B");
    });
  });

  describe("ensureStepExists", () => {
    it("should create a new step if it does not exist", () => {
      const result = MutateStateHelper.ensureStepExists(form, "STEP_A", false);

      expect(form.steps.STEP_A).toBeDefined();
      expect(result.completed).toBe(false);
    });

    it("should create step with defaultCompleted true when specified", () => {
      const result = MutateStateHelper.ensureStepExists(form, "STEP_A", true);

      expect(result.completed).toBe(true);
    });

    it("should return existing step without modifying it", () => {
      form.steps.STEP_A = {
        completed: true,
        payload: { name: "Test", description: "Test" },
      };

      const result = MutateStateHelper.ensureStepExists(form, "STEP_A", false);

      expect(result.completed).toBe(true);
      expect(result.payload).toEqual({ name: "Test", description: "Test" });
    });
  });

  describe("setDefaultValues", () => {
    it("should set default values for a step", () => {
      const answers = { name: "Default Name", description: "Default Description" };

      MutateStateHelper.setDefaultValues(form, "STEP_A", answers);

      expect(form.steps.STEP_A?.defaultValues).toEqual(answers);
    });

    it("should create step if it does not exist", () => {
      const answers = { name: "Default Name", description: "Default Description" };

      MutateStateHelper.setDefaultValues(form, "STEP_A", answers);

      expect(form.steps.STEP_A).toBeDefined();
    });

    it("should overwrite existing default values", () => {
      form.steps.STEP_A = {
        completed: false,
        defaultValues: { name: "Old", description: "Old" },
      };

      const newAnswers = { name: "New", description: "New" };
      MutateStateHelper.setDefaultValues(form, "STEP_A", newAnswers);

      expect(form.steps.STEP_A?.defaultValues).toEqual(newAnswers);
    });
  });

  describe("completeStep", () => {
    it("should mark step as completed and set payload", () => {
      const answers = { name: "Project Name", description: "Project Description" };

      MutateStateHelper.completeStep(form, "STEP_A", answers);

      expect(form.steps.STEP_A?.completed).toBe(true);
      expect(form.steps.STEP_A?.payload).toEqual(answers);
    });

    it("should create step if it does not exist", () => {
      const answers = { name: "Project Name", description: "Project Description" };

      MutateStateHelper.completeStep(form, "STEP_A", answers);

      expect(form.steps.STEP_A).toBeDefined();
    });

    it("should overwrite existing payload", () => {
      form.steps.STEP_A = {
        completed: false,
        payload: { name: "Old", description: "Old" },
      };

      const newAnswers = { name: "New", description: "New" };
      MutateStateHelper.completeStep(form, "STEP_A", newAnswers);

      expect(form.steps.STEP_A?.payload).toEqual(newAnswers);
      expect(form.steps.STEP_A?.completed).toBe(true);
    });
  });

  describe("invalidateStep", () => {
    it("should mark step as not completed and clear data", () => {
      form.steps.STEP_A = {
        completed: true,
        payload: { name: "Test", description: "Test" },
        defaultValues: { name: "Default", description: "Default" },
      };

      MutateStateHelper.invalidateStep(form, "STEP_A");

      expect(form.steps.STEP_A?.completed).toBe(false);
      expect(form.steps.STEP_A?.payload).toBeUndefined();
      expect(form.steps.STEP_A?.defaultValues).toBeUndefined();
    });

    it("should not create step if it does not exist", () => {
      MutateStateHelper.invalidateStep(form, "STEP_A");
      expect(form.steps.STEP_A).toBeUndefined();
    });
  });

  describe("recomputeStep", () => {
    it("should set step as completed with answers as both payload and defaultValues", () => {
      const answers = { name: "Computed Name", description: "Computed Description" };

      MutateStateHelper.recomputeStep(form, "STEP_A", answers);

      expect(form.steps.STEP_A).toEqual({
        completed: true,
        defaultValues: answers,
        payload: answers,
      });
    });

    it("should completely replace existing step data", () => {
      form.steps.STEP_A = {
        completed: false,
        payload: { name: "Old", description: "Old" },
      };

      const newAnswers = { name: "New", description: "New" };
      MutateStateHelper.recomputeStep(form, "STEP_A", newAnswers);

      expect(form.steps.STEP_A).toEqual({
        completed: true,
        defaultValues: newAnswers,
        payload: newAnswers,
      });
    });
  });

  describe("deleteStep", () => {
    it("should set step to undefined", () => {
      form.steps.STEP_A = {
        completed: true,
        payload: { name: "Test", description: "Test" },
      };

      MutateStateHelper.deleteStep(form, "STEP_A");

      expect(form.steps.STEP_A).toBeUndefined();
    });

    it("should not throw error if step does not exist", () => {
      expect(() => {
        MutateStateHelper.deleteStep(form, "STEP_A");
      }).not.toThrow();

      expect(form.steps.STEP_A).toBeUndefined();
    });
  });

  describe("completeStepFromPayload", () => {
    it("should mark step as completed and set payload from bundled payload", () => {
      MutateStateHelper.completeStepFromPayload(form, {
        stepId: "STEP_A",
        answers: { name: "Project Name", description: "Project Description" },
      });

      expect(form.steps.STEP_A).toEqual({
        completed: true,
        payload: { name: "Project Name", description: "Project Description" },
      });
    });

    it("should create step if it does not exist", () => {
      MutateStateHelper.completeStepFromPayload(form, {
        stepId: "STEP_A",
        answers: { name: "Test", description: "Test" },
      });

      expect(form.steps.STEP_A).toBeDefined();
    });
  });
});
