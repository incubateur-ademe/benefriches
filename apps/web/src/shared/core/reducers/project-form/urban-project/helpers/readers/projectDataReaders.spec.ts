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

    it("should extract buildings reuse and construction data", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 500 },
        },
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: {
            existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 300, OFFICES: 200 },
          },
        },
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: {
            newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 400 },
          },
        },
        URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
          completed: true,
          payload: {
            projectDeveloper: { structureType: "company", name: "Dev Corp" },
          },
        },
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
        URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
          completed: true,
          payload: {
            technicalStudiesAndFees: 10000,
            buildingsConstructionWorks: 50000,
            buildingsRehabilitationWorks: 20000,
            otherConstructionExpenses: 5000,
          },
        },
      };

      const result = getProjectData(steps);

      expect(result.buildingsFootprintToReuse).toBe(500);
      expect(result.existingBuildingsUsesFloorSurfaceArea).toEqual({
        RESIDENTIAL: 300,
        OFFICES: 200,
      });
      expect(result.newBuildingsUsesFloorSurfaceArea).toEqual({ RESIDENTIAL: 400 });
      expect(result.developerWillBeBuildingsConstructor).toBe(true);
      expect(result.buildingsConstructionAndRehabilitationExpenses).toEqual([
        { purpose: "technical_studies_and_fees", amount: 10000 },
        { purpose: "buildings_construction_works", amount: 50000 },
        { purpose: "buildings_rehabilitation_works", amount: 20000 },
        { purpose: "other_construction_expenses", amount: 5000 },
      ]);
    });

    it("should return developerWillBeBuildingsConstructor as false when developer is not buildings constructor", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: false },
        },
      };

      const result = getProjectData(steps);

      expect(result.developerWillBeBuildingsConstructor).toBe(false);
    });

    it("should filter out undefined expense fields from construction expenses", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_EXPENSES_BUILDINGS_CONSTRUCTION_AND_REHABILITATION: {
          completed: true,
          payload: {
            technicalStudiesAndFees: 10000,
            otherConstructionExpenses: 5000,
          },
        },
      };

      const result = getProjectData(steps);

      expect(result.buildingsConstructionAndRehabilitationExpenses).toEqual([
        { purpose: "technical_studies_and_fees", amount: 10000 },
        { purpose: "other_construction_expenses", amount: 5000 },
      ]);
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
