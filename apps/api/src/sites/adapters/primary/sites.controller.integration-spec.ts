import { INestApplication } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { Knex } from "knex";
import supertest from "supertest";
import { AppModule } from "src/app.module";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlSite } from "../secondary/site-repository/SqlSiteRepository";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("LocationFeatures controller", () => {
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

  afterEach(async () => {
    await sqlConnection("addresses").delete();
    await sqlConnection("site_expenses").delete();
    await sqlConnection("site_incomes").delete();
    await sqlConnection("site_soils_distributions").delete();
    await sqlConnection("sites").delete();
  });

  describe("POST /sites", () => {
    it("can't create a site without mandatory data", async () => {
      const response = await supertest(app.getHttpServer()).post("/sites").send({
        isFriche: false,
      });

      expect(response.status).toEqual(400);
      expect(response.body).toHaveProperty("errors");

      const mandatoryFields = [
        "id",
        "name",
        "address",
        "surfaceArea",
        "soilsDistribution",
        "owner",
        "yearlyExpenses",
        "yearlyIncomes",
      ];

      const responseErrors = (response.body as BadRequestResponseBody).errors;
      expect(responseErrors).toHaveLength(mandatoryFields.length);
      const inputFieldsWithError = responseErrors.map((error) => error.path.join("."));
      mandatoryFields.forEach((mandatoryField) => {
        expect(inputFieldsWithError).toContain(mandatoryField);
      });
    });

    it("can create a site", async () => {
      const validSite = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        isFriche: false,
        owner: { name: "Owner name", structureType: "company" },
        name: "Friche industrielle",
        surfaceArea: 2900,
        address: {
          lat: 2.347,
          long: 48.859,
          city: "Paris",
          banId: "75110_7043",
          cityCode: "75110",
          postCode: "75010",
          value: "Rue de Paradis 75010 Paris",
        },
        soilsDistribution: {
          BUILDINGS: 1400,
          MINERAL_SOIL: 1500,
        },
        yearlyExpenses: [],
        yearlyIncomes: [],
      };
      const response = await supertest(app.getHttpServer()).post("/sites").send(validSite);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection<SqlSite>("sites").select("id", "name", "surface_area");
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual({
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        name: "Friche industrielle",
        surface_area: "2900.00",
      });
    });

    it("can create a friche site", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/sites")
        .send({
          id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
          name: "Ancienne gare de Bercy",
          isFriche: true,
          fricheActivity: "RAILWAY",
          owner: { structureType: "local_or_regional_authority", name: "department" },
          tenant: { structureType: "company", name: "Tenant SARL" },
          soilsDistribution: {
            BUILDINGS: 12300,
            MINERAL_SOIL: 12000,
            PRAIRIE_GRASS: 50000,
          },
          surfaceArea: 15000,
          yearlyExpenses: [],
          yearlyIncomes: [],
          hasRecentAccidents: false,
          fullTimeJobsInvolved: 1.2,
          hasContaminatedSoils: true,
          contaminatedSoilsSurface: 1400.3,
          address: {
            city: "Paris",
            cityCode: "75109",
            postCode: "75009",
            banId: "123abc",
            lat: 48.876517,
            long: 2.330785,
            value: "1 rue de Londres, 75009 Paris",
            streetName: "rue de Londres",
          },
        });

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection<SqlSite>("sites").select(
        "id",
        "name",
        "is_friche",
        "friche_activity",
        "surface_area",
      );
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual({
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        name: "Ancienne gare de Bercy",
        surface_area: "15000.00",
        friche_activity: "RAILWAY",
        is_friche: true,
      });
    });
  });
});
