import { INestApplication } from "@nestjs/common";
import { Knex } from "knex";
import { Server } from "net";
import supertest from "supertest";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlSite } from "src/shared-kernel/adapters/sql-knex/tableTypes";

import { CreateCustomSiteDto, CreateExpressSiteDto } from "./sites.controller";

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

  describe("POST /sites/create-express", () => {
    it.each(["id", "nature", "createdBy", "address"] satisfies (keyof CreateExpressSiteDto)[])(
      "can't create a site without mandatory field %s",
      async (mandatoryField) => {
        const requestBody: CreateExpressSiteDto = {
          id: "03a53ffd-4f71-419e-8d04-041311eefa23",
          createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
          nature: "AGRICULTURAL",
          surfaceArea: 12399,
          address: {
            lat: 2.347,
            long: 48.859,
            city: "Paris",
            banId: "75110_7043",
            cityCode: "75110",
            postCode: "75010",
            value: "Rue de Paradis 75010 Paris",
          },
        };
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer())
          .post("/api/sites/create-express")
          .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );
  });

  describe("POST /sites/create-custom", () => {
    it.each([
      "id",
      "isFriche",
      "nature",
      "createdBy",
      "name",
      "address",
      "soilsDistribution",
      "yearlyExpenses",
      "yearlyIncomes",
    ] satisfies (keyof CreateCustomSiteDto)[])(
      "can't create a site without mandatory field %s",
      async (mandatoryField) => {
        const requestBody = {
          id: "03a53ffd-4f71-419e-8d04-041311eefa23",
          createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
          isFriche: false,
          nature: "AGRICULTURAL",
          owner: { name: "Owner name", structureType: "company" },
          name: "Friche industrielle",
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
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer())
          .post("/api/sites/create-custom")
          .send(requestBody);

        expect(response.status).toEqual(400);
        expect(response.body).toHaveProperty("errors");

        const responseErrors = (response.body as BadRequestResponseBody).errors;
        expect(responseErrors).toHaveLength(1);
        expect(responseErrors[0]?.path).toContain(mandatoryField);
      },
    );

    it("can create an agricultural site", async () => {
      const agriculturalSiteDto: CreateCustomSiteDto = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        isFriche: false,
        nature: "AGRICULTURAL",
        name: "Exploitation agricole",
        description: "Description of site",
        owner: { name: "Owner name", structureType: "company" },
        tenant: { name: "Tenant name", structureType: "private_individual" },
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
          PRAIRIE_GRASS: 1400,
          MINERAL_SOIL: 1500,
        },
        yearlyExpenses: [
          {
            amount: 1000,
            bearer: "owner",
            purpose: "security",
          },
        ],
        yearlyIncomes: [
          {
            amount: 200,
            source: "other",
          },
        ],
      };
      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-custom")
        .send(agriculturalSiteDto);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select("*");
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual<SqlSite>({
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        created_by: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        created_at: expect.any(Date),
        description: "Description of site",
        name: "Exploitation agricole",
        surface_area: 2900.0,
        creation_mode: "custom",
        owner_name: "Owner name",
        owner_structure_type: "company",
        is_friche: false,
        tenant_name: "Tenant name",
        tenant_structure_type: "private_individual",
        friche_accidents_deaths: null,
        friche_accidents_severe_injuries: null,
        friche_accidents_minor_injuries: null,
        friche_activity: null,
        friche_contaminated_soil_surface_area: null,
        friche_has_contaminated_soils: null,
      });

      const siteAddressInDb = await sqlConnection("addresses").select("value", "site_id");
      expect(siteAddressInDb).toEqual([
        { value: agriculturalSiteDto.address.value, site_id: agriculturalSiteDto.id },
      ]);

      const soilsDistributionInDb = await sqlConnection("site_soils_distributions").select(
        "surface_area",
        "soil_type",
        "site_id",
      );
      expect(soilsDistributionInDb).toEqual([
        { soil_type: "PRAIRIE_GRASS", surface_area: 1400.0, site_id: agriculturalSiteDto.id },
        { soil_type: "MINERAL_SOIL", surface_area: 1500.0, site_id: agriculturalSiteDto.id },
      ]);

      const expensesInDb = await sqlConnection("site_expenses").select(
        "amount",
        "purpose",
        "bearer",
        "site_id",
      );
      expect(expensesInDb).toEqual([
        {
          amount: 1000.0,
          purpose: "security",
          site_id: agriculturalSiteDto.id,
          bearer: "owner",
        },
      ]);

      const incomesInDb = await sqlConnection("site_incomes").select("amount", "source", "site_id");
      expect(incomesInDb).toEqual([
        { amount: 200.0, source: "other", site_id: agriculturalSiteDto.id },
      ]);
    });

    it("can create a friche site", async () => {
      const fricheDto: CreateCustomSiteDto = {
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        nature: "FRICHE",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        name: "Ancienne gare de Bercy",
        description: "Description of site",
        isFriche: true,
        fricheActivity: "RAILWAY",
        owner: { structureType: "department", name: "Le département Paris" },
        tenant: { structureType: "company", name: "Tenant SARL" },
        soilsDistribution: {
          BUILDINGS: 12300,
          MINERAL_SOIL: 12000,
          PRAIRIE_GRASS: 50000,
        },
        yearlyExpenses: [
          {
            amount: 45000,
            purpose: "maintenance",
            bearer: "owner",
          },
        ],
        yearlyIncomes: [],
        accidentsMinorInjuries: 1,
        accidentsSevereInjuries: 2,
        accidentsDeaths: 0,
        contaminatedSoilSurface: 1400.3,
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
      };
      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-custom")
        .send(fricheDto);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select("*");
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual<SqlSite>({
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        created_by: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        creation_mode: "custom",
        name: "Ancienne gare de Bercy",
        owner_structure_type: "department",
        owner_name: "Le département Paris",
        tenant_structure_type: "company",
        tenant_name: "Tenant SARL",
        friche_contaminated_soil_surface_area: 1400.3,
        friche_has_contaminated_soils: true,
        surface_area: 74300,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        created_at: expect.any(Date),
        description: "Description of site",
        friche_activity: "RAILWAY",
        is_friche: true,
        friche_accidents_deaths: 0,
        friche_accidents_severe_injuries: 2,
        friche_accidents_minor_injuries: 1,
      });

      const siteAddressInDb = await sqlConnection("addresses").select("value", "site_id");
      expect(siteAddressInDb).toEqual([{ value: fricheDto.address.value, site_id: fricheDto.id }]);

      const soilsDistributionInDb = await sqlConnection("site_soils_distributions").select(
        "surface_area",
        "soil_type",
        "site_id",
      );
      expect(soilsDistributionInDb).toEqual([
        { soil_type: "BUILDINGS", surface_area: 12300.0, site_id: fricheDto.id },
        { soil_type: "MINERAL_SOIL", surface_area: 12000.0, site_id: fricheDto.id },
        { soil_type: "PRAIRIE_GRASS", surface_area: 50000.0, site_id: fricheDto.id },
      ]);

      const expensesInDb = await sqlConnection("site_expenses").select(
        "amount",
        "purpose",
        "bearer",
        "site_id",
      );
      expect(expensesInDb).toEqual([
        { amount: 45000.0, purpose: "maintenance", site_id: fricheDto.id, bearer: "owner" },
      ]);

      const incomesInDb = await sqlConnection("site_incomes").select("amount", "source");
      expect(incomesInDb).toEqual([]);
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
