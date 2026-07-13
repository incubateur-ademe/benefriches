import { describe, it, expect } from "vitest";

import { ProjectFormState } from "../../../projectForm.reducer";
import { hasBuildingsResalePlannedAfterDevelopment, willHaveBuildings } from "./buildingsReaders";

describe("buildingsReaders", () => {
  describe("willHaveBuildings", () => {
    it("should return true when uses selection includes building uses", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["RESIDENTIAL", "PUBLIC_GREEN_SPACES"] },
        },
      };

      expect(willHaveBuildings(steps)).toBe(true);
    });

    it("should return false when uses selection only includes non-building uses", () => {
      const steps: ProjectFormState["urbanProject"]["steps"] = {
        URBAN_PROJECT_USES_SELECTION: {
          completed: true,
          payload: { usesSelection: ["PUBLIC_GREEN_SPACES", "OTHER_PUBLIC_SPACES"] },
        },
      };

      expect(willHaveBuildings(steps)).toBe(false);
    });

    it("should return false when uses selection step does not exist", () => {
      expect(willHaveBuildings({})).toBe(false);
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

      const result = hasBuildingsResalePlannedAfterDevelopment(steps);

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

      const result = hasBuildingsResalePlannedAfterDevelopment(steps);

      expect(result).toBe(false);
    });

    it("should return undefined if no answers exists for URBAN_PROJECT_BUILDINGS_RESALE_SELECTION", () => {
      expect(hasBuildingsResalePlannedAfterDevelopment({})).toBe(undefined);
    });
  });
});
