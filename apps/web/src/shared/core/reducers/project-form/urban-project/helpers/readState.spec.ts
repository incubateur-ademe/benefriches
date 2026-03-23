import { describe, it, expect } from "vitest";

import { ProjectFormState } from "../../projectForm.reducer";
import { ReadStateHelper } from "./readState";

describe("ReadStateHelper", () => {
  describe("getStep", () => {
    it("should return the step when it exists", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: true,
          payload: { name: "Test Project", description: "Test Description" },
        },
      };

      const result = ReadStateHelper.getStep(steps, "URBAN_PROJECT_NAMING");

      expect(result).toEqual({
        completed: true,
        payload: { name: "Test Project", description: "Test Description" },
      });
    });

    it("should return undefined when step does not exist", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {};

      const result = ReadStateHelper.getStep(steps, "URBAN_PROJECT_NAMING");

      expect(result).toBeUndefined();
    });
  });

  describe("getStepAnswers", () => {
    it("should return the payload when step exists", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: true,
          payload: { name: "Test Project", description: "Test Description" },
        },
      };

      const result = ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_NAMING");

      expect(result).toEqual({ name: "Test Project", description: "Test Description" });
    });

    it("should return undefined when step has no payload", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: false,
        },
      };

      const result = ReadStateHelper.getStepAnswers(steps, "URBAN_PROJECT_NAMING");

      expect(result).toBeUndefined();
    });
  });

  describe("getDefaultAnswers", () => {
    it("should return default values when they exist", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: true,
          defaultValues: { name: "Default Name", description: "Default Description" },
        },
      };

      const result = ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_NAMING");

      expect(result).toEqual({ name: "Default Name", description: "Default Description" });
    });

    it("should return undefined when no default values exist", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: true,
        },
      };

      const result = ReadStateHelper.getDefaultAnswers(steps, "URBAN_PROJECT_NAMING");

      expect(result).toBeUndefined();
    });
  });
});
