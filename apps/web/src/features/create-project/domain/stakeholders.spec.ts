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
          id: "owner-uuid-456",
          name: "SARL Propriétaire",
          structureType: "company",
        },
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
          id: "owner-uuid-456",
          name: "SARL Propriétaire",
          structureType: "company",
        },
        tenant: {
          id: "tenant-uuid:987",
          name: "SCOP Exploitant du site",
          structureType: "company",
        },
      };

      expect(getSiteStakeholders(projectSite)).toEqual([
        { name: "SARL Propriétaire", role: "owner" },
        { name: "SCOP Exploitant du site", role: "tenant" },
      ]);
    });
  });
});