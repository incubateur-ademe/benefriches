import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SiteEvaluationDataView } from "src/site-evaluations/core/gateways/SiteEvaluationQuery";

import { SqlSiteEvaluationQuery } from "./SqlSiteEvaluationQuery";

describe("SqlSiteEvaluationQuery integration", () => {
  let sqlConnection: Knex;
  let sqlSiteEvaluationQuery: SqlSiteEvaluationQuery;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    sqlSiteEvaluationQuery = new SqlSiteEvaluationQuery(sqlConnection);
  });

  describe("getUserSiteEvaluations", () => {
    it("returns empty list when no sites", async () => {
      const result = await sqlSiteEvaluationQuery.getUserSiteEvaluations(uuid());
      expect(result).toEqual<SiteEvaluationDataView[]>([]);
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
        nature: "FRICHE",
        friche_activity: "BUILDING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
      };
      await sqlConnection("sites").insert(siteInDb);
      const result = await sqlSiteEvaluationQuery.getUserSiteEvaluations(uuid());
      expect(result).toEqual<SiteEvaluationDataView[]>([]);
    });

    it("returns sites with no projects nor compability evaluation", async () => {
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
        creation_mode: "custom",
        nature: "FRICHE",
        friche_activity: "BUILDING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
      } as const;
      await sqlConnection("sites").insert(siteInDb);

      const result = await sqlSiteEvaluationQuery.getUserSiteEvaluations(userId);

      expect(result).toEqual<SiteEvaluationDataView[]>([
        {
          siteName: siteInDb.name,
          siteId: siteInDb.id,
          siteNature: siteInDb.nature,
          isExpressSite: false,
          reconversionProjects: { total: 0, lastProjects: [] },
        },
      ]);
    });

    it("returns sites with for each the 2 last projects and compatibility evaluation id if exists", async () => {
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
        created_at: new Date("2025-02-01"),
        nature: "AGRICULTURAL_OPERATION",
      } as const;

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
        created_at: new Date("2025-02-20"),
        nature: "NATURAL_AREA",
        creation_mode: "express",
      } as const;

      const siteInDb3 = {
        id: uuid(),
        created_by: userId,
        name: "Site C",
        description: "Description of site",
        surface_area: 190000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date("2025-02-19"),
        nature: "FRICHE",
        creation_mode: "custom",
      } as const;

      await sqlConnection("sites").insert([siteInDb1, siteInDb2, siteInDb3]);
      const testProjects = [
        {
          id: uuid(),
          created_by: userId,
          name: "Centrale pv",
          related_site_id: siteInDb1.id,
          created_at: new Date(),
          creation_mode: "custom",
        },
        {
          id: uuid(),
          created_by: userId,
          name: "Centrale pv",
          related_site_id: siteInDb2.id,
          created_at: new Date(),
          creation_mode: "custom",
        },
        {
          id: uuid(),
          created_by: userId,
          name: "Centrale pv",
          related_site_id: siteInDb2.id,
          created_at: new Date(),
          creation_mode: "custom",
        },
        {
          id: uuid(),
          created_by: userId,
          name: "Projet urbain mixte",
          related_site_id: siteInDb3.id,
          created_at: new Date("2025-10-12"),
          creation_mode: "custom",
        },
        {
          id: uuid(),
          created_by: userId,
          name: "Projet urbain mixte",
          related_site_id: siteInDb3.id,
          created_at: new Date("2025-10-22"),
          creation_mode: "custom",
        },
        {
          id: uuid(),
          created_by: userId,
          name: "Projet urbain mixte",
          related_site_id: siteInDb3.id,
          created_at: new Date("2025-10-01"),
          creation_mode: "custom",
        },
        {
          id: uuid(),
          created_by: userId,
          name: "Projet urbain mixte",
          related_site_id: siteInDb3.id,
          created_at: new Date("2025-10-01"),
          creation_mode: "custom",
        },
      ] as const;

      await sqlConnection("reconversion_projects").insert(testProjects);
      await Promise.all(
        testProjects.map(async (project) => {
          return await sqlConnection("reconversion_project_development_plans").insert([
            {
              id: uuid(),
              reconversion_project_id: project.id,
              type: "PHOTOVOLTAIC_POWER_PLANT",
              features: {},
            },
          ]);
        }),
      );

      const compatibilityEvaluations = [
        {
          id: uuid(),
          created_by: userId,
          completed_at: new Date(),
          mutafriches_evaluation_id: uuid(),
          created_at: new Date(),
          status: "related_site_created",
          related_site_id: siteInDb1.id,
        },
        {
          id: uuid(),
          created_by: userId,
          completed_at: new Date(),
          mutafriches_evaluation_id: uuid(),
          created_at: new Date("2025-10-22"),
          status: "related_site_created",
          related_site_id: siteInDb3.id,
        },
        {
          id: uuid(),
          created_by: userId,
          completed_at: new Date(),
          mutafriches_evaluation_id: uuid(),
          created_at: new Date(),
          status: "related_site_created",
          related_site_id: siteInDb3.id,
        },
      ] as const;

      await sqlConnection("reconversion_compatibility_evaluations").insert(
        compatibilityEvaluations,
      );

      const result = await sqlSiteEvaluationQuery.getUserSiteEvaluations(userId);

      expect(result).toHaveLength(3);
      expect(result).toEqual<SiteEvaluationDataView[]>([
        {
          siteName: siteInDb2.name,
          siteId: siteInDb2.id,
          siteNature: siteInDb2.nature,
          isExpressSite: true,
          reconversionProjects: {
            total: 2,
            lastProjects: [
              {
                id: testProjects[1].id,
                name: testProjects[1].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
              {
                id: testProjects[2].id,
                name: testProjects[2].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
            ],
          },
        },
        {
          siteName: siteInDb3.name,
          siteId: siteInDb3.id,
          isExpressSite: false,
          siteNature: siteInDb3.nature,
          compatibilityEvaluation: {
            id: compatibilityEvaluations[2]?.id,
            mutafrichesEvaluationId: compatibilityEvaluations[2]?.mutafriches_evaluation_id,
          },
          reconversionProjects: {
            total: 4,
            lastProjects: [
              {
                id: testProjects[4].id,
                name: testProjects[4].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
              {
                id: testProjects[3].id,
                name: testProjects[3].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
              {
                id: testProjects[5].id,
                name: testProjects[5].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
              {
                id: testProjects[6].id,
                name: testProjects[6].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
            ],
          },
        },
        {
          siteName: siteInDb1.name,
          siteId: siteInDb1.id,
          isExpressSite: false,
          siteNature: siteInDb1.nature,
          compatibilityEvaluation: {
            id: compatibilityEvaluations[0]?.id,
            mutafrichesEvaluationId: compatibilityEvaluations[0]?.mutafriches_evaluation_id,
          },
          reconversionProjects: {
            total: 1,
            lastProjects: [
              {
                id: testProjects[0].id,
                name: testProjects[0].name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
            ],
          },
        },
      ]);
    });
  });
});
