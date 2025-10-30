/* oxlint-disable typescript/no-non-null-assertion */
import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import { expressProjectCategorySchema, saveReconversionProjectPropsSchema } from "shared";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";
import { z, ZodError } from "zod";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import {
  ReconversionProjectFeaturesView,
  ReconversionProjectUpdateInputProps,
} from "src/reconversion-projects/core/model/reconversionProject";
import {
  buildExhaustiveReconversionProjectProps,
  buildMinimalReconversionProjectProps,
  buildUrbanProjectReconversionProjectProps,
  UrbanProjectBuilder,
} from "src/reconversion-projects/core/model/reconversionProject.mock";
import { ComputedImpacts } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { ReconversionProjectProps } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  SqlDevelopmentPlan,
  SqlReconversionProject,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlReconversionProjectRepository } from "../secondary/repositories/reconversion-project/SqlReconversionProjectRepository";

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
          // oxlint-disable-next-line typescript/no-dynamic-delete
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
      // oxlint-disable-next-line typescript/no-unsafe-member-access
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
      const result = response.body as ComputedImpacts;
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

  describe("POST /reconversion-projects/:reconversionProjectId/duplicate", () => {
    it("gets a 401 when not authenticated", async () => {
      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-projects/${uuid()}/duplicate`)
        .send({ newProjectId: uuid() });

      expect(response.status).toEqual(401);
    });

    it("gets a 404 when project does not exist", async () => {
      const userId = uuid();
      const user = new UserBuilder().withId(userId).asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-projects/${uuid()}/duplicate`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ newProjectId: uuid() });

      expect(response.status).toEqual(404);
    });

    it("gets a 403 when user is not the creator of the project", async () => {
      const siteId = uuid();

      const authenticatedUser = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(authenticatedUser);

      // Create a site
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: authenticatedUser.id,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: new Date(),
      });

      const anotherUserId = uuid();
      const urbanProject = new UrbanProjectBuilder()
        .withCreatedBy(anotherUserId)
        .withRelatedSiteId(siteId)
        .build();
      await app.get(SqlReconversionProjectRepository).save(urbanProject);

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-projects/${urbanProject.id}/duplicate`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ newProjectId: uuid() });

      expect(response.status).toEqual(403);
    });

    it("successfully duplicates a urban project", async () => {
      const siteId = uuid();
      const newProjectId = uuid();

      const authenticatedUser = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(authenticatedUser);

      // Create a site
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: authenticatedUser.id,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "local_authority",
        created_at: new Date(),
      });

      const sourceUrbanProject = new UrbanProjectBuilder()
        .withCreatedBy(authenticatedUser.id)
        .withRelatedSiteId(siteId)
        .withFutureOperator("Big real estate company", "company")
        .withDeveloper("Big real estate company", "company")
        .withFutureSiteOwner("Big real estate company", "company")
        .withYearlyExpenses([{ amount: 34_000, purpose: "maintenance" }])
        .withYearlyRevenues([{ amount: 50_000, source: "rent" }])
        .withSoilsDistribution([
          {
            soilType: "BUILDINGS",
            surfaceArea: 14_000,
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
          {
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surfaceArea: 25_000,
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
        ])
        .withReinstatement({
          contractOwner: { name: "City of Paris", structureType: "local_authority" },
          costs: [{ amount: 95_000, purpose: "demolition" }],
          schedule: { startDate: new Date("2032-06-01"), endDate: new Date("2032-12-31") },
        })
        .build();
      await app.get(SqlReconversionProjectRepository).save(sourceUrbanProject);

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-projects/${sourceUrbanProject.id}/duplicate`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ newProjectId });

      expect(response.status).toEqual(201);

      const duplicatedProjects = await sqlConnection("reconversion_projects")
        .where({ id: newProjectId })
        .select("*");

      expect(duplicatedProjects).toHaveLength(1);
      expect(duplicatedProjects[0]).toEqual<SqlReconversionProject>({
        id: newProjectId,
        name: "Copie de " + sourceUrbanProject.name,
        creation_mode: "duplicated",
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        created_at: expect.any(Date),
        updated_at: sourceUrbanProject.updatedAt ?? null,
        description: sourceUrbanProject.description!,
        created_by: authenticatedUser.id,
        related_site_id: siteId,
        project_phase: sourceUrbanProject.projectPhase,
        // stakeholders
        future_operator_name: sourceUrbanProject.futureOperator!.name,
        future_operator_structure_type: sourceUrbanProject.futureOperator!.structureType,
        future_site_owner_name: sourceUrbanProject.futureSiteOwner!.name,
        future_site_owner_structure_type: sourceUrbanProject.futureSiteOwner!.structureType,
        // reinstatement
        reinstatement_contract_owner_name: sourceUrbanProject.reinstatementContractOwner!.name,
        reinstatement_contract_owner_structure_type:
          sourceUrbanProject.reinstatementContractOwner!.structureType,
        reinstatement_schedule_end_date: sourceUrbanProject.reinstatementSchedule!.endDate,
        reinstatement_schedule_start_date: sourceUrbanProject.reinstatementSchedule!.startDate,
        friche_decontaminated_soil_surface_area: sourceUrbanProject.decontaminatedSoilSurface!,
        operations_first_year: sourceUrbanProject.operationsFirstYear!,
        // buildings and site resale
        buildings_resale_expected_property_transfer_duties:
          sourceUrbanProject.buildingsResaleExpectedPropertyTransferDuties!,
        buildings_resale_expected_selling_price:
          sourceUrbanProject.buildingsResaleExpectedSellingPrice!,
        site_resale_expected_selling_price: sourceUrbanProject.siteResaleExpectedSellingPrice!,
        site_resale_expected_property_transfer_duties:
          sourceUrbanProject.siteResaleExpectedPropertyTransferDuties!,
        site_purchase_selling_price: sourceUrbanProject.sitePurchaseSellingPrice!,
        site_purchase_property_transfer_duties:
          sourceUrbanProject.sitePurchasePropertyTransferDuties!,
      });

      // development plan
      const duplicatedDevelopmentPlans = await sqlConnection(
        "reconversion_project_development_plans",
      )
        .where({ reconversion_project_id: newProjectId })
        .select("*");
      expect(duplicatedDevelopmentPlans).toEqual<SqlDevelopmentPlan[]>([
        {
          // oxlint-disable-next-line typescript/no-unsafe-assignment
          id: expect.any(String),
          type: "URBAN_PROJECT",
          developer_name: sourceUrbanProject.developmentPlan.developer.name,
          developer_structure_type: sourceUrbanProject.developmentPlan.developer.structureType,
          reconversion_project_id: newProjectId,
          features: sourceUrbanProject.developmentPlan.features,
          schedule_end_date: sourceUrbanProject.developmentPlan.installationSchedule!.endDate,
          schedule_start_date: sourceUrbanProject.developmentPlan.installationSchedule!.startDate,
        },
      ]);
      // development plan costs
      const duplicatedDevelopmentPlanCosts = await sqlConnection(
        "reconversion_project_development_plan_costs",
      )
        .where("development_plan_id", duplicatedDevelopmentPlans[0]?.id)
        .select("amount", "purpose");
      expect(duplicatedDevelopmentPlanCosts).toEqual(sourceUrbanProject.developmentPlan.costs);
      // reinstatement costs
      const duplicatedReinstatementCosts = await sqlConnection(
        "reconversion_project_reinstatement_costs",
      )
        .where({ reconversion_project_id: newProjectId })
        .select("amount", "purpose");
      expect(duplicatedReinstatementCosts).toEqual(sourceUrbanProject.reinstatementCosts);
      // yearly expenses
      const duplicatedYearlyExpenses = await sqlConnection("reconversion_project_yearly_expenses")
        .where({ reconversion_project_id: newProjectId })
        .select("amount", "purpose");
      expect(duplicatedYearlyExpenses).toEqual([{ amount: 34000, purpose: "maintenance" }]);
      // yearly revenues
      const duplicatedYearlyRevenues = await sqlConnection("reconversion_project_yearly_revenues")
        .where({ reconversion_project_id: newProjectId })
        .select("amount", "source");
      expect(duplicatedYearlyRevenues).toEqual([{ amount: 50000, source: "rent" }]);
      // soil distributions
      const duplicatedSoilDistributions = await sqlConnection(
        "reconversion_project_soils_distributions",
      )
        .where({ reconversion_project_id: newProjectId })
        .select(
          "soil_type as soilType",
          "surface_area as surfaceArea",
          "space_category as spaceCategory",
        );
      expect(duplicatedSoilDistributions).toEqual(sourceUrbanProject.soilsDistribution);
    });

    it("successfully duplicates a urban project with very little information", async () => {
      const siteId = uuid();
      const newProjectId = uuid();

      const authenticatedUser = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(authenticatedUser);

      // Create a site
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: authenticatedUser.id,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "local_authority",
        created_at: new Date(),
      });

      const sourceUrbanProject: ReconversionProjectProps = {
        id: uuid(),
        relatedSiteId: siteId,
        createdAt: new Date(),
        creationMode: "custom",
        name: "ébauche projet urbain",
        createdBy: authenticatedUser.id,
        developmentPlan: {
          type: "URBAN_PROJECT",
          developer: { name: "Aménageur", structureType: "unknown" },
          costs: [],
          installationSchedule: {
            startDate: new Date("2027-10-17T00:00:00.000Z"),
            endDate: new Date("2028-10-17T00:00:00.000Z"),
          },
          features: {
            spacesDistribution: { PUBLIC_GREEN_SPACES: 34794 },
            buildingsFloorAreaDistribution: {},
          },
        },
        decontaminatedSoilSurface: 0,
        financialAssistanceRevenues: [],
        yearlyProjectedCosts: [],
        yearlyProjectedRevenues: [],
        operationsFirstYear: 2028,
        projectPhase: "setup",
        soilsDistribution: [
          {
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            spaceCategory: "PUBLIC_GREEN_SPACE",
            surfaceArea: 13917.6,
          },
          {
            soilType: "ARTIFICIAL_TREE_FILLED",
            spaceCategory: "PUBLIC_GREEN_SPACE",
            surfaceArea: 20876.4,
          },
        ],
      };
      await app.get(SqlReconversionProjectRepository).save(sourceUrbanProject);

      const response = await supertest(app.getHttpServer())
        .post(`/api/reconversion-projects/${sourceUrbanProject.id}/duplicate`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ newProjectId });

      expect(response.status).toEqual(201);

      const duplicatedProjects = await sqlConnection("reconversion_projects")
        .where({ id: newProjectId })
        .select("*");

      expect(duplicatedProjects).toHaveLength(1);
      expect(duplicatedProjects[0]).toEqual({
        id: newProjectId,
        name: "Copie de " + sourceUrbanProject.name,
        creation_mode: "duplicated",
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        created_at: expect.any(Date),
        updated_at: sourceUrbanProject.updatedAt ?? null,
        description: null,
        created_by: authenticatedUser.id,
        related_site_id: siteId,
        project_phase: sourceUrbanProject.projectPhase,
        // stakeholders
        future_operator_name: null,
        future_operator_structure_type: null,
        future_site_owner_name: null,
        future_site_owner_structure_type: null,
        // reinstatement
        reinstatement_contract_owner_name: null,
        reinstatement_contract_owner_structure_type: null,
        reinstatement_schedule_end_date: null,
        reinstatement_schedule_start_date: null,
        friche_decontaminated_soil_surface_area: 0,
        operations_first_year: sourceUrbanProject.operationsFirstYear,
        // buildings and site resale
        buildings_resale_expected_property_transfer_duties: null,
        buildings_resale_expected_selling_price: null,
        site_resale_expected_selling_price: null,
        site_resale_expected_property_transfer_duties: null,
        site_purchase_selling_price: null,
        site_purchase_property_transfer_duties: null,
      });

      // development plan
      const duplicatedDevelopmentPlans = await sqlConnection(
        "reconversion_project_development_plans",
      )
        .where({ reconversion_project_id: newProjectId })
        .select("*");
      expect(duplicatedDevelopmentPlans).toEqual<SqlDevelopmentPlan[]>([
        {
          // oxlint-disable-next-line typescript/no-unsafe-assignment
          id: expect.any(String),
          type: "URBAN_PROJECT",
          developer_name: sourceUrbanProject.developmentPlan.developer.name,
          developer_structure_type: sourceUrbanProject.developmentPlan.developer.structureType,
          reconversion_project_id: newProjectId,
          features: sourceUrbanProject.developmentPlan.features,
          schedule_end_date:
            sourceUrbanProject.developmentPlan.installationSchedule?.endDate ?? null,
          schedule_start_date:
            sourceUrbanProject.developmentPlan.installationSchedule?.startDate ?? null,
        },
      ]);
      // development plan costs
      const duplicatedDevelopmentPlanCosts = await sqlConnection(
        "reconversion_project_development_plan_costs",
      )
        .where("development_plan_id", duplicatedDevelopmentPlans[0]?.id)
        .select("amount", "purpose");
      expect(duplicatedDevelopmentPlanCosts).toEqual(sourceUrbanProject.developmentPlan.costs);
      // reinstatement costs
      const duplicatedReinstatementCosts = await sqlConnection(
        "reconversion_project_reinstatement_costs",
      )
        .where({ reconversion_project_id: newProjectId })
        .select("amount", "purpose");
      expect(duplicatedReinstatementCosts).toEqual([]);
      // yearly expenses
      const duplicatedYearlyExpenses = await sqlConnection("reconversion_project_yearly_expenses")
        .where({ reconversion_project_id: newProjectId })
        .select("amount", "purpose");
      expect(duplicatedYearlyExpenses).toEqual([]);
      // yearly revenues
      const duplicatedYearlyRevenues = await sqlConnection("reconversion_project_yearly_revenues")
        .where({ reconversion_project_id: newProjectId })
        .select("*");
      expect(duplicatedYearlyRevenues).toEqual([]);
      // soil distributions
      const duplicatedSoilDistributions = await sqlConnection(
        "reconversion_project_soils_distributions",
      )
        .where({ reconversion_project_id: newProjectId })
        .select(
          "soil_type as soilType",
          "surface_area as surfaceArea",
          "space_category as spaceCategory",
        );
      expect(duplicatedSoilDistributions).toEqual(sourceUrbanProject.soilsDistribution);
    });
  });

  describe("PUT /reconversion-projects", () => {
    const baseUpdateReconversionProjectProps = {
      name: "Centrale photovoltaique",
      developmentPlan: {
        type: "PHOTOVOLTAIC_POWER_PLANT",
        costs: [{ amount: 130000, purpose: "installation_works" }],
        developer: {
          structureType: "company",
          name: "Terre cuite d’occitanie",
        },
        features: {
          surfaceArea: 1200,
          contractDuration: 25,
          electricalPowerKWc: 10000,
          expectedAnnualProduction: 12000,
        },
      },

      soilsDistribution: [
        {
          soilType: "BUILDINGS",
          surfaceArea: 3000,
        },
        {
          soilType: "ARTIFICIAL_TREE_FILLED",
          surfaceArea: 5000,
        },
        {
          soilType: "FOREST_MIXED",
          surfaceArea: 60000,
        },
        {
          soilType: "MINERAL_SOIL",
          surfaceArea: 5000,
        },
        {
          soilType: "IMPERMEABLE_SOILS",
          surfaceArea: 1300,
        },
      ],
      yearlyProjectedCosts: [{ purpose: "rent", amount: 12000 }],
      yearlyProjectedRevenues: [{ source: "operations", amount: 13000 }],
      projectPhase: "planning",
    } as const satisfies ReconversionProjectUpdateInputProps;
    describe("error cases", () => {
      it("gets a 401 when not authenticated", async () => {
        const response = await supertest(app.getHttpServer())
          .put(`/api/reconversion-projects/${uuid()}`)
          .send(baseUpdateReconversionProjectProps);

        expect(response.status).toEqual(401);
      });

      it("gets a 404 when project does not exist", async () => {
        const userId = uuid();
        const user = new UserBuilder().withId(userId).asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(user);

        const response = await supertest(app.getHttpServer())
          .put(`/api/reconversion-projects/${uuid()}`)
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(baseUpdateReconversionProjectProps);

        expect(response.status).toEqual(404);
      });

      it("gets a 403 when user is not the creator of the project", async () => {
        const siteId = uuid();

        const authenticatedUser = new UserBuilder().asLocalAuthority().build();
        const { accessToken } = await authenticateUser(app)(authenticatedUser);

        // Create a site
        await sqlConnection("sites").insert({
          id: siteId,
          created_by: authenticatedUser.id,
          name: "Site name",
          surface_area: 14000,
          owner_structure_type: "company",
          created_at: new Date(),
        });

        const anotherUserId = uuid();
        const urbanProject = new UrbanProjectBuilder()
          .withCreatedBy(anotherUserId)
          .withRelatedSiteId(siteId)
          .build();
        await app.get(SqlReconversionProjectRepository).save(urbanProject);

        const response = await supertest(app.getHttpServer())
          .put(`/api/reconversion-projects/${urbanProject.id}`)
          .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
          .send(baseUpdateReconversionProjectProps);

        expect(response.status).toEqual(403);
      });
    });

    it("get a 200 response and reconversion project name is updated", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: new Date(),
      });

      const sourceUrbanProject = new UrbanProjectBuilder()
        .withCreatedBy(user.id)
        .withRelatedSiteId(siteId)
        .withFutureOperator("Big real estate company", "company")
        .withDeveloper("Big real estate company", "company")
        .withFutureSiteOwner("Big real estate company", "company")
        .withYearlyExpenses([{ amount: 34_000, purpose: "maintenance" }])
        .withYearlyRevenues([{ amount: 50_000, source: "rent" }])
        .withSoilsDistribution([
          {
            soilType: "BUILDINGS",
            surfaceArea: 14_000,
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
          {
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surfaceArea: 25_000,
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
        ])
        .withReinstatement({
          contractOwner: { name: "City of Paris", structureType: "local_authority" },
          costs: [{ amount: 95_000, purpose: "demolition" }],
          schedule: { startDate: new Date("2032-06-01"), endDate: new Date("2032-12-31") },
        })
        .build();

      await app.get(SqlReconversionProjectRepository).save(sourceUrbanProject);

      const response = await supertest(app.getHttpServer())
        .put(`/api/reconversion-projects/${sourceUrbanProject.id}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send({ ...sourceUrbanProject, name: "New project name" });

      expect(response.status).toEqual(200);

      const reconversionProjectsInDb = await sqlConnection("reconversion_projects").select(
        "id",
        "name",
        "project_phase",
        "creation_mode",
      );
      expect(reconversionProjectsInDb.length).toEqual(1);
      expect(reconversionProjectsInDb[0]).toEqual({
        id: sourceUrbanProject.id,
        name: "New project name",
        project_phase: sourceUrbanProject.projectPhase,
        creation_mode: "custom",
      });
    });

    it("get a 200 response and reconversion project is updated", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Site name",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: new Date(),
      });

      const sourceUrbanProject = new UrbanProjectBuilder()
        .withCreatedBy(user.id)
        .withRelatedSiteId(siteId)
        .build();

      await app.get(SqlReconversionProjectRepository).save(sourceUrbanProject);

      const updateProps = new UrbanProjectBuilder()
        .withCreatedBy(user.id)
        .withRelatedSiteId(siteId)
        .withFutureOperator("Big real estate company", "company")
        .withDeveloper("Big real estate company", "company")
        .withFutureSiteOwner("Big real estate company", "company")
        .withYearlyExpenses([{ amount: 34_000, purpose: "maintenance" }])
        .withYearlyRevenues([{ amount: 50_000, source: "rent" }])
        .withSoilsDistribution([
          {
            soilType: "BUILDINGS",
            surfaceArea: 14_000,
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
          {
            soilType: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
            surfaceArea: 25_000,
            spaceCategory: "LIVING_AND_ACTIVITY_SPACE",
          },
        ])
        .withReinstatement({
          contractOwner: { name: "City of Paris", structureType: "local_authority" },
          costs: [{ amount: 95_000, purpose: "demolition" }],
          schedule: { startDate: new Date("2032-06-01"), endDate: new Date("2032-12-31") },
        })
        .build();

      const response = await supertest(app.getHttpServer())
        .put(`/api/reconversion-projects/${sourceUrbanProject.id}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send(updateProps);

      expect(response.status).toEqual(200);

      const reconversionProjectUpdated = await app
        .get(SqlReconversionProjectRepository)
        .getById(sourceUrbanProject.id);

      expect(reconversionProjectUpdated).toBeDefined();
      expect(saveReconversionProjectPropsSchema.parseAsync(reconversionProjectUpdated)).toEqual(
        saveReconversionProjectPropsSchema.parseAsync(updateProps),
      );
    });
  });
});
