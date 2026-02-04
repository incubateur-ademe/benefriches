import { NestExpressApplication } from "@nestjs/platform-express";
import { Knex } from "knex";
import {
  CreateCustomSiteDto,
  CreateExpressSiteDto,
  GetSiteRealEstateValuationResponseDto,
  GetSiteViewResponseDto,
} from "shared";
import supertest from "supertest";
import { authenticateUser, createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { ACCESS_TOKEN_COOKIE_KEY } from "src/auth/adapters/access-token/accessTokenCookie";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlSite } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { InMemoryMutabilityEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/InMemoryMutabilityEvaluationQuery";
import { MutafrichesEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/MutafrichesEvaluationQuery";
import { UserBuilder } from "src/users/core/model/user.mock";

type BadRequestResponseBody = {
  errors: { path: string[] }[];
};

function expectBadRequestWithMissingField(
  response: supertest.Response,
  missingField: string,
): void {
  expect(response.status).toEqual(400);
  expect(response.body).toHaveProperty("errors");

  const responseErrors = (response.body as BadRequestResponseBody).errors;
  expect(responseErrors).toHaveLength(1);
  expect(responseErrors[0]?.path).toContain(missingField);
}

describe("Sites controller", () => {
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

  describe("POST /sites/create-express", () => {
    // oxlint-disable-next-line vitest/expect-expect
    it.each(["id", "nature", "createdBy", "address"] satisfies (keyof CreateExpressSiteDto)[])(
      "can't create a site without mandatory field %s",
      async (mandatoryField) => {
        const requestBody: CreateExpressSiteDto = {
          id: "03a53ffd-4f71-419e-8d04-041311eefa23",
          createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
          nature: "AGRICULTURAL_OPERATION",
          activity: "CATTLE_FARMING",
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
        // oxlint-disable-next-line typescript/no-dynamic-delete
        delete requestBody[mandatoryField];

        const response = await supertest(app.getHttpServer())
          .post("/api/sites/create-express")
          .send(requestBody);

        expectBadRequestWithMissingField(response, mandatoryField);
      },
    );

    // oxlint-disable-next-line vitest/expect-expect
    it("can't create an express friche without friche activity", async () => {
      const requestBody: Omit<CreateExpressSiteDto, "fricheActivity"> = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
        nature: "FRICHE",
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

      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-express")
        .send(requestBody);

      expectBadRequestWithMissingField(response, "fricheActivity");
    });

    // oxlint-disable-next-line vitest/expect-expect
    it("can't create an express agricultral operation without activity", async () => {
      const requestBody: Omit<CreateExpressSiteDto, "activity"> = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
        nature: "AGRICULTURAL_OPERATION",
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

      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-express")
        .send(requestBody);

      expectBadRequestWithMissingField(response, "activity");
    });

    // oxlint-disable-next-line vitest/expect-expect
    it("can't create an express natural area without activity", async () => {
      const requestBody: Omit<CreateExpressSiteDto, "type"> = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "dadf207d-f0c1-4e38-8fe9-9ae5b0e123c4",
        nature: "NATURAL_AREA",
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

      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-express")
        .send(requestBody);

      expectBadRequestWithMissingField(response, "type");
    });

    it("can create an agricultural operation from express props", async () => {
      const agriculturalOperationDto: CreateExpressSiteDto = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        nature: "AGRICULTURAL_OPERATION",
        surfaceArea: 12000,
        activity: "MARKET_GARDENING",
        address: {
          lat: 2.347,
          long: 48.859,
          // using a city that is mocked in MockCityDataService
          city: "Longlaville",
          banId: "79f390cd-afe8-41ba-bd62-6b095eb8e6bd",
          cityCode: "54321",
          postCode: "54810",
          value: "Longlaville",
        },
      };
      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-express")
        .send(agriculturalOperationDto);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select(
        "id",
        "created_by",
        "nature",
        "surface_area",
      );
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual({
        id: agriculturalOperationDto.id,
        nature: "AGRICULTURAL_OPERATION",
        created_by: agriculturalOperationDto.createdBy,
        surface_area: 12000,
      });
    });

    it("can create a friche from express props", async () => {
      const frichDto: CreateExpressSiteDto = {
        id: "599e0580-06eb-4cdd-9c87-aa84ae41a5aa",
        createdBy: "6c97f648-4e22-481e-9bc4-106ff00accdf",
        nature: "FRICHE",
        surfaceArea: 134000,
        fricheActivity: "INDUSTRY",
        address: {
          lat: 2.347,
          long: 48.859,
          // using a city that is mocked in MockCityDataService
          city: "Longlaville",
          banId: "79f390cd-afe8-41ba-bd62-6b095eb8e6bd",
          cityCode: "54321",
          postCode: "54810",
          value: "Longlaville",
        },
      };
      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-express")
        .send(frichDto);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select(
        "id",
        "nature",
        "created_by",
        "surface_area",
        "friche_activity",
      );
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual({
        id: frichDto.id,
        nature: "FRICHE",
        created_by: frichDto.createdBy,
        surface_area: 134000,
        friche_activity: "INDUSTRY",
      });
    });
  });

  describe("POST /sites/create-custom", () => {
    it.each([
      "id",
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
          nature: "AGRICULTURAL_OPERATION",
          isSiteOperated: false,
          owner: { name: "Owner name", structureType: "company" },
          name: "Exploitation agricole",
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
          agriculturalOperationActivity: "CATTLE_FARMING",
        };
        // oxlint-disable-next-line typescript/no-dynamic-delete
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

    it("can create an agricultural operation", async () => {
      const agriculturalOperationDto: CreateCustomSiteDto = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        nature: "AGRICULTURAL_OPERATION",
        agriculturalOperationActivity: "CATTLE_FARMING",
        isSiteOperated: true,
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
        .send(agriculturalOperationDto);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select("*");
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual<SqlSite>({
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        created_by: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        created_at: expect.any(Date),
        description: "Description of site",
        name: "Exploitation agricole",
        nature: "AGRICULTURAL_OPERATION",
        agricultural_operation_activity: "CATTLE_FARMING",
        natural_area_type: null,
        surface_area: 2900.0,
        creation_mode: "custom",
        owner_name: "Owner name",
        owner_structure_type: "company",
        is_operated: true,
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
        { value: agriculturalOperationDto.address.value, site_id: agriculturalOperationDto.id },
      ]);

      const soilsDistributionInDb = await sqlConnection("site_soils_distributions").select(
        "surface_area",
        "soil_type",
        "site_id",
      );
      expect(soilsDistributionInDb).toEqual([
        { soil_type: "PRAIRIE_GRASS", surface_area: 1400.0, site_id: agriculturalOperationDto.id },
        { soil_type: "MINERAL_SOIL", surface_area: 1500.0, site_id: agriculturalOperationDto.id },
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
          site_id: agriculturalOperationDto.id,
          bearer: "owner",
        },
      ]);

      const incomesInDb = await sqlConnection("site_incomes").select("amount", "source", "site_id");
      expect(incomesInDb).toEqual([
        { amount: 200.0, source: "other", site_id: agriculturalOperationDto.id },
      ]);
    });

    it("can create a natural area site", async () => {
      const naturalAreaDto: CreateCustomSiteDto = {
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        nature: "NATURAL_AREA",
        naturalAreaType: "FOREST",
        name: "Forêt",
        description: "Description of site",
        owner: { name: "Owner name", structureType: "company" },
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
          FOREST_POPLAR: 1500,
        },
        yearlyExpenses: [],
        yearlyIncomes: [],
      };
      const response = await supertest(app.getHttpServer())
        .post("/api/sites/create-custom")
        .send(naturalAreaDto);

      expect(response.status).toEqual(201);

      const sitesInDb = await sqlConnection("sites").select("*");
      expect(sitesInDb.length).toEqual(1);
      expect(sitesInDb[0]).toEqual<SqlSite>({
        id: "03a53ffd-4f71-419e-8d04-041311eefa23",
        created_by: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        created_at: expect.any(Date),
        description: "Description of site",
        name: "Forêt",
        nature: "NATURAL_AREA",
        agricultural_operation_activity: null,
        natural_area_type: "FOREST",
        surface_area: 2900.0,
        creation_mode: "custom",
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: null,
        tenant_structure_type: null,
        friche_accidents_deaths: null,
        friche_accidents_severe_injuries: null,
        friche_accidents_minor_injuries: null,
        friche_activity: null,
        friche_contaminated_soil_surface_area: null,
        friche_has_contaminated_soils: null,
        is_operated: null,
      });

      const siteAddressInDb = await sqlConnection("addresses").select("value", "site_id");
      expect(siteAddressInDb).toEqual([
        { value: naturalAreaDto.address.value, site_id: naturalAreaDto.id },
      ]);

      const soilsDistributionInDb = await sqlConnection("site_soils_distributions").select(
        "surface_area",
        "soil_type",
        "site_id",
      );
      expect(soilsDistributionInDb).toEqual([
        { soil_type: "PRAIRIE_GRASS", surface_area: 1400.0, site_id: naturalAreaDto.id },
        { soil_type: "FOREST_POPLAR", surface_area: 1500.0, site_id: naturalAreaDto.id },
      ]);
    });

    it("can create a friche site", async () => {
      const fricheDto: CreateCustomSiteDto = {
        id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
        nature: "FRICHE",
        createdBy: "74ac340f-0654-4887-9449-3dbb43ce35b5",
        name: "Ancienne gare de Bercy",
        description: "Description of site",
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
        // oxlint-disable-next-line typescript/no-unsafe-assignment
        created_at: expect.any(Date),
        description: "Description of site",
        friche_activity: "RAILWAY",
        nature: "FRICHE",
        friche_accidents_deaths: 0,
        friche_accidents_severe_injuries: 2,
        friche_accidents_minor_injuries: 1,
        agricultural_operation_activity: null,
        natural_area_type: null,
        is_operated: null,
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

  describe("GET /sites/:siteId/features", () => {
    it("gets a 401 error when no authentication is provided", async () => {
      const siteId = uuid();
      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/features`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=nope`)
        .send();

      expect(response.status).toEqual(401);
    });

    it("gets a 404 error when site does not exist", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/features`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(404);
    });

    it("gets a 200 response when site exists", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Friche Amiens",
        nature: "FRICHE",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_structure_type: "company",
        created_at: new Date(),
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

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/features`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: siteId,
        name: "Friche Amiens",
        nature: "FRICHE",
        isExpressSite: false,
        surfaceArea: 14000,
        owner: { name: "Owner name", structureType: "company" },
        tenant: { structureType: "company" },
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
        yearlyIncomes: [],
        accidentsDeaths: 1,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 3,
      });
    });

    it("gets a 200 response and returns agricultural site with incomes", async () => {
      const siteId = uuid();

      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Viticulture Amiens",
        nature: "AGRICULTURAL_OPERATIONS",
        agricultural_operation_activity: "CATTLE_FARMING",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_structure_type: "company",
        created_at: new Date(),
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
          purpose: "operationCosts",
          bearer: "owner",
        },
      ]);

      await sqlConnection("site_incomes").insert([
        {
          id: uuid(),
          site_id: siteId,
          amount: 5000,
          source: "subsidies",
        },
      ]);

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/features`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: siteId,
        name: "Viticulture Amiens",
        nature: "AGRICULTURAL_OPERATIONS",
        agriculturalOperationActivity: "CATTLE_FARMING",
        isExpressSite: false,
        surfaceArea: 14000,
        owner: { name: "Owner name", structureType: "company" },
        tenant: { structureType: "company" },
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
        yearlyExpenses: [{ amount: 3300, purpose: "operationCosts" }],
        yearlyIncomes: [{ amount: 5000, source: "subsidies" }],
      });
    });

    it("gets a 200 response and returns natural area site with type", async () => {
      const siteId = uuid();

      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Prairie Amiens",
        nature: "NATURAL_AREA",
        natural_area_type: "PRAIRIE",
        description: "Description of site",
        surface_area: 15000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        created_at: new Date(),
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
        { id: uuid(), site_id: siteId, soil_type: "PRAIRIE_GRASS", surface_area: 15000 },
      ]);

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/features`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual({
        id: siteId,
        nature: "NATURAL_AREA",
        name: "Prairie Amiens",
        naturalAreaType: "PRAIRIE",
        isExpressSite: false,
        surfaceArea: 15000,
        owner: { name: "Owner name", structureType: "company" },
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
          PRAIRIE_GRASS: 15000,
        },
        description: "Description of site",
        yearlyExpenses: [],
        yearlyIncomes: [],
      });
    });
  });

  describe("GET /sites/:siteId", () => {
    it("gets a 401 error when no authentication is provided", async () => {
      const siteId = uuid();
      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=nope`)
        .send();

      expect(response.status).toEqual(401);
    });

    it("gets a 404 error when site does not exist", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(404);
    });

    it("gets a 200 response with site features, actions and reconversion projects", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      const project1Id = uuid();
      const project2Id = uuid();

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Friche with projects",
        nature: "FRICHE",
        description: "Site description",
        surface_area: 20000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        created_at: new Date(),
        friche_activity: "INDUSTRY",
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        value: "10 Rue Test 75001 Paris",
        city: "Paris",
        city_code: "75001",
        post_code: "75001",
        ban_id: "75001_test",
        lat: 48.856614,
        long: 2.352222,
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "BUILDINGS", surface_area: 20000 },
      ]);

      await sqlConnection("reconversion_projects").insert([
        {
          id: project1Id,
          name: "Solar Project",
          related_site_id: siteId,
          created_by: user.id,
          creation_mode: "custom",
          created_at: new Date(),
        },
        {
          id: project2Id,
          name: "Urban Project",
          related_site_id: siteId,
          created_by: user.id,
          creation_mode: "express",
          created_at: new Date(),
        },
      ]);

      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: uuid(),
          type: "PHOTOVOLTAIC_POWER_PLANT",
          reconversion_project_id: project1Id,
          features: {},
        },
        {
          id: uuid(),
          type: "URBAN_PROJECT",
          reconversion_project_id: project2Id,
          features: {},
        },
      ]);

      await sqlConnection("site_actions").insert([
        {
          id: uuid(),
          site_id: siteId,
          action_type: "EVALUATE_COMPATIBILITY",
          status: "todo",
          created_at: new Date(),
        },
        {
          id: uuid(),
          site_id: siteId,
          action_type: "REQUEST_FUNDING_INFORMATION",
          status: "done",
          created_at: new Date(),
        },
      ]);

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual<GetSiteViewResponseDto>({
        id: siteId,
        features: {
          id: siteId,
          name: "Friche with projects",
          nature: "FRICHE",
          isExpressSite: false,
          surfaceArea: 20000,
          owner: { name: "Owner name", structureType: "company" },
          address: {
            value: "10 Rue Test 75001 Paris",
            city: "Paris",
            cityCode: "75001",
            postCode: "75001",
            banId: "75001_test",
            lat: 48.856614,
            long: 2.352222,
          },
          soilsDistribution: {
            BUILDINGS: 20000,
          },
          description: "Site description",
          fricheActivity: "INDUSTRY",
          yearlyExpenses: [],
          yearlyIncomes: [],
        },
        actions: [
          { action: "EVALUATE_COMPATIBILITY", status: "todo" },
          { action: "REQUEST_FUNDING_INFORMATION", status: "done" },
        ],
        reconversionProjects: [
          {
            id: project1Id,
            name: "Solar Project",
            type: "PHOTOVOLTAIC_POWER_PLANT",
            express: false,
          },
          {
            id: project2Id,
            name: "Urban Project",
            type: "URBAN_PROJECT",
            express: true,
          },
        ],
        compatibilityEvaluation: null,
      });
    });

    it("gets a 200 response with site features, actions and compatibility evaluation", async () => {
      // Prepare in-memory MutafrichesEvaluationQuery with a mocked response
      const mutafrichesEvaluationId = uuid();
      const inMemoryMutafrichesQuery = new InMemoryMutabilityEvaluationQuery();
      inMemoryMutafrichesQuery.setResponseForId(mutafrichesEvaluationId, {
        mutafrichesId: mutafrichesEvaluationId,
        usages: [{ rank: 1, usage: "culture", score: 5 }],
        reliabilityScore: 3,
      });

      const app = await createTestApp({
        providerOverrides: [
          { token: MutafrichesEvaluationQuery, useValue: inMemoryMutafrichesQuery },
        ],
      });
      await app.init();

      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Friche with compatibility evaluation",
        nature: "FRICHE",
        description: "Site with evaluation",
        surface_area: 25000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        created_at: new Date(),
        friche_activity: "INDUSTRY",
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        value: "15 Boulevard Test 75002 Paris",
        city: "Paris",
        city_code: "75002",
        post_code: "75002",
        ban_id: "75002_eval",
        lat: 48.8566,
        long: 2.3522,
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "BUILDINGS", surface_area: 25000 },
      ]);

      await sqlConnection("site_actions").insert([
        {
          id: uuid(),
          site_id: siteId,
          action_type: "EVALUATE_COMPATIBILITY",
          status: "done",
          created_at: new Date(),
        },
      ]);

      await sqlConnection("reconversion_compatibility_evaluations").insert({
        id: uuid(),
        created_by: user.id,
        related_site_id: siteId,
        mutafriches_evaluation_id: mutafrichesEvaluationId,
        status: "completed",
        created_at: new Date(),
      });

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      expect(response.body).toEqual<GetSiteViewResponseDto>({
        id: siteId,
        features: {
          id: siteId,
          name: "Friche with compatibility evaluation",
          nature: "FRICHE",
          isExpressSite: false,
          surfaceArea: 25000,
          owner: { name: "Owner name", structureType: "company" },
          address: {
            value: "15 Boulevard Test 75002 Paris",
            city: "Paris",
            cityCode: "75002",
            postCode: "75002",
            banId: "75002_eval",
            lat: 48.8566,
            long: 2.3522,
          },
          soilsDistribution: {
            BUILDINGS: 25000,
          },
          description: "Site with evaluation",
          fricheActivity: "INDUSTRY",
          yearlyExpenses: [],
          yearlyIncomes: [],
        },
        actions: [{ action: "EVALUATE_COMPATIBILITY", status: "done" }],
        reconversionProjects: [],
        compatibilityEvaluation: {
          results: [
            {
              score: 5,
              usage: "culture",
            },
          ],
          reliabilityScore: 3,
        },
      });
    });
  });

  describe("GET /sites/:siteId/real-estate-valuation", () => {
    it("gets a 401 error when no authentication is provided", async () => {
      const siteId = uuid();
      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/real-estate-valuation`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=nope`)
        .send();

      expect(response.status).toEqual(401);
    });

    it("gets a 404 error when site does not exist", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/real-estate-valuation`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(404);
    });

    it("gets a 200 response with correct valuation for existing site", async () => {
      const user = new UserBuilder().asLocalAuthority().build();
      const { accessToken } = await authenticateUser(app)(user);

      const siteId = uuid();
      // City code 75056 (Paris) has propertyValueMedianPricePerSquareMeters = 10540 €/m² in seeded city_stats
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: user.id,
        name: "Test Site",
        nature: "FRICHE",
        surface_area: 1000, // 1000 m²
        owner_structure_type: "company",
        created_at: new Date(),
        friche_activity: "INDUSTRY",
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        value: "10 Rue Test 75001 Paris",
        city: "Paris",
        city_code: "75056", // Paris - 10540 €/m² from seeded city_stats
        post_code: "75001",
        ban_id: "75001_test",
        lat: 48.856614,
        long: 2.352222,
      });

      const response = await supertest(app.getHttpServer())
        .get(`/api/sites/${siteId}/real-estate-valuation`)
        .set("Cookie", `${ACCESS_TOKEN_COOKIE_KEY}=${accessToken}`)
        .send();

      expect(response.status).toEqual(200);
      // sellingPrice = 1000 * 10540 = 10_540_000
      // propertyTransferDuties = 10_540_000 * 0.0581 (TRANSFER_TAX_PERCENT_PER_TRANSACTION) = 612_374
      expect(response.body).toEqual<GetSiteRealEstateValuationResponseDto>({
        sellingPrice: 10_540_000,
        propertyTransferDuties: 612_374,
      });
    });
  });
});
