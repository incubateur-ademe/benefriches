import { describe, it, expect, beforeEach } from "vitest";

import { mockSiteData } from "@/features/create-project/core/urban-project/__tests__/_siteData.mock";

import { ProjectFormState } from "../../projectForm.reducer";
import { MutateStateHelper } from "./mutateState";

describe("MutateStateHelper", () => {
  let state: ProjectFormState;

  beforeEach(() => {
    state = {
      urbanProject: {
        currentStep: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
        steps: {},
        stepsSequence: [],
        firstSequenceStep: "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION",
        saveState: "idle",
      },
      siteData: mockSiteData,
      siteDataLoadingState: "success",
      siteRelatedLocalAuthorities: { loadingState: "idle" },
    };
  });

  describe("navigateToStep", () => {
    it("should update currentStep to the specified step", () => {
      MutateStateHelper.navigateToStep(state, "URBAN_PROJECT_NAMING");

      expect(state.urbanProject.currentStep).toBe("URBAN_PROJECT_NAMING");
    });

    it("should overwrite existing currentStep", () => {
      state.urbanProject.currentStep = "URBAN_PROJECT_SPACES_CATEGORIES_INTRODUCTION";

      MutateStateHelper.navigateToStep(state, "URBAN_PROJECT_FINAL_SUMMARY");

      expect(state.urbanProject.currentStep).toBe("URBAN_PROJECT_FINAL_SUMMARY");
    });
  });

  describe("ensureStepExists", () => {
    it("should create a new step if it does not exist", () => {
      const result = MutateStateHelper.ensureStepExists(state, "URBAN_PROJECT_NAMING", false);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeDefined();
      expect(result.completed).toBe(false);
    });

    it("should create step with defaultCompleted true when specified", () => {
      const result = MutateStateHelper.ensureStepExists(state, "URBAN_PROJECT_NAMING", true);

      expect(result.completed).toBe(true);
    });

    it("should return existing step without modifying it", () => {
      state.urbanProject.steps.URBAN_PROJECT_NAMING = {
        completed: true,
        payload: { name: "Test", description: "Test" },
      };

      const result = MutateStateHelper.ensureStepExists(state, "URBAN_PROJECT_NAMING", false);

      expect(result.completed).toBe(true);
      expect(result.payload).toEqual({ name: "Test", description: "Test" });
    });
  });

  describe("setDefaultValues", () => {
    it("should set default values for a step", () => {
      const answers = { name: "Default Name", description: "Default Description" };

      MutateStateHelper.setDefaultValues(state, "URBAN_PROJECT_NAMING", answers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.defaultValues).toEqual(answers);
    });

    it("should create step if it does not exist", () => {
      const answers = { name: "Default Name", description: "Default Description" };

      MutateStateHelper.setDefaultValues(state, "URBAN_PROJECT_NAMING", answers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeDefined();
    });

    it("should overwrite existing default values", () => {
      state.urbanProject.steps.URBAN_PROJECT_NAMING = {
        completed: false,
        defaultValues: { name: "Old", description: "Old" },
      };

      const newAnswers = { name: "New", description: "New" };
      MutateStateHelper.setDefaultValues(state, "URBAN_PROJECT_NAMING", newAnswers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.defaultValues).toEqual(newAnswers);
    });
  });

  describe("completeStep", () => {
    it("should mark step as completed and set payload", () => {
      const answers = { name: "Project Name", description: "Project Description" };

      MutateStateHelper.completeStep(state, "URBAN_PROJECT_NAMING", answers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.completed).toBe(true);
      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.payload).toEqual(answers);
    });

    it("should create step if it does not exist", () => {
      const answers = { name: "Project Name", description: "Project Description" };

      MutateStateHelper.completeStep(state, "URBAN_PROJECT_NAMING", answers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeDefined();
    });

    it("should overwrite existing payload", () => {
      state.urbanProject.steps.URBAN_PROJECT_NAMING = {
        completed: false,
        payload: { name: "Old", description: "Old" },
      };

      const newAnswers = { name: "New", description: "New" };
      MutateStateHelper.completeStep(state, "URBAN_PROJECT_NAMING", newAnswers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.payload).toEqual(newAnswers);
      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.completed).toBe(true);
    });
  });

  describe("invalidateStep", () => {
    it("should mark step as not completed and clear data", () => {
      state.urbanProject.steps.URBAN_PROJECT_NAMING = {
        completed: true,
        payload: { name: "Test", description: "Test" },
        defaultValues: { name: "Default", description: "Default" },
      };

      MutateStateHelper.invalidateStep(state, "URBAN_PROJECT_NAMING");

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.completed).toBe(false);
      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.payload).toBeUndefined();
      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING?.defaultValues).toBeUndefined();
    });

    it("should not create step if it does not exist", () => {
      MutateStateHelper.invalidateStep(state, "URBAN_PROJECT_NAMING");
      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeUndefined();
    });
  });

  describe("recomputeStep", () => {
    it("should set step as completed with answers as both payload and defaultValues", () => {
      const answers = { name: "Computed Name", description: "Computed Description" };

      MutateStateHelper.recomputeStep(state, "URBAN_PROJECT_NAMING", answers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toEqual({
        completed: true,
        defaultValues: answers,
        payload: answers,
      });
    });

    it("should completely replace existing step data", () => {
      state.urbanProject.steps.URBAN_PROJECT_NAMING = {
        completed: false,
        payload: { name: "Old", description: "Old" },
      };

      const newAnswers = { name: "New", description: "New" };
      MutateStateHelper.recomputeStep(state, "URBAN_PROJECT_NAMING", newAnswers);

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toEqual({
        completed: true,
        defaultValues: newAnswers,
        payload: newAnswers,
      });
    });
  });

  describe("deleteStep", () => {
    it("should set step to undefined", () => {
      state.urbanProject.steps.URBAN_PROJECT_NAMING = {
        completed: true,
        payload: { name: "Test", description: "Test" },
      };

      MutateStateHelper.deleteStep(state, "URBAN_PROJECT_NAMING");

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeUndefined();
    });

    it("should not throw error if step does not exist", () => {
      expect(() => {
        MutateStateHelper.deleteStep(state, "URBAN_PROJECT_NAMING");
      }).not.toThrow();

      expect(state.urbanProject.steps.URBAN_PROJECT_NAMING).toBeUndefined();
    });
  });
});
