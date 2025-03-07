import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SiteViewModel } from "src/sites/core/usecases/getSiteById.usecase";

import { SqlSitesQuery } from "./SqlSitesQuery";

describe("SqlSitesQuery integration", () => {
  let sqlConnection: Knex;
  let sitesQuery: SqlSitesQuery;
  const now = new Date();

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    sitesQuery = new SqlSitesQuery(sqlConnection);
  });

  describe("getById", () => {
    it("gets friche with exhaustive data and address, soils distribution and yearly expenses", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site 123",
        description: "Description of site",
        nature: "FRICHE",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: now,
        is_friche: true,
        friche_activity: "INDUSTRIAL",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 1200,
        friche_accidents_deaths: 0,
        friche_accidents_minor_injuries: 1,
        friche_accidents_severe_injuries: 2,
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        city: "Paris",
        city_code: "75109",
        post_code: "75009",
        ban_id: "123abc",
        lat: 48.876517,
        long: 2.330785,
        value: "1 rue de Londres, 75009 Paris",
        street_name: "rue de Londres",
        street_number: "1",
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "FOREST_MIXED", surface_area: 1200 },
        { id: uuid(), site_id: siteId, soil_type: "PRAIRIE_GRASS", surface_area: 12800 },
      ]);

      await sqlConnection("site_expenses").insert([
        {
          id: uuid(),
          site_id: siteId,
          purpose: "rent",
          bearer: "tenant",
          amount: 45000,
        },
        {
          id: uuid(),
          site_id: siteId,
          purpose: "maintenance",
          bearer: "tenant",
          amount: 55000,
        },
      ]);

      const result = await sitesQuery.getById(siteId);

      const expectedResult: Required<SiteViewModel> = {
        id: siteId,
        name: "Site 123",
        nature: "FRICHE",
        isExpressSite: false,
        description: "Description of site",
        surfaceArea: 14000,
        owner: { name: "Owner name", structureType: "company" },
        tenant: { name: "Tenant name", structureType: "company" },
        isFriche: true,
        hasContaminatedSoils: true,
        yearlyExpenses: [
          { amount: 45000, purpose: "rent" },
          { amount: 55000, purpose: "maintenance" },
        ],
        contaminatedSoilSurface: 1200,
        address: {
          city: "Paris",
          cityCode: "75109",
          postCode: "75009",
          banId: "123abc",
          lat: 48.876517,
          long: 2.330785,
          value: "1 rue de Londres, 75009 Paris",
          streetName: "rue de Londres",
          streetNumber: "1",
        },
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        accidentsDeaths: 0,
        accidentsMinorInjuries: 1,
        accidentsSevereInjuries: 2,
        fricheActivity: "INDUSTRIAL",
      };

      expect(result).toEqual(expectedResult);
    });

    it("gets agricultural operation with only required data", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site 456",
        nature: "AGRICULTURAL_OPERATION",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: now,
        is_friche: false,
        creation_mode: "express",
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        city: "Paris",
        city_code: "75109",
        post_code: "75009",
        lat: 48.876517,
        long: 2.330785,
        ban_id: "123abc",
        value: "1 rue de Londres, 75009 Paris",
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

      const result = await sitesQuery.getById(siteId);

      const expectedResult: SiteViewModel = {
        id: siteId,
        name: "Site 456",
        nature: "AGRICULTURAL_OPERATION",
        surfaceArea: 14000,
        isExpressSite: true,
        owner: { structureType: "company" },
        isFriche: false,
        yearlyExpenses: [{ amount: 3300, purpose: "security" }],
        address: {
          city: "Paris",
          cityCode: "75109",
          postCode: "75009",
          banId: "123abc",
          lat: 48.876517,
          long: 2.330785,
          value: "1 rue de Londres, 75009 Paris",
        },
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
      };

      expect(result).toEqual(expectedResult);
    });

    it("gets site when no expenses, no soils_distribution, no address", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site 456",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: now,
        is_friche: false,
      });

      const result = await sitesQuery.getById(siteId);

      expect(result?.id).toEqual(siteId);
      expect(result?.yearlyExpenses).toEqual([]);
      expect(result?.soilsDistribution).toEqual({});
      expect(result?.address.banId).toBeNull();
    });

    it("returns undefined when site does not exist", async () => {
      const nonExistingSiteId = uuid();
      await sqlConnection("sites").insert({
        id: uuid(),
        nature: "FRICHE",
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site 123",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: now,
        is_friche: true,
        friche_activity: "BUILDING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
      });

      const result = await sitesQuery.getById(nonExistingSiteId);

      expect(result).toEqual(undefined);
    });
  });
});
