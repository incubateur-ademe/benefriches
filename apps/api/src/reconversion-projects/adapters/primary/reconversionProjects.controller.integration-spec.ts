import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import { expressProjectCategorySchema, saveReconversionProjectPropsSchema } from "shared";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";
import { z, ZodError } from "zod";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { ReconversionProjectFeaturesView } from "src/reconversion-projects/core/model/reconversionProject";
import {
  buildExhaustiveReconversionProjectProps,
  buildMinimalReconversionProjectProps,
  buildUrbanProjectReconversionProjectProps,
} from "src/reconversion-projects/core/model/reconversionProject.mock";
import { Result } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("ReconversionProjects controller", () => {
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

  describe("POST /reconversion-projects", () => {
    describe("error cases", () => {
      it("responds with a 401 when no authentication provided", async () => {
        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-projects")
          .send(buildMinimalReconversionProjectProps());

        expect(response.status).toEqual(401);
      });

      it.each([
        "id",
        "name",
        "createdBy",
        "relatedSiteId",
        "developmentPlan",
        "soilsDistribution",
        "yearlyProjectedCosts",
        "yearlyProjectedRevenues",
        "projectPhase",
      ] satisfies (keyof z.infer<typeof saveReconversionProjectPropsSchema>)[])(
        "can't create a reconversion project without mandatory field %s",
        async (mandatoryField) => {
          const requestBody = buildMinimalReconversionProjectProps();
          const user = new UserBuilder().withId(requestBody.createdBy).asLocalAuthority().build();
          const { accessToken } = await authenticateUser(app)(user);
          // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
          delete requestBody[mandatoryField];

          const response = await supertest(app.getHttpServer())
            .post("/api/reconversion-projects")
            .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
            .send(requestBody);

          expect(response.status).toEqual(400);
          expect(response.body).toHaveProperty("errors");

          const responseErrors = (response.body as BadRequestResponseBody).errors;
          expect(responseErrors).toHaveLength(1);
          expect(responseErrors[0]?.path).toContain(mandatoryField);
        },
      );
    });

    it.each([
      { case: "with minimal data", requestBody: buildMinimalReconversionProjectProps() },
      { case: "with exhaustive data", requestBody: buildExhaustiveReconversionProjectProps() },
      { case: "with urban project data", requestBody: buildUrbanProjectReconversionProjectProps() },
    ])("get a 201 response and reconversion project is created $case", async ({ requestBody }) => {
      const user = new UserBuilder().withId(requestBody.createdBy).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      await sqlConnection("sites").insert({
        id: requestBody.relatedSiteId,
        created_by: user.id,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send(requestBody);

      expect(response.status).toEqual(201);

      const reconversionProjectsInDb = await sqlConnection("reconversion_projects").select(
        "id",
        "name",
        "project_phase",
        "creation_mode",
      );
      expect(reconversionProjectsInDb.length).toEqual(1);
      expect(reconversionProjectsInDb[0]).toEqual({
        id: requestBody.id,
        name: requestBody.name,
        project_phase: requestBody.projectPhase,
        creation_mode: "custom",
      });
    });
  });

  describe("GET /create-from-site", () => {
    const siteId = "f590f643-cd9a-4187-8973-f90e9f1998c8";

    beforeEach(async () => {
      await sqlConnection("sites").insert({
        id: siteId,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("addresses").insert({
        id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        ban_id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        value: "Grenoble",
        city: "Grenoble",
        city_code: "38100",
        post_code: "38000",
        site_id: siteId,
      });

      await sqlConnection("site_soils_distributions").insert({
        soil_type: "BUILDINGS",
        surface_area: 14000,
        site_id: siteId,
        id: uuid(),
      });
    });

    it("responds with a 401 when no access token is provided", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects/create-from-site")
        .send({
          reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
          createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
          siteId: siteId,
          category: "PUBLIC_FACILITIES",
        });

      expect(response.status).toEqual(401);
    });

    it("can't generate a reconversion project without category", async () => {
      const requestBody = {
        reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
        createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
        siteId: siteId,
      };
      const user = new UserBuilder().withId(requestBody.createdBy).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects/create-from-site")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain("category");
    });

    it.each(expressProjectCategorySchema.options)(
      "get a 201 response and reconversion project is returned with category %s",
      async (category) => {
        const createdBy = "612d16c7-b6e4-4e2c-88a8-0512cc51946c";
        const user = new UserBuilder().withId(createdBy).asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        const response = await supertest(app.getHttpServer())
          .get(
            `/api/reconversion-projects/create-from-site?category=${category}&siteId=${siteId}&createdBy=${createdBy}`,
          )
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send();
        expect(response.status).toEqual(200);
        const result = response.body as ReconversionProjectFeaturesView;
        expect(result.isExpress).toEqual(true);
        expect(result.name).toBeDefined();
      },
    );
  });

  describe("POST /create-from-site", () => {
    const siteId = "f590f643-cd9a-4187-8973-f90e9f1998c8";

    beforeEach(async () => {
      await sqlConnection("sites").insert({
        id: siteId,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("addresses").insert({
        id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        ban_id: "e869d8db-3d63-4fd5-93ab-7728c1c19a1e",
        value: "Grenoble",
        city: "Grenoble",
        city_code: "38100",
        post_code: "38000",
        site_id: siteId,
      });

      await sqlConnection("site_soils_distributions").insert({
        soil_type: "BUILDINGS",
        surface_area: 14000,
        site_id: siteId,
        id: uuid(),
      });
    });

    it("responds with a 401 when no access token is provided", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects/create-from-site")
        .send({
          reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
          createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
          siteId: siteId,
          category: "PUBLIC_FACILITIES",
        });

      expect(response.status).toEqual(401);
    });

    it("can't create a reconversion project without category", async () => {
      const requestBody = {
        reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
        createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
        siteId: siteId,
      };
      const user = new UserBuilder().withId(requestBody.createdBy).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects/create-from-site")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send(requestBody);

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain("category");
    });

    it.each(expressProjectCategorySchema.options)(
      "get a 201 response and reconversion project is created with category %s",
      async (category) => {
        const requestBody = {
          reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
          createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
          siteId: siteId,
          category,
        };
        const user = new UserBuilder().withId(requestBody.createdBy).asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-projects/create-from-site")
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(requestBody);
        expect(response.status).toEqual(201);

        const reconversionProjectsInDb = await sqlConnection("reconversion_projects").select(
          "id",
          "created_by",
          "related_site_id",
          "creation_mode",
        );
        expect(reconversionProjectsInDb.length).toEqual(1);
        expect(reconversionProjectsInDb[0]).toEqual({
          id: requestBody.reconversionProjectId,
          created_by: requestBody.createdBy,
          related_site_id: requestBody.siteId,
          creation_mode: "express",
        });
      },
    );
  });

  describe("GET /reconversion-projects/list-by-site", () => {
    it("gets a 401 response when no access token is provided", async () => {
      const response = await supertest(app.getHttpServer())
        .get("/api/reconversion-projects/list-by-site?userId=" + uuid())
        .send();

      expect(response.status).toEqual(401);
    });

    it("gets a 400 response when no userId provided", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get("/api/reconversion-projects/list-by-site")
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(400);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const validationErrors = response.body.errors as ZodError[];
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toMatchObject({
        path: ["userId"],
        message: "Invalid input: expected string, received undefined",
      });
    });

    it("gets a 200 with list of reconversion projects grouped by site for given user", async () => {
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
      const user = new UserBuilder().withId(userId).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .get("/api/reconversion-projects/list-by-site?userId=" + userId)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          siteName: siteInDb1.name,
          siteId: siteInDb1.id,
          siteNature: siteInDb1.nature,
          isExpressSite: true,
          reconversionProjects: [
            {
              id: projectInDb1.id,
              name: projectInDb1.name,
              type: "PHOTOVOLTAIC_POWER_PLANT",
              isExpressProject: false,
            },
            {
              id: projectInDb2.id,
              name: projectInDb2.name,
              type: "URBAN_PROJECT",
              isExpressProject: true,
            },
          ],
        },
        {
          siteName: siteInDb2.name,
          siteId: siteInDb2.id,
          siteNature: siteInDb2.nature,
          isExpressSite: false,
          reconversionProjects: [],
        },
      ]);
    });
  });

  describe("GET /reconversion-projects/:reconversionProjectId/impacts", () => {
    it("gets a 401 when not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .get(`/api/reconversion-projects/${uuid()}/impacts`)
        .send();

      expect(response.status).toEqual(401);
    });

    it("gets a 200 with list of reconversion project impacts", async () => {
      const userId = "71eeda1d-9688-455a-981a-1aca18fe00b0";
      const siteInDb = {
        id: uuid(),
        created_by: userId,
        nature: "FRICHE",
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
      const projectInDb = {
        id: uuid(),
        created_by: userId,
        name: "Projet urbain",
        related_site_id: siteInDb.id,
        created_at: new Date(),
        creation_mode: "custom",
      };

      const address = {
        id: uuid(),
        ban_id: "40192",
        value: "Mont-de-Marsan",
        city: "Mont-de-Marsan",
        city_code: "40192",
        post_code: "40000",
        lat: 43.891274,
        long: -0.50031,
        site_id: siteInDb.id,
      };

      await sqlConnection("sites").insert(siteInDb);
      await sqlConnection("addresses").insert(address);
      await sqlConnection("reconversion_projects").insert(projectInDb);
      await sqlConnection("reconversion_project_development_plans").insert({
        id: uuid(),
        reconversion_project_id: projectInDb.id,
        type: "URBAN_PROJECT",
        features: {
          spacesDistribution: { BUILDING: 1000 },
          buildingsFloorAreaDistribution: { RESIDENTIAL: 1000 },
        },
      });

      const user = new UserBuilder().withId(userId).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);
      const response = await supertest(app.getHttpServer())
        .get(`/api/reconversion-projects/${projectInDb.id}/impacts`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toBeDefined();
      const result = response.body as Result;
      expect(result.impacts).toBeDefined();
      expect(result.projectData).toBeDefined();
      expect(result.siteData.cityStats).toEqual({
        name: "Mont-de-Marsan",
        population: 31455,
        propertyValueMedianPricePerSquareMeters: 2179,
        surfaceAreaSquareMeters: 36595400,
      });
    });
  });
});
