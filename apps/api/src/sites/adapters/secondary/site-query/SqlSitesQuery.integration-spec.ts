import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SiteFeaturesView, SiteView } from "src/sites/core/models/views";

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

      const result = await sitesQuery.getSiteFeaturesById(siteId);

      const expectedResult: Required<
        Omit<SiteFeaturesView, "agriculturalOperationActivity" | "naturalAreaType">
      > = {
        id: siteId,
        name: "Site 123",
        nature: "FRICHE",
        isExpressSite: false,
        description: "Description of site",
        surfaceArea: 14000,
        owner: { name: "Owner name", structureType: "company" },
        tenant: { name: "Tenant name", structureType: "company" },
        hasContaminatedSoils: true,
        yearlyExpenses: [
          { amount: 45000, purpose: "rent" },
          { amount: 55000, purpose: "maintenance" },
        ],
        yearlyIncomes: [],
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
        creation_mode: "express",
        agricultural_operation_activity: "CATTLE_FARMING",
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

      await sqlConnection("site_incomes").insert([
        {
          id: uuid(),
          site_id: siteId,
          amount: 5000,
          source: "product-sales",
        },
      ]);

      const result = await sitesQuery.getSiteFeaturesById(siteId);

      const expectedResult: SiteFeaturesView = {
        id: siteId,
        name: "Site 456",
        nature: "AGRICULTURAL_OPERATION",
        surfaceArea: 14000,
        isExpressSite: true,
        owner: { structureType: "company" },
        yearlyExpenses: [{ amount: 3300, purpose: "security" }],
        yearlyIncomes: [{ amount: 5000, source: "product-sales" }],
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
        agriculturalOperationActivity: "CATTLE_FARMING",
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
      });

      const result = await sitesQuery.getSiteFeaturesById(siteId);

      expect(result?.id).toEqual(siteId);
      expect(result?.yearlyExpenses).toEqual([]);
      expect(result?.soilsDistribution).toEqual({});
      expect(result?.address.banId).toBeUndefined();
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
        friche_activity: "BUILDING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
      });

      const result = await sitesQuery.getSiteFeaturesById(nonExistingSiteId);

      expect(result).toEqual(undefined);
    });
  });

  describe("getViewById", () => {
    it("should return site with empty projects array when no projects exist", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site without projects",
        nature: "FRICHE",
        surface_area: 14000,
        owner_name: "Owner name",
        owner_structure_type: "company",
        created_at: now,
        friche_activity: "INDUSTRY",
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
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "BUILDINGS", surface_area: 14000 },
      ]);

      const result = await sitesQuery.getViewById(siteId);

      const expectedFeatures: SiteFeaturesView = {
        id: siteId,
        name: "Site without projects",
        nature: "FRICHE",
        isExpressSite: false,
        surfaceArea: 14000,
        owner: { name: "Owner name", structureType: "company" },
        yearlyExpenses: [],
        yearlyIncomes: [],
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
          BUILDINGS: 14000,
        },
        fricheActivity: "INDUSTRY",
      };

      const expectedResult: SiteView = {
        id: siteId,
        features: expectedFeatures,
        actions: [],
        reconversionProjects: [],
        compatibilityEvaluation: null,
      };

      expect(result).toEqual(expectedResult);
    });

    it("should return site with projects array containing all related projects", async () => {
      const siteId = uuid();
      const project1Id = uuid();
      const project2Id = uuid();

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site with projects",
        nature: "FRICHE",
        surface_area: 20000,
        owner_structure_type: "company",
        created_at: now,
        friche_activity: "INDUSTRY",
      });

      await sqlConnection("addresses").insert({
        id: uuid(),
        site_id: siteId,
        city: "Lyon",
        city_code: "69001",
        post_code: "69001",
        ban_id: "69001_abc",
        lat: 45.764043,
        long: 4.835659,
        value: "Lyon Centre",
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "BUILDINGS", surface_area: 20000 },
      ]);

      // Insert reconversion projects
      await sqlConnection("reconversion_projects").insert([
        {
          id: project1Id,
          name: "Photovoltaic Plant",
          related_site_id: siteId,
          created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
          creation_mode: "custom",
          created_at: now,
        },
        {
          id: project2Id,
          name: "Urban Development",
          related_site_id: siteId,
          created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
          creation_mode: "express",
          created_at: now,
        },
      ]);

      // Insert development plans for projects
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

      const result = await sitesQuery.getViewById(siteId);

      const expectedFeatures: SiteFeaturesView = {
        id: siteId,
        name: "Site with projects",
        nature: "FRICHE",
        isExpressSite: false,
        surfaceArea: 20000,
        owner: { structureType: "company" },
        yearlyExpenses: [],
        yearlyIncomes: [],
        address: {
          city: "Lyon",
          cityCode: "69001",
          postCode: "69001",
          banId: "69001_abc",
          lat: 45.764043,
          long: 4.835659,
          value: "Lyon Centre",
        },
        soilsDistribution: {
          BUILDINGS: 20000,
        },
        fricheActivity: "INDUSTRY",
      };

      const expectedResult: SiteView = {
        id: siteId,
        features: expectedFeatures,
        actions: [],
        reconversionProjects: [
          {
            id: project1Id,
            name: "Photovoltaic Plant",
            type: "PHOTOVOLTAIC_POWER_PLANT",
            express: false,
          },
          {
            id: project2Id,
            name: "Urban Development",
            type: "URBAN_PROJECT",
            express: true,
          },
        ],
        compatibilityEvaluation: null,
      };

      expect(result).toEqual(expectedResult);
    });

    it("should return site with actions array when site has multiple actions", async () => {
      const siteId = uuid();

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site with actions",
        nature: "FRICHE",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: now,
        friche_activity: "INDUSTRY",
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
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "BUILDINGS", surface_area: 14000 },
      ]);

      // Insert site actions
      await sqlConnection("site_actions").insert([
        {
          id: uuid(),
          site_id: siteId,
          action_type: "EVALUATE_COMPATIBILITY",
          status: "todo",
          created_at: now,
        },
        {
          id: uuid(),
          site_id: siteId,
          action_type: "REQUEST_FUNDING_INFORMATION",
          status: "done",
          created_at: now,
        },
      ]);

      const result = await sitesQuery.getViewById(siteId);

      expect(result?.actions).toEqual([
        { action: "EVALUATE_COMPATIBILITY", status: "todo" },
        { action: "REQUEST_FUNDING_INFORMATION", status: "done" },
      ]);
    });

    it("should return site with empty actions array when site has no actions", async () => {
      const siteId = uuid();

      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        name: "Site without actions",
        nature: "FRICHE",
        surface_area: 14000,
        owner_structure_type: "company",
        created_at: now,
        friche_activity: "INDUSTRY",
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
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "BUILDINGS", surface_area: 14000 },
      ]);

      const result = await sitesQuery.getViewById(siteId);

      expect(result?.actions).toEqual([]);
    });

    it("should return undefined for non-existent siteId", async () => {
      const nonExistentSiteId = uuid();
      const result = await sitesQuery.getViewById(nonExistentSiteId);

      expect(result).toEqual(undefined);
    });

    describe("getMutafrichesIdBySiteId", () => {
      it("should return mutafrichesId when compatibility evaluation exists", async () => {
        const siteId = uuid();
        const evaluationId = uuid();

        await sqlConnection("sites").insert({
          id: siteId,
          created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
          name: "Site with evaluation",
          nature: "FRICHE",
          surface_area: 14000,
          owner_structure_type: "company",
          created_at: now,
          friche_activity: "INDUSTRY",
        });

        await sqlConnection("reconversion_compatibility_evaluations").insert({
          id: uuid(),
          created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
          related_site_id: siteId,
          mutafriches_evaluation_id: evaluationId,
          status: "completed",
          created_at: now,
          project_creations: [],
        });

        const result = await sitesQuery.getMutafrichesIdBySiteId(siteId);

        expect(result).toEqual(evaluationId);
      });

      it("should return null when no compatibility evaluation exists for site", async () => {
        const siteId = uuid();

        const result = await sitesQuery.getMutafrichesIdBySiteId(siteId);

        expect(result).toEqual(null);
      });
    });
  });
});
