import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { SiteImpactsDataView } from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";
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
        owner_name: "Owner name",
        owner_structure_type: "company",
        tenant_name: "Tenant name",
        tenant_structure_type: "company",
        created_at: new Date(),
        is_friche: true,
        friche_activity: "HOUSING",
        friche_has_contaminated_soils: true,
        friche_contaminated_soil_surface_area: 230,
        full_time_jobs_involved: 2,
      });

      await sqlConnection("site_soils_distributions").insert([
        { id: uuid(), site_id: siteId, soil_type: "FOREST_MIXED", surface_area: 1200 },
        { id: uuid(), site_id: siteId, soil_type: "PRAIRIE_GRASS", surface_area: 12800 },
      ]);

      const result = await siteRepository.getById(siteId);

      expect(result).toEqual<Required<SiteImpactsDataView>>({
        id: siteId,
        name: "Site 123",
        contaminatedSoilSurface: 230,
        soilsDistribution: {
          FOREST_MIXED: 1200,
          PRAIRIE_GRASS: 12800,
        },
        fullTimeJobs: 2,
      });
    });
  });
});
