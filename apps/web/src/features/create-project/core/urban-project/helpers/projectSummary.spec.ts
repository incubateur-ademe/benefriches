import { describe, expect, it } from "vitest";

import { WizardFormState } from "../urbanProjectForm.state";
import { getProjectSummary } from "./projectSummary";

describe("getProjectSummary", () => {
  describe("buildingsFootprintToReuse", () => {
    it("should return the buildingsFootprintToReuse value from step payload", () => {
      const steps: WizardFormState["urbanProject"]["steps"] = {
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
      const steps: WizardFormState["urbanProject"]["steps"] = {
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
      const steps: WizardFormState["urbanProject"]["steps"] = {
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

  const DEVELOPER = { name: "La SPL", structureType: "company" as const };

  function makeSteps(
    overrides: Partial<Parameters<typeof getProjectSummary>[0]> = {},
  ): Parameters<typeof getProjectSummary>[0] {
    return {
      URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
        completed: true,
        payload: { projectDeveloper: DEVELOPER },
      },
      ...overrides,
    } as Parameters<typeof getProjectSummary>[0];
  }

  describe("buildingsContractorName", () => {
    it("returns developer name when developerWillBeBuildingsConstructor is true", () => {
      const steps = makeSteps({
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: true },
        },
      });

      const result = getProjectSummary(steps, [
        "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
      ] as Parameters<typeof getProjectSummary>[1]);

      expect(result.buildingsContractorName).toEqual({
        value: "La SPL",
        shouldDisplay: true,
      });
    });

    it("returns undefined name when developerWillBeBuildingsConstructor is false", () => {
      const steps = makeSteps({
        URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER: {
          completed: true,
          payload: { developerWillBeBuildingsConstructor: false },
        },
      });

      const result = getProjectSummary(steps, [
        "URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER",
      ] as Parameters<typeof getProjectSummary>[1]);

      expect(result.buildingsContractorName).toEqual({
        value: undefined,
        shouldDisplay: true,
      });
    });

    it("returns shouldDisplay false when URBAN_PROJECT_STAKEHOLDERS_BUILDINGS_DEVELOPER is not in steps sequence", () => {
      const steps = makeSteps({});

      const result = getProjectSummary(
        steps,
        [] as unknown as Parameters<typeof getProjectSummary>[1],
      );

      expect(result.buildingsContractorName).toEqual({
        value: undefined,
        shouldDisplay: false,
      });
    });
  });

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
