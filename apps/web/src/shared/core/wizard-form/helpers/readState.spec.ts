import { describe, it, expect } from "vitest";

import { WizardFormStepsState } from "../stepHandler.type";
import { ReadStateHelper } from "./readState";

type TestAnswers = {
  NAMING: { name: string; description: string };
};

describe("ReadStateHelper", () => {
  describe("getStep", () => {
    it("should return the step when it exists", () => {
      const steps: WizardFormStepsState<TestAnswers> = {
        NAMING: {
          completed: true,
          payload: { name: "Test Name", description: "Test Info" },
        },
      };

      const result = ReadStateHelper.getStep(steps, "NAMING");

      expect(result).toEqual({
        completed: true,
        payload: { name: "Test Name", description: "Test Info" },
      });
    });

    it("should return undefined when step does not exist", () => {
      const steps: WizardFormStepsState<TestAnswers> = {};

      const result = ReadStateHelper.getStep(steps, "NAMING");

      expect(result).toBeUndefined();
    });
  });

  describe("getStepAnswers", () => {
    it("should return the payload when step exists", () => {
      const steps: WizardFormStepsState<TestAnswers> = {
        NAMING: {
          completed: true,
          payload: { name: "Test Name", description: "Test Info" },
        },
      };

      const result = ReadStateHelper.getStepAnswers(steps, "NAMING");

      expect(result).toEqual({ name: "Test Name", description: "Test Info" });
    });

    it("should return undefined when step has no payload", () => {
      const steps: WizardFormStepsState<TestAnswers> = {
        NAMING: {
          completed: false,
        },
      };

      const result = ReadStateHelper.getStepAnswers(steps, "NAMING");

      expect(result).toBeUndefined();
    });
  });

  describe("getDefaultAnswers", () => {
    it("should return default values when they exist", () => {
      const steps: WizardFormStepsState<TestAnswers> = {
        NAMING: {
          completed: true,
          defaultValues: { name: "Default Name", description: "Default Description" },
        },
      };

      const result = ReadStateHelper.getDefaultAnswers(steps, "NAMING");

      expect(result).toEqual({ name: "Default Name", description: "Default Description" });
    });

    it("should return undefined when no default values exist", () => {
      const steps: WizardFormStepsState<TestAnswers> = {
        NAMING: {
          completed: true,
        },
      };

      const result = ReadStateHelper.getDefaultAnswers(steps, "NAMING");

      expect(result).toBeUndefined();
    });
  });
});
