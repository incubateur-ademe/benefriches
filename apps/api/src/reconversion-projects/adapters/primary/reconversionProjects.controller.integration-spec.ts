import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import supertest from "supertest";
import { AppModule } from "src/app.module";
import { buildMinimalReconversionProjectProps } from "src/reconversion-projects/domain/model/reconversionProject.mock";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { CreateReconversionProjectBodyDto } from "./reconversionProjects.controller";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("ReconversionProjects controller", () => {
  let app: INestApplication;
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
      "relatedSiteId",
      "developmentPlans",
      "soilsDistribution",
      "yearlyProjectedCosts",
      "yearlyProjectedRevenues",
    ] as (keyof CreateReconversionProjectBodyDto)[])(
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

    it("can create a reconversion project", async () => {
      const requestBody = buildMinimalReconversionProjectProps();
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
      );
      expect(reconversionProjectsInDb.length).toEqual(1);
      expect(reconversionProjectsInDb[0]).toEqual({
        id: requestBody.id,
        name: requestBody.name,
      });
    });
  });
});
