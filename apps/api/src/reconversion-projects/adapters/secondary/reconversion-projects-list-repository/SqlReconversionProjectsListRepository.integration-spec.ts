import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { ReconversionProjectsGroupedBySite } from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlReconversionProjectsListRepository } from "./SqlReconversionProjectsListRepository";

describe("ReconversionProjectsListRepository integration", () => {
  let sqlConnection: Knex;
  let reconversionProjectsListRepository: SqlReconversionProjectsListRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    reconversionProjectsListRepository = new SqlReconversionProjectsListRepository(sqlConnection);
  });

  describe("getGroupedBySite", () => {
    it("returns empty list when no sites", async () => {
      const result = await reconversionProjectsListRepository.getGroupedBySite({
        userId: uuid(),
      });
      expect(result).toEqual<ReconversionProjectsGroupedBySite>([]);
    });

    it("returns empty list when no sites for given user", async () => {
      const creatorId = uuid();
      const siteInDb = {
        id: uuid(),
        created_by: creatorId,
        name: "Site 123",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date(),
        is_friche: true,
        friche_activity: "HOUSING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
      };
      await sqlConnection("sites").insert(siteInDb);
      const result = await reconversionProjectsListRepository.getGroupedBySite({
        userId: uuid(),
      });
      expect(result).toEqual<ReconversionProjectsGroupedBySite>([]);
    });

    it("returns sites with no projects", async () => {
      const userId = uuid();
      const siteInDb = {
        id: uuid(),
        created_by: userId,
        name: "Site 123",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date(),
        is_friche: true,
        friche_activity: "HOUSING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
      };
      await sqlConnection("sites").insert(siteInDb);

      const result = await reconversionProjectsListRepository.getGroupedBySite({ userId });

      expect(result).toEqual<ReconversionProjectsGroupedBySite>([
        {
          siteName: siteInDb.name,
          siteId: siteInDb.id,
          isFriche: siteInDb.is_friche,
          fricheActivity: "HOUSING",
          reconversionProjects: [],
        },
      ]);
    });

    it("returns reconversion projects grouped by sites", async () => {
      const userId = uuid();
      const siteInDb1 = {
        id: uuid(),
        created_by: userId,
        name: "Site A",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date("2024-02-01"),
        is_friche: false,
      };
      const siteInDb2 = {
        id: uuid(),
        created_by: userId,
        name: "Site B",
        description: "Description of site",
        surface_area: 190000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date("2024-02-20"),
        is_friche: false,
      };
      const projectInDb1 = {
        id: uuid(),
        created_by: userId,
        name: "Centrale pv",
        related_site_id: siteInDb1.id,
        created_at: new Date(),
      };
      const projectInDb2 = {
        id: uuid(),
        created_by: userId,
        name: "Centrale pv",
        related_site_id: siteInDb2.id,
        created_at: new Date(),
      };
      const projectInDb3 = {
        id: uuid(),
        created_by: userId,
        name: "Centrale pv",
        related_site_id: siteInDb2.id,
        created_at: new Date(),
      };

      await sqlConnection("sites").insert([siteInDb1, siteInDb2]);
      await sqlConnection("reconversion_projects").insert([
        projectInDb1,
        projectInDb2,
        projectInDb3,
      ]);

      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: uuid(),
          reconversion_project_id: projectInDb1.id,
          type: "PHOTOVOLTAIC_POWER_PLANT",
          features: {},
        },
        {
          id: uuid(),
          reconversion_project_id: projectInDb2.id,
          type: "PHOTOVOLTAIC_POWER_PLANT",
          features: {},
        },
        {
          id: uuid(),
          reconversion_project_id: projectInDb3.id,
          type: "PHOTOVOLTAIC_POWER_PLANT",
          features: {},
        },
      ]);

      const result = await reconversionProjectsListRepository.getGroupedBySite({ userId });

      expect(result).toHaveLength(2);
      expect(result).toEqual<ReconversionProjectsGroupedBySite>([
        {
          siteName: siteInDb2.name,
          siteId: siteInDb2.id,
          isFriche: siteInDb2.is_friche,
          reconversionProjects: [
            { id: projectInDb2.id, name: projectInDb2.name, type: "PHOTOVOLTAIC_POWER_PLANT" },
            { id: projectInDb3.id, name: projectInDb3.name, type: "PHOTOVOLTAIC_POWER_PLANT" },
          ],
        },
        {
          siteName: siteInDb1.name,
          siteId: siteInDb1.id,
          isFriche: siteInDb1.is_friche,
          reconversionProjects: [
            { id: projectInDb1.id, name: projectInDb1.name, type: "PHOTOVOLTAIC_POWER_PLANT" },
          ],
        },
      ]);
    });
  });
});
