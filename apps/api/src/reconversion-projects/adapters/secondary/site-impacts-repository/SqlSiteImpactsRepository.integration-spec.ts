import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { SiteImpactsDataView } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlSiteImpactsRepository } from "./SqlSiteImpactsRepository";

describe("SqlSiteRepository integration", () => {
  let sqlConnection: Knex;
  let siteRepository: SqlSiteImpactsRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    siteRepository = new SqlSiteImpactsRepository(sqlConnection);
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
        is_friche: true,
        friche_activity: "HOUSING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
        full_time_jobs_involved: 2,
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
          purpose_category: "rent",
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

      const result = await siteRepository.getById(siteId);

      expect(result).toEqual<Required<SiteImpactsDataView>>({
        id: siteId,
        name: "Site 123",
        addressCityCode: "01234",
        addressLabel: "1 rue de la paix",
        contaminatedSoilSurface: 230,
        surfaceArea: 14000,
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        fullTimeJobs: 2,
        hasAccidents: true,
        accidentsDeaths: 1,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 0,
        ownerName: "Current site owner",
        tenantName: "Current tenant",
        yearlyCosts: [{ amount: 100, bearer: "tenant", purpose: "rent" }],
      });
    });
    it("gets site with data needed for impact computation when no full time jobs, no accidents and no contaminated surface", async () => {
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
        is_friche: true,
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

      const result = await siteRepository.getById(siteId);

      expect(result).toEqual<SiteImpactsDataView>({
        id: siteId,
        name: "Site 123",
        addressCityCode: "01234",
        addressLabel: "1 rue de la paix",
        surfaceArea: 14000,
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        ownerName: "Owner name",
        hasAccidents: false,
        yearlyCosts: [],
      });
    });
  });
});
