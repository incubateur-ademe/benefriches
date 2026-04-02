import { describe, it, expect } from "vitest";

import { ProjectFormState } from "../../../projectForm.reducer";
import { getProjectData } from "./projectDataReaders";

describe("projectDataReaders", () => {
  describe("getProjectData", () => {
    it("should extract and structure all project data correctly", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: true,
          payload: { name: "Test Project", description: "Description" },
        },
        URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
          completed: true,
          payload: {
            projectDeveloper: { structureType: "company", name: "Dev Corp" },
          },
        },
      };

      const result = getProjectData(steps);

      expect(result.name).toBe("Test Project");
      expect(result.description).toBe("Description");
      expect(result.developmentPlan?.developer).toEqual({
        structureType: "company",
        name: "Dev Corp",
      });
    });

    it("should handle missing optional data", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {};

      const result = getProjectData(steps);

      expect(result.name).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.yearlyProjectedCosts).toEqual([]);
      expect(result.yearlyProjectedRevenues).toEqual([]);
    });
  });
});
