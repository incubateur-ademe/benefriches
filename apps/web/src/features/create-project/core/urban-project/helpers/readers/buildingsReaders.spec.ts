import { describe, it, expect } from "vitest";

import type { UrbanProjectStepsState } from "../../urbanProject.state";
import {
  getProjectBuildingsFootprint,
  hasBuildingsResalePlannedAfterDevelopment,
  hasSelectedUseWithBuildings,
  willHaveBuildings,
} from "./buildingsReaders";

describe("buildingsReaders", () => {
  describe("willHaveBuildings", () => {
    it("should return true when a use with buildings is selected and the buildings footprint is above 0", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 7000 },
          },
        },
      };

      expect(willHaveBuildings(steps)).toBe(true);
    });

    it("should return false when a use with buildings is selected but the buildings footprint is 0", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 10000 } },
        },
      };

      expect(willHaveBuildings(steps)).toBe(false);
    });

    it("should return false when no selected use includes buildings, whatever the footprint", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
        },
      };

      expect(willHaveBuildings(steps)).toBe(false);
    });

    it("should return false when uses selection step does not exist", () => {
      expect(willHaveBuildings({})).toBe(false);
    });
  });

  describe("hasSelectedUseWithBuildings", () => {
    it("should return true as soon as a selected use includes buildings, with no surface area entered", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      };

      expect(hasSelectedUseWithBuildings(steps)).toBe(true);
    });

    it("should return false when every selected use is a non-building use", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES"] },
        },
      };

      expect(hasSelectedUseWithBuildings(steps)).toBe(false);
    });
  });

  describe("getProjectBuildingsFootprint", () => {
    it("returns BUILDINGS from spaces step", () => {
      const stepsState: UrbanProjectStepsState = {
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { BUILDINGS: 3000 } },
        },
      };
      expect(getProjectBuildingsFootprint(stepsState)).toBe(3000);
    });

    it("returns 0 when spaces step has no BUILDINGS", () => {
      const stepsState: UrbanProjectStepsState = {
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: { spacesSurfaceAreaDistribution: { IMPERMEABLE_SOILS: 1000 } },
        },
      };
      expect(getProjectBuildingsFootprint(stepsState)).toBe(0);
    });
  });

  describe("hasBuildingsResalePlannedAfterDevelopment", () => {
    it("should return true when buildings resale is planned", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      const result = hasBuildingsResalePlannedAfterDevelopment(steps);

      expect(result).toBe(true);
    });

    it("should return false when buildings resale is not planned", () => {
      const steps: UrbanProjectStepsState = {
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: false,
          },
        },
      };

      const result = hasBuildingsResalePlannedAfterDevelopment(steps);

      expect(result).toBe(false);
    });

    it("should return undefined if no answers exists for URBAN_PROJECT_BUILDINGS_RESALE_SELECTION", () => {
      expect(hasBuildingsResalePlannedAfterDevelopment({})).toBe(undefined);
    });
  });
});
