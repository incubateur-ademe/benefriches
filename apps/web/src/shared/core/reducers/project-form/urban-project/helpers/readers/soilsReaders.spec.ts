import { describe, it, expect } from "vitest";

import { ProjectFormState } from "../../../projectForm.reducer";
import { getProjectSoilDistribution } from "./soilsReaders";

describe("soilsReaders", () => {
  describe("getProjectSoilDistribution", () => {
    it("should return soil distribution from URBAN_PROJECT_SPACES_SURFACE_AREA step without spaceCategory", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 1000,
              IMPERMEABLE_SOILS: 500,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 300,
            },
          },
        },
      };

      const result = getProjectSoilDistribution(steps);

      expect(result).toEqual([
        { surfaceArea: 1000, soilType: "BUILDINGS" },
        { surfaceArea: 500, soilType: "IMPERMEABLE_SOILS" },
        { surfaceArea: 300, soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" },
      ]);
    });

    it("should tag public green spaces soils with spaceCategory PUBLIC_GREEN_SPACE and leave others without", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          payload: {
            publicGreenSpacesSoilsDistribution: {
              PRAIRIE_GRASS: 2000,
              WATER: 500,
            },
          },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 3000,
              IMPERMEABLE_SOILS: 1500,
            },
          },
        },
      };

      const result = getProjectSoilDistribution(steps);

      expect(result).toEqual([
        { surfaceArea: 2000, soilType: "PRAIRIE_GRASS", spaceCategory: "PUBLIC_GREEN_SPACE" },
        { surfaceArea: 500, soilType: "WATER", spaceCategory: "PUBLIC_GREEN_SPACE" },
        { surfaceArea: 3000, soilType: "BUILDINGS" },
        { surfaceArea: 1500, soilType: "IMPERMEABLE_SOILS" },
      ]);
    });

    it("should produce separate entries for same soil type across both distributions", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_PUBLIC_GREEN_SPACES_SOILS_DISTRIBUTION: {
          completed: true,
          payload: {
            publicGreenSpacesSoilsDistribution: {
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1000,
              WATER: 500,
            },
          },
        },
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 2000,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 800,
            },
          },
        },
      };

      const result = getProjectSoilDistribution(steps);

      expect(result).toEqual([
        {
          surfaceArea: 1000,
          soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          spaceCategory: "PUBLIC_GREEN_SPACE",
        },
        { surfaceArea: 500, soilType: "WATER", spaceCategory: "PUBLIC_GREEN_SPACE" },
        { surfaceArea: 2000, soilType: "BUILDINGS" },
        { surfaceArea: 800, soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" },
      ]);
    });

    it("should filter out entries with no surface area", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SPACES_SURFACE_AREA: {
          completed: true,
          payload: {
            spacesSurfaceAreaDistribution: {
              BUILDINGS: 1000,
              IMPERMEABLE_SOILS: 0,
            },
          },
        },
      };

      const result = getProjectSoilDistribution(steps);

      expect(result).toEqual([{ surfaceArea: 1000, soilType: "BUILDINGS" }]);
    });

    it("should return empty array when step has no data", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {};

      const result = getProjectSoilDistribution(steps);

      expect(result).toEqual([]);
    });
  });
});
