import { describe, it, expect } from "vitest";

import { ProjectFormState } from "../../projectForm.reducer";
import { getProjectSummary } from "./projectSummary";

describe("getProjectSummary", () => {
  describe("buildingsFootprintToReuse", () => {
    it("should return the buildingsFootprintToReuse value from step payload", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_BUILDINGS_FOOTPRINT_TO_REUSE: {
          completed: true,
          payload: { buildingsFootprintToReuse: 1500 },
        },
      };

      const result = getProjectSummary(steps, []);

      expect(result.buildingsFootprintToReuse.value).toBe(1500);
    });

    it("should return undefined when step has no payload", () => {
      const result = getProjectSummary({}, []);

      expect(result.buildingsFootprintToReuse.value).toBeUndefined();
    });
  });

  describe("existingBuildingsUsesFloorSurfaceArea", () => {
    it("should return the existingBuildingsUsesFloorSurfaceArea value from step payload", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_BUILDINGS_EXISTING_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { existingBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 1200, OFFICES: 300 } },
        },
      };

      const result = getProjectSummary(steps, []);

      expect(result.existingBuildingsUsesFloorSurfaceArea.value).toEqual({
        RESIDENTIAL: 1200,
        OFFICES: 300,
      });
    });

    it("should return undefined when step has no payload", () => {
      const result = getProjectSummary({}, []);

      expect(result.existingBuildingsUsesFloorSurfaceArea.value).toBeUndefined();
    });
  });

  describe("newBuildingsUsesFloorSurfaceArea", () => {
    it("should return the newBuildingsUsesFloorSurfaceArea value from step payload", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_BUILDINGS_NEW_BUILDINGS_USES_FLOOR_SURFACE_AREA: {
          completed: true,
          payload: { newBuildingsUsesFloorSurfaceArea: { RESIDENTIAL: 800, OFFICES: 200 } },
        },
      };

      const result = getProjectSummary(steps, []);

      expect(result.newBuildingsUsesFloorSurfaceArea.value).toEqual({
        RESIDENTIAL: 800,
        OFFICES: 200,
      });
    });

    it("should return undefined when step has no payload", () => {
      const result = getProjectSummary({}, []);

      expect(result.newBuildingsUsesFloorSurfaceArea.value).toBeUndefined();
    });
  });
});
