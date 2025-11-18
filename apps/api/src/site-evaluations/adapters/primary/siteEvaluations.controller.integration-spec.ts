/* oxlint-disable typescript/no-non-null-assertion */
import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

describe("SiteEvaluations controller", () => {
  let app: NestExpressApplication;
  let sqlConnection: Knex;

  beforeAll(async () => {
    app = await createTestApp();
    await app.init();
    sqlConnection = app.get(SqlConnection);
  });

  afterAll(async () => {
    await app.close();
    await sqlConnection.destroy();
  });

  describe("GET /site-evaluations", () => {
    it("gets a 401 response when no access token is provided", async () => {
      const response = await supertest(app.getHttpServer()).get("/api/site-evaluations").send();

      expect(response.status).toEqual(401);
    });

    it("gets a 200 with list of site evaluations for given user", async () => {
      const userId = "71eeda1d-9688-455a-981a-1aca18fe00b0";
      const siteInDb1 = {
        id: uuid(),
        created_by: userId,
        nature: "AGRICULTURAL_OPERATION",
        name: "Site A",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date("2024-02-10"),
        creation_mode: "express",
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
        created_at: new Date("2024-02-01"),
        nature: "NATURAL_AREA",
      };
      const projectInDb1 = {
        id: uuid(),
        created_by: userId,
        name: "Centrale pv",
        related_site_id: siteInDb1.id,
        created_at: new Date(),
        creation_mode: "custom",
      };
      const projectInDb2 = {
        id: uuid(),
        created_by: userId,
        name: "Centrale pv",
        related_site_id: siteInDb1.id,
        created_at: new Date(),
        creation_mode: "express",
      };
      const siteOfAnotherUser = {
        id: uuid(),
        created_by: uuid(),
        name: "Site C",
        description: "Description of site",
        surface_area: 20000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date("2024-02-15"),
      };

      await sqlConnection("sites").insert([siteInDb1, siteInDb2, siteOfAnotherUser]);
      await sqlConnection("reconversion_projects").insert([projectInDb1, projectInDb2]);
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
          type: "URBAN_PROJECT",
          features: {},
        },
      ]);

      const compatibilityEvaluation = {
        id: uuid(),
        created_by: userId,
        completed_at: new Date(),
        mutafriches_evaluation_id: uuid(),
        created_at: new Date(),
        status: "related_site_created",
        related_site_id: siteInDb1.id,
      };

      await sqlConnection("reconversion_compatibility_evaluations").insert(compatibilityEvaluation);

      const user = new UserBuilder().withId(userId).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get("/api/site-evaluations")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          siteName: siteInDb1.name,
          siteId: siteInDb1.id,
          siteNature: siteInDb1.nature,
          isExpressSite: true,
          compatibilityEvaluation: {
            id: compatibilityEvaluation.id,
            mutafrichesEvaluationId: compatibilityEvaluation.mutafriches_evaluation_id,
            top3Usages: [
              {
                rank: 1,
                score: 0.7,
                usage: "equipements",
              },
              {
                rank: 2,
                score: 0.65,
                usage: "culture",
              },
              {
                rank: 3,
                score: 0.5,
                usage: "residentiel",
              },
            ],
          },
          reconversionProjects: {
            total: 2,
            lastProjects: [
              {
                id: projectInDb1.id,
                name: projectInDb1.name,
                projectType: "PHOTOVOLTAIC_POWER_PLANT",
                isExpressProject: false,
              },
              {
                id: projectInDb2.id,
                name: projectInDb2.name,
                projectType: "URBAN_PROJECT",
                isExpressProject: true,
              },
            ],
          },
        },
        {
          siteName: siteInDb2.name,
          siteId: siteInDb2.id,
          siteNature: siteInDb2.nature,
          isExpressSite: false,
          reconversionProjects: { total: 0, lastProjects: [] },
        },
      ]);
    });
  });
});
