import { getSiteStakeholders } from "./stakeholders";

import { ProjectSite } from "@/features/create-project/domain/project.types";

describe("Project stakeholders", () => {
  describe("getSiteStakeholders", () => {
    it("should return site owner", () => {
      const projectSite: ProjectSite = {
        id: "site-uuid-123",
        name: "Mon projet de reconversion",
        isFriche: false,
        owner: {
          name: "SARL Propriétaire",
          structureType: "company",
        },
        address: {
          lat: 2,
          long: 52,
          city: "Paris",
          id: "",
          cityCode: "75112",
          postCode: "75000",
          value: "",
        },
        surfaceArea: 1200,
        hasContaminatedSoils: false,
        soilsSurfaceAreas: {},
      };

      expect(getSiteStakeholders(projectSite)).toEqual([
        { name: "SARL Propriétaire", role: "owner" },
      ]);
    });

    it("should return site owner and tenant", () => {
      const projectSite: ProjectSite = {
        id: "site-uuid-123",
        name: "Mon projet de reconversion",
        isFriche: false,
        owner: {
          name: "SARL Propriétaire",
          structureType: "company",
        },
        tenant: {
          name: "SCOP Exploitant du site",
          structureType: "company",
        },
        address: {
          lat: 2,
          long: 52,
          city: "Paris",
          id: "",
          cityCode: "75112",
          postCode: "75000",
          value: "",
        },
        surfaceArea: 1200,
        hasContaminatedSoils: false,
        soilsSurfaceAreas: {},
      };

      expect(getSiteStakeholders(projectSite)).toEqual([
        { name: "SARL Propriétaire", role: "owner" },
        { name: "SCOP Exploitant du site", role: "tenant" },
      ]);
    });
  });
});
