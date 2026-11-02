import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { type SiteImpactsDataView } from "shared";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlSiteImpactsQuery } from "./SqlSiteImpactsQuery";

describe("SqlSiteImpactsQuery integration", () => {
  let sqlConnection: Knex;
  let siteQuery: SqlSiteImpactsQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    siteQuery = new SqlSiteImpactsQuery(sqlConnection);
  });

  describe("getById", () => {
    it("gets site with ALL data needed for impact computation", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site 123",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Current site owner",
        owner_structure_type: "company",
        tenant_name: "Current tenant",
        tenant_structure_type: "company",
        created_at: new Date(),
        nature: "FRICHE",
        friche_activity: "BUILDING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
        friche_accidents_deaths: 1,
        friche_accidents_minor_injuries: 2,
        friche_accidents_severe_injuries: 0,
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "FOREST_MIXED", surface_area: 1200 },
        { id: uuid(), site_id: siteId, soil_type: "PRAIRIE_GRASS", surface_area: 12800 },
      ]);

      await sqlConnection("site_expenses").insert([
        {
          id: uuid(),
          site_id: siteId,
          amount: 100,
          bearer: "tenant",
          purpose: "rent",
        },
      ]);

      await sqlConnection("addresses").insert({
        id: uuid(),
        ban_id: "123456",
        city: "City name",
        post_code: "1234",
        value: "1 rue de la paix",
        site_id: siteId,
        city_code: "01234",
      });

      const result = await siteQuery.getById(siteId);

      // The satisfies annotation below enforces at compile-time that the non-optional
      // fields of SiteImpactsDataView are all present and correctly typed.
      const expected = {
        id: siteId,
        name: "Site 123",
        nature: "FRICHE",
        description: "Description of site",
        fricheActivity: "BUILDING",
        address: {
          cityCode: "01234",
          value: "1 rue de la paix",
          banId: "123456",
          city: "City name",
          postCode: "1234",
          long: 0,
          lat: 0,
        },
        contaminatedSoilSurface: 230,
        surfaceArea: 14000,
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        accidentsDeaths: 1,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 0,
        ownerStructureType: "company",
        ownerName: "Current site owner",
        tenantName: "Current tenant",
        tenantStructureType: "company",
        yearlyExpenses: [{ amount: 100, bearer: "tenant", purpose: "rent" }],
        yearlyIncomes: [],
        isExpressSite: false,
      } satisfies Required<
        Omit<
          SiteImpactsDataView,
          "agriculturalOperationActivity" | "isSiteOperated" | "naturalAreaType"
        >
      >;
      assert.deepStrictEqual(result, {
        ...expected,
        agriculturalOperationActivity: undefined,
        isSiteOperated: undefined,
        naturalAreaType: undefined,
      });
    });

    it("gets site with data needed for impact computation when no accidents and no contaminated surface", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site 123",
        description: "Description of site",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        created_at: new Date(),
        nature: "AGRICULTURAL_OPERATION",
        agricultural_operation_activity: "CATTLE_FARMING",
        is_operated: true,
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "FOREST_MIXED", surface_area: 1200 },
        { id: uuid(), site_id: siteId, soil_type: "PRAIRIE_GRASS", surface_area: 12800 },
      ]);

      await sqlConnection("addresses").insert({
        id: uuid(),
        ban_id: "123456",
        city: "City name",
        post_code: "1234",
        value: "1 rue de la paix",
        site_id: siteId,
        city_code: "01234",
      });

      const result = await siteQuery.getById(siteId);

      assert.deepStrictEqual(result, {
        id: siteId,
        name: "Site 123",
        nature: "AGRICULTURAL_OPERATION",
        description: "Description of site",
        fricheActivity: undefined,
        naturalAreaType: undefined,
        address: {
          cityCode: "01234",
          value: "1 rue de la paix",
          banId: "123456",
          city: "City name",
          postCode: "1234",
          long: 0,
          lat: 0,
        },
        isExpressSite: false,
        surfaceArea: 14000,
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        contaminatedSoilSurface: undefined,
        accidentsDeaths: undefined,
        accidentsSevereInjuries: undefined,
        accidentsMinorInjuries: undefined,
        ownerName: "Owner name",
        ownerStructureType: "company",
        tenantStructureType: undefined,
        tenantName: undefined,
        yearlyExpenses: [],
        yearlyIncomes: [],
        agriculturalOperationActivity: "CATTLE_FARMING",
        isSiteOperated: true,
      } satisfies SiteImpactsDataView);
    });

    it("gets urban zone site soils distribution aggregated from its land parcels", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Zone d'activités",
        surface_area: 10000,
        owner_name: "Owner name",
        owner_structure_type: "municipality",
        created_at: new Date(),
        nature: "URBAN_ZONE",
      });

      await sqlConnection("site_urban_zone_features").insert({
        id: uuid(),
        site_id: siteId,
        urban_zone_type: "ECONOMIC_ACTIVITY_ZONE",
        land_parcels: JSON.stringify([
          {
            type: "COMMERCIAL_ACTIVITY_AREA",
            surfaceArea: 7000,
            soilsDistribution: { BUILDINGS: 3000, IMPERMEABLE_SOILS: 2600, MINERAL_SOIL: 1400 },
          },
          {
            type: "PUBLIC_SPACES",
            surfaceArea: 3000,
            soilsDistribution: { IMPERMEABLE_SOILS: 600, ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2400 },
          },
        ]),
        has_contaminated_soils: false,
        contaminated_soil_surface: null,
        manager_structure_type: "municipality",
        manager_name: "Mairie",
        vacant_commercial_premises_footprint: 0,
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        ban_id: "123456",
        city: "City name",
        post_code: "1234",
        value: "1 rue de la paix",
        site_id: siteId,
        city_code: "01234",
      });

      const result = await siteQuery.getById(siteId);

      assert.deepStrictEqual(result, {
        id: siteId,
        name: "Zone d'activités",
        nature: "URBAN_ZONE",
        description: undefined,
        fricheActivity: undefined,
        naturalAreaType: undefined,
        address: {
          cityCode: "01234",
          value: "1 rue de la paix",
          banId: "123456",
          city: "City name",
          postCode: "1234",
          long: 0,
          lat: 0,
        },
        isExpressSite: false,
        surfaceArea: 10000,
        soilsDistribution: {
          BUILDINGS: 3000,
          IMPERMEABLE_SOILS: 3200,
          MINERAL_SOIL: 1400,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 2400,
        },
        contaminatedSoilSurface: undefined,
        accidentsDeaths: undefined,
        accidentsSevereInjuries: undefined,
        accidentsMinorInjuries: undefined,
        ownerName: "Owner name",
        ownerStructureType: "municipality",
        tenantStructureType: undefined,
        tenantName: undefined,
        yearlyExpenses: [],
        yearlyIncomes: [],
        agriculturalOperationActivity: undefined,
        isSiteOperated: undefined,
      } satisfies SiteImpactsDataView);
    });
  });
});
