import { INestApplication } from "@nestjs/common";
import { Knex } from "knex";
import { Server } from "net";
import supertest from "supertest";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";
import { z, ZodError } from "zod";

import {
  buildExhaustiveReconversionProjectProps,
  buildMinimalReconversionProjectProps,
  buildUrbanProjectReconversionProjectProps,
} from "src/reconversion-projects/core/model/reconversionProject.mock";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { createReconversionProjectInputSchema } from "./reconversionProjects.controller";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("ReconversionProjects controller", () => {
  let app: INestApplication<Server>;
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
    ] satisfies (keyof z.infer<typeof createReconversionProjectInputSchema>)[])(
      "can't create a reconversion project without mandatory field %s",
      async (mandatoryField) => {
        const requestBody = buildMinimalReconversionProjectProps();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-projects")
          .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it.each([
      { case: "with minimal data", requestBody: buildMinimalReconversionProjectProps() },
      { case: "with exhaustive data", requestBody: buildExhaustiveReconversionProjectProps() },
      { case: "with urban project data", requestBody: buildUrbanProjectReconversionProjectProps() },
    ])("get a 201 response and reconversion project is created $case", async ({ requestBody }) => {
      await sqlConnection("sites").insert({
        id: requestBody.relatedSiteId,
        name: "Site name",
        surface_area: 14000,
        is_friche: false,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects")
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

  describe("POST /create-from-site", () => {
    const siteId = "f590f643-cd9a-4187-8973-f90e9f1998c8";
    beforeEach(async () => {
      await sqlConnection("sites").insert({
        id: siteId,
        name: "Site name",
        surface_area: 14000,
        is_friche: false,
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
    });

    it("can't create a reconversion project without category", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/reconversion-projects/create-from-site")
        .send({
          reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
          createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
          siteId: siteId,
        });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(1);
      expect(responseErrors[0]?.path).toContain("category");
    });

    it.each([
      "PUBLIC_FACILITIES",
      "RESIDENTIAL_TENSE_AREA",
      "RESIDENTIAL_NORMAL_AREA",
      "NEW_URBAN_CENTER",
    ])(
      "get a 201 response and reconversion project is created with category %s",
      async (category) => {
        const requestBody = {
          reconversionProjectId: "64789135-afad-46ea-97a2-f14ba460d485",
          createdBy: "612d16c7-b6e4-4e2c-88a8-0512cc51946c",
          siteId: siteId,
          category,
        };

        const response = await supertest(app.getHttpServer())
          .post("/api/reconversion-projects/create-from-site")
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
    it("gets a 400 response when no userId provided", async () => {
      const response = await supertest(app.getHttpServer())
        .get("/api/reconversion-projects/list-by-site")
        .send();

      expect(response.status).toEqual(400);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const validationErrors = response.body.errors as ZodError[];
      expect(validationErrors).toHaveLength(1);
      expect(validationErrors[0]).toMatchObject({
        path: ["userId"],
        message: "Required",
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
        is_friche: false,
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
        is_friche: false,
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
        is_friche: false,
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

      const response = await supertest(app.getHttpServer())
        .get("/api/reconversion-projects/list-by-site?userId=" + userId)
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
});
