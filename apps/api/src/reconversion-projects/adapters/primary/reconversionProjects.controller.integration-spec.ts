import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import { Server } from "net";
import supertest from "supertest";
import { v4 as uuid } from "uuid";
import { z, ZodError } from "zod";
import { AppModule } from "src/app.module";
import {
  buildExhaustiveReconversionProjectProps,
  buildMinimalReconversionProjectProps,
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
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideModule(ConfigModule)
      .useModule(ConfigModule.forRoot({ envFilePath: ".env.test" }))
      .compile();

    app = moduleRef.createNestApplication();
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
    ] as (keyof z.infer<typeof createReconversionProjectInputSchema>)[])(
      "can't create a reconversion project without mandatory field %s",
      async (mandatoryField) => {
        const requestBody = buildMinimalReconversionProjectProps();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer())
          .post("/reconversion-projects")
          .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0].path).toContain(mandatoryField);
      },
    );

    it.each([
      { case: "with minimal data", requestBody: buildMinimalReconversionProjectProps() },
      { case: "with exhaustive data", requestBody: buildExhaustiveReconversionProjectProps() },
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
        .post("/reconversion-projects")
        .send(requestBody);

      expect(response.status).toEqual(201);

      const reconversionProjectsInDb = await sqlConnection("reconversion_projects").select(
        "id",
        "name",
        "project_phase",
        "project_phase_details",
      );
      expect(reconversionProjectsInDb.length).toEqual(1);
      expect(reconversionProjectsInDb[0]).toEqual({
        id: requestBody.id,
        name: requestBody.name,
        project_phase: requestBody.projectPhase,
        project_phase_details: requestBody.projectPhaseDetails ?? null,
      });
    });
  });

  describe("GET /reconversion-projects/list-by-site", () => {
    it("gets a 400 response when no userId provided", async () => {
      const response = await supertest(app.getHttpServer())
        .get("/reconversion-projects/list-by-site")
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
        name: "Site A",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date("2024-02-10"),
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
        created_at: new Date("2024-02-01"),
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
        related_site_id: siteInDb1.id,
        created_at: new Date(),
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
      const response = await supertest(app.getHttpServer())
        .get("/reconversion-projects/list-by-site?userId=" + userId)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual([
        {
          siteName: siteInDb1.name,
          siteId: siteInDb1.id,
          isFriche: siteInDb1.is_friche,
          reconversionProjects: [
            { id: projectInDb1.id, name: projectInDb1.name },
            { id: projectInDb2.id, name: projectInDb2.name },
          ],
        },
        {
          siteName: siteInDb2.name,
          siteId: siteInDb2.id,
          isFriche: siteInDb2.is_friche,
          reconversionProjects: [],
        },
      ]);
    });
  });
});
