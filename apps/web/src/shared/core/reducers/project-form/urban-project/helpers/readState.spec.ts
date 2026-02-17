import { describe, it, expect, vi, beforeEach } from "vitest";

import { BENEFRICHES_ENV } from "@/shared/views/envVars";

import { ProjectFormState } from "../../projectForm.reducer";
import { ReadStateHelper } from "./readState";

vi.mock("@/shared/views/envVars", () => ({
  BENEFRICHES_ENV: {
    urbanProjectUsesFlowEnabled: false,
  },
}));

describe("ReadStateHelper", () => {
  beforeEach(() => {
    vi.mocked(BENEFRICHES_ENV).urbanProjectUsesFlowEnabled = false;
  });

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

  describe("hasUsesWithBuildings", () => {
    it("should return true when uses selection includes building uses", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
      };

      expect(ReadStateHelper.hasUsesWithBuildings(steps)).toBe(true);
    });

    it("should return false when uses selection only includes non-building uses", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
      };

      expect(ReadStateHelper.hasUsesWithBuildings(steps)).toBe(false);
    });

    it("should return false when uses selection step does not exist", () => {
      expect(ReadStateHelper.hasUsesWithBuildings({})).toBe(false);
    });
  });

  describe("hasBuildings", () => {
    it("should return true when buildings surface area is greater than 0", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 1000,
            },
          },
        },
      };

      const result = ReadStateHelper.hasBuildings(steps);

      expect(result).toBe(true);
    });

    it("should return false when buildings surface area is 0", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 0,
            },
          },
        },
      };

      const result = ReadStateHelper.hasBuildings(steps);

      expect(result).toBe(false);
    });

    it("should return false when buildings key does not exist", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: {},
          },
        },
      };

      const result = ReadStateHelper.hasBuildings(steps);
      expect(result).toBe(false);
      expect(ReadStateHelper.hasBuildings({})).toBe(false);
    });

    it("should return true when uses selection includes building uses", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL"] },
        },
      };

      expect(ReadStateHelper.hasBuildings(steps)).toBe(true);
    });
  });

  describe("hasBuildingsResalePlannedAfterDevelopment", () => {
    it("should return true when buildings resale is planned", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: true,
          },
        },
      };

      const result = ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(steps);

      expect(result).toBe(true);
    });

    it("should return false when buildings resale is not planned", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_BUILDINGS_RESALE_SELECTION: {
          completed: true,
          payload: {
            buildingsResalePlannedAfterDevelopment: false,
          },
        },
      };

      const result = ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment(steps);

      expect(result).toBe(false);
    });

    it("should return undefined if no answers exists for URBAN_PROJECT_BUILDINGS_RESALE_SELECTION", () => {
      expect(ReadStateHelper.hasBuildingsResalePlannedAfterDevelopment({})).toBe(undefined);
    });
  });

  describe("isSiteResalePlannedAfterDevelopment", () => {
    it("should return true when siteResaleSelection is 'yes'", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      expect(ReadStateHelper.isSiteResalePlannedAfterDevelopment(steps)).toBe(true);
    });

    it("should return true when siteResaleSelection is 'unknown'", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      expect(ReadStateHelper.isSiteResalePlannedAfterDevelopment(steps)).toBe(true);
    });

    it("should return false when siteResaleSelection is 'no'", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "no" },
        },
      };

      expect(ReadStateHelper.isSiteResalePlannedAfterDevelopment(steps)).toBe(false);
    });
  });

  describe("isSiteResalePriceEstimated", () => {
    it("should return true when siteResaleSelection is 'unknown'", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "unknown" },
        },
      };

      expect(ReadStateHelper.isSiteResalePriceEstimated(steps)).toBe(true);
    });

    it("should return false when siteResaleSelection is 'yes'", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_SITE_RESALE_SELECTION: {
          completed: true,
          payload: { siteResaleSelection: "yes" },
        },
      };

      expect(ReadStateHelper.isSiteResalePriceEstimated(steps)).toBe(false);
    });
  });

  describe("getProjectSoilDistribution", () => {
    describe("with legacy spaces flow", () => {
      it("should aggregate soil distribution from all space types", () => {
        const steps: ProjectFormState["urbanProject"]["steps"] = {
          URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              publicSpacesDistribution: {
                IMPERMEABLE_SURFACE: 500,
                PERMEABLE_SURFACE: 300,
              },
            },
          },
          URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
            completed: true,
            payload: {
              greenSpacesDistribution: {
                LAWNS_AND_BUSHES: 400,
                TREE_FILLED_SPACE: 200,
              },
            },
          },
          URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              livingAndActivitySpacesDistribution: {
                BUILDINGS: 1000,
                IMPERMEABLE_SURFACE: 600,
              },
            },
          },
        };

        const result = ReadStateHelper.getProjectSoilDistribution(steps);
        expect(result).toEqual([
          {
            surfaceArea: 500,
            soilType: "IMPERMEABLE_SOILS",
            spaceCategory: "PUBLIC_SPACE",
          },
          {
            surfaceArea: 300,
            soilType: "MINERAL_SOIL",
            spaceCategory: "PUBLIC_SPACE",
          },
          {
            surfaceArea: 1000,
            soilType: "BUILDINGS",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
          {
            surfaceArea: 600,
            soilType: "IMPERMEABLE_SOILS",
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
          {
            surfaceArea: 400,
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            spaceCategory: "PUBLIC_GREEN_SPACE",
          },
          {
            surfaceArea: 200,
            soilType: "ARTIFICIAL_TREE_FILLED",
            spaceCategory: "PUBLIC_GREEN_SPACE",
          },
        ]);
      });

      it("should filter out entries with no surface area", () => {
        const steps: ProjectFormState["urbanProject"]["steps"] = {
          URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
            completed: true,
            payload: {
              publicSpacesDistribution: {
                IMPERMEABLE_SURFACE: 500,
                PERMEABLE_SURFACE: 0,
              },
            },
          },
        };

        const result = ReadStateHelper.getProjectSoilDistribution(steps);

        expect(result).toHaveLength(1);
        expect(result[0]?.surfaceArea).toBe(500);
      });
    });

    describe("with new spaces selection flow", () => {
      beforeEach(() => {
        vi.mocked(BENEFRICHES_ENV).urbanProjectUsesFlowEnabled = true;
      });

      it("should return soil distribution from URBAN_PROJECT_SPACES_SURFACE_AREA step", () => {
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

        const result = ReadStateHelper.getProjectSoilDistribution(steps);

        expect(result).toEqual([
          { surfaceArea: 1000, soilType: "BUILDINGS" },
          { surfaceArea: 500, soilType: "IMPERMEABLE_SOILS" },
          { surfaceArea: 300, soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" },
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

        const result = ReadStateHelper.getProjectSoilDistribution(steps);

        expect(result).toEqual([{ surfaceArea: 1000, soilType: "BUILDINGS" }]);
      });

      it("should return empty array when step has no data", () => {
        const steps: ProjectFormState["urbanProject"]["steps"] = {};

        const result = ReadStateHelper.getProjectSoilDistribution(steps);

        expect(result).toEqual([]);
      });

      it("should merge public green spaces soils and other spaces soils", () => {
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

        const result = ReadStateHelper.getProjectSoilDistribution(steps);

        expect(result).toEqual([
          { surfaceArea: 2000, soilType: "PRAIRIE_GRASS" },
          { surfaceArea: 500, soilType: "WATER" },
          { surfaceArea: 3000, soilType: "BUILDINGS" },
          { surfaceArea: 1500, soilType: "IMPERMEABLE_SOILS" },
        ]);
      });

      it("should combine surface areas for same soil type across both distributions", () => {
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

        const result = ReadStateHelper.getProjectSoilDistribution(steps);

        expect(result).toEqual([
          { surfaceArea: 1800, soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED" },
          { surfaceArea: 500, soilType: "WATER" },
          { surfaceArea: 2000, soilType: "BUILDINGS" },
        ]);
      });
    });
  });

  describe("getSpacesDistribution", () => {
    it("should aggregate and compute spaces distribution correctly", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_PUBLIC_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            publicSpacesDistribution: {
              IMPERMEABLE_SURFACE: 500,
              GRASS_COVERED_SURFACE: 300,
            },
          },
        },
        URBAN_PROJECT_GREEN_SPACES_SURFACE_AREA_DISTRIBUTION: {
          completed: true,
          payload: {
            greenSpacesDistribution: {
              LAWNS_AND_BUSHES: 400,
              PAVED_ALLEY: 100,
            },
          },
        },
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 1000,
            },
          },
        },
      };

      const result = ReadStateHelper.getSpacesDistribution(steps);

      expect(result.BUILDINGS_FOOTPRINT).toBe(1000);
      expect(result.PUBLIC_GREEN_SPACES).toBe(400);
      expect(result.PUBLIC_PAVED_ROAD_OR_SQUARES_OR_SIDEWALKS).toBe(600); // 500 + 100
      expect(result.PUBLIC_GRASS_ROAD_OR_SQUARES_OR_SIDEWALKS).toBe(300);
    });

    it("should filter out zero or undefined values", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_RESIDENTIAL_AND_ACTIVITY_SPACES_DISTRIBUTION: {
          completed: true,
          payload: {
            livingAndActivitySpacesDistribution: {
              BUILDINGS: 1000,
              IMPERMEABLE_SURFACE: 0,
            },
          },
        },
      };

      const result = ReadStateHelper.getSpacesDistribution(steps);

      expect(result.BUILDINGS_FOOTPRINT).toBe(1000);
      expect(result.PRIVATE_PAVED_ALLEY_OR_PARKING_LOT).toBeUndefined();
    });
  });

  describe("getProjectData", () => {
    it("should extract and structure all project data correctly", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_NAMING: {
          completed: true,
          payload: { name: "Test Project", description: "Description" },
        },
        URBAN_PROJECT_PROJECT_PHASE: {
          completed: true,
          payload: { projectPhase: "planning" },
        },
        URBAN_PROJECT_STAKEHOLDERS_PROJECT_DEVELOPER: {
          completed: true,
          payload: {
            projectDeveloper: { structureType: "company", name: "Dev Corp" },
          },
        },
      };

      const result = ReadStateHelper.getProjectData(steps);

      expect(result.name).toBe("Test Project");
      expect(result.description).toBe("Description");
      expect(result.projectPhase).toBe("planning");
      expect(result.developmentPlan?.developer).toEqual({
        structureType: "company",
        name: "Dev Corp",
      });
    });

    it("should handle missing optional data", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {};

      const result = ReadStateHelper.getProjectData(steps);

      expect(result.name).toBeUndefined();
      expect(result.description).toBeUndefined();
      expect(result.yearlyProjectedCosts).toEqual([]);
      expect(result.yearlyProjectedRevenues).toEqual([]);
    });
  });
});
