import { describe, it, expect } from "vitest";

import { getProjectSummary } from "./projectSummary";

describe("getProjectSummary", () => {
  describe("projectPhase", () => {
    it("should include the project phase when provided", () => {
      const result = getProjectSummary({}, [], "construction");

      expect(result.projectPhase.value).toBe("construction");
    });

    it("should have undefined value when projectPhase is not provided", () => {
      const result = getProjectSummary({}, []);

      expect(result.projectPhase.value).toBeUndefined();
    });
  });
});
