import { INestApplication } from "@nestjs/common";
import { Knex } from "knex";
import { Server } from "net";
import supertest from "supertest";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { CreateSiteBodyDto } from "./sites.controller";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

describe("Sites controller", () => {
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

  const buildValidSitePayload = () => {
    const validSiteBody: CreateSiteBodyDto = {
      id: "03a53ffd-4f71-419e-8d04-041311eefa23",
      createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
      creationMode: "custom",
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
    return validSiteBody;
  };

  describe("POST /sites", () => {
    it.each([
      "id",
      "isFriche",
      "creationMode",
      "name",
      "address",
      "surfaceArea",
      "soilsDistribution",
      "owner",
      "yearlyExpenses",
      "yearlyIncomes",
    ] as (keyof CreateSiteBodyDto)[])(
      "can't create a site without mandatory field %s",
      async (mandatoryField) => {
        const requestBody = buildValidSitePayload();
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer()).post("/api/sites").send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it("can create a site", async () => {
      const validSite = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        creationMode: "custom",
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
      const response = await supertest(app.getHttpServer()).post("/api/sites").send(validSite);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select(
        "id",
        "name",
        "surface_area",
        "creation_mode",
      );
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual({
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        name: "Friche industrielle",
        surface_area: 2900.0,
        creation_mode: "custom",
      });
    });

    it("can create a friche site", async () => {
      const response = await supertest(app.getHttpServer())
        .post("/api/sites")
        .send({
          id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
          createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
          creationMode: "express",
          name: "Ancienne gare de Bercy",
          isFriche: true,
          fricheActivity: "RAILWAY",
          owner: { structureType: "department", name: "Le département Paris" },
          tenant: { structureType: "company", name: "Tenant SARL" },
          soilsDistribution: {
            BUILDINGS: 12300,
            MINERAL_SOIL: 12000,
            PRAIRIE_GRASS: 50000,
          },
          surfaceArea: 15000,
          yearlyExpenses: [],
          yearlyIncomes: [],
          hasRecentAccidents: true,
          accidentsMinorInjuries: 1,
          accidentsSevereInjuries: 2,
          accidentsDeaths: 0,
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

      const sitesInDb = await sqlConnection("sites").select(
        "id",
        "name",
        "is_friche",
        "friche_activity",
        "surface_area",
        "friche_accidents_deaths",
        "friche_accidents_severe_injuries",
        "friche_accidents_minor_injuries",
        "creation_mode",
      );
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual({
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        creation_mode: "express",
        name: "Ancienne gare de Bercy",
        surface_area: 15000.0,
        friche_activity: "RAILWAY",
        is_friche: true,
        friche_accidents_deaths: 0,
        friche_accidents_severe_injuries: 2,
        friche_accidents_minor_injuries: 1,
      });
    });
  });

  describe("GET /sites/:siteId", () => {
    it("gets a 404 error when site does not exist", async () => {
      const siteId = uuid();
      const response = await supertest(app.getHttpServer()).get(`/sites/${siteId}`).send();

      expect(response.status).toEqual(404);
    });

    it("gets a 200 response when site exists", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        name: "Friche Amiens",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_structure_type: "company",
        created_at: new Date(),
        is_friche: true,
        friche_activity: "INDUSTRY",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
        friche_accidents_deaths: 1,
        friche_accidents_minor_injuries: 2,
        friche_accidents_severe_injuries: 3,
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        value: "8 Boulevard du Port 80000 Amiens",
        street_number: "8",
        street_name: "Boulevard du Port",
        city_code: "80021",
        post_code: "80000",
        city: "Amiens",
        ban_id: "80021_6590_00008",
        long: 49.897443,
        lat: 2.290084,
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "FOREST_MIXED", surface_area: 1200 },
        { id: uuid(), site_id: siteId, soil_type: "PRAIRIE_GRASS", surface_area: 12800 },
      ]);
      await sqlConnection("site_expenses").insert([
        {
          id: uuid(),
          site_id: siteId,
          amount: 3300,
          purpose: "security",
          bearer: "owner",
        },
      ]);
      const response = await supertest(app.getHttpServer()).get(`/api/sites/${siteId}`).send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: siteId,
        name: "Friche Amiens",
        isExpressSite: false,
        surfaceArea: 14000,
        owner: { name: "Owner name", structureType: "company" },
        tenant: { structureType: "company" },
        isFriche: true,
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 230,
        address: {
          value: "8 Boulevard du Port 80000 Amiens",
          streetNumber: "8",
          streetName: "Boulevard du Port",
          banId: "80021_6590_00008",
          postCode: "80000",
          cityCode: "80021",
          city: "Amiens",
          long: 49.897443,
          lat: 2.290084,
        },
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        description: "Description of site",
        fricheActivity: "INDUSTRY",
        yearlyExpenses: [{ amount: 3300, purpose: "security" }],
        accidentsDeaths: 1,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 3,
      });
    });
  });
});
