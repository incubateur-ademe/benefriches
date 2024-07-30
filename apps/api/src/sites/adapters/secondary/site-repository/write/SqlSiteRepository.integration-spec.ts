import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { FricheSite, NonFricheSite } from "src/sites/core/models/site";
import { buildExpressSite, buildMinimalSite } from "src/sites/core/models/site.mock";
import { SqlSiteWriteRepository } from "./SqlSiteWriteRepository";

describe("SqlSiteWriteRepository integration", () => {
  let sqlConnection: Knex;
  let siteRepository: SqlSiteWriteRepository;
  const now = new Date();

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    siteRepository = new SqlSiteWriteRepository(sqlConnection);
  });

  describe("existsWithId", () => {
    it("Tells when site exists with id", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        name: "Site name",
        surface_area: 140000.2,
        is_friche: false,
        owner_structure_type: "company",
        created_at: now,
      });
      const result = await siteRepository.existsWithId(siteId);
      expect(result).toEqual(true);
    });

    it("Tells when site does not exist with id", async () => {
      const siteId = uuid();
      const result = await siteRepository.existsWithId(siteId);
      expect(result).toEqual(false);
    });
  });

  describe("save", () => {
    it("Saves given site with minimal data and express mode in sites", async () => {
      const site: NonFricheSite = buildExpressSite({ createdAt: now, creationMode: "express" });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          created_by: site.createdBy,
          creation_mode: "express",
          description: null,
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          full_time_jobs_involved: null,
          is_friche: false,
          name: "My site",
          owner_name: "Le département Paris",
          owner_structure_type: "department",
          surface_area: 15000.0,
          tenant_name: null,
          tenant_structure_type: null,
          created_at: now,
        },
      ]);
    });

    it("Saves given site with minimal data in sites", async () => {
      const site: NonFricheSite = buildMinimalSite({ createdAt: now });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          created_by: site.createdBy,
          creation_mode: "custom",
          description: null,
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          full_time_jobs_involved: null,
          is_friche: false,
          name: "My site",
          owner_name: "Le département Paris",
          owner_structure_type: "department",
          surface_area: 15000.0,
          tenant_name: null,
          tenant_structure_type: null,
          created_at: now,
        },
      ]);
    });

    it("Saves given site with complete data in sites table", async () => {
      const site: NonFricheSite = buildMinimalSite({
        description: "Description of site",
        fullTimeJobsInvolved: 1.3,
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
        createdAt: now,
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          created_by: site.createdBy,
          creation_mode: "custom",
          description: "Description of site",
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          full_time_jobs_involved: 1.3,
          is_friche: false,
          name: "My site",
          owner_name: "Le département Paris",
          owner_structure_type: "department",
          surface_area: 15000.0,
          tenant_name: "Tenant SARL",
          tenant_structure_type: "company",
          created_at: now,
        },
      ]);
    });

    it("Saves given site with friche data in sites table", async () => {
      const site: FricheSite = {
        ...buildMinimalSite(),
        createdAt: now,
        description: "Description of site",
        isFriche: true,
        fricheActivity: "HOUSING",
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 1400,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        accidentsDeaths: 0,
      };

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          created_by: site.createdBy,
          description: "Description of site",
          friche_accidents_minor_injuries: 2,
          friche_accidents_severe_injuries: 1,
          friche_accidents_deaths: 0,
          friche_activity: "HOUSING",
          friche_contaminated_soil_surface_area: 1400.0,
          friche_has_contaminated_soils: true,
          is_friche: true,
          name: "My site",
          owner_name: "Le département Paris",
          owner_structure_type: "department",
          surface_area: 15000.0,
          tenant_name: null,
          tenant_structure_type: null,
          full_time_jobs_involved: null,
          created_at: now,
          creation_mode: "custom",
        },
      ]);
    });

    it("Saves given site with minimal data in sites, soils distribution, address tables", async () => {
      const site: NonFricheSite = buildMinimalSite();

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("id");
      expect(sitesResult).toEqual([{ id: site.id }]);

      const addressResult = await sqlConnection("addresses").select("value", "site_id");
      expect(addressResult).toEqual([{ value: site.address.value, site_id: site.id }]);

      const soilsDistributionResult = await sqlConnection("site_soils_distributions").select(
        "surface_area",
        "soil_type",
        "site_id",
      );

      expect(soilsDistributionResult).toEqual([
        { soil_type: "BUILDINGS", surface_area: 3000.0, site_id: site.id },
        { soil_type: "ARTIFICIAL_TREE_FILLED", surface_area: 5000.0, site_id: site.id },
        { soil_type: "FOREST_MIXED", surface_area: 60000.0, site_id: site.id },
        { soil_type: "MINERAL_SOIL", surface_area: 5000.0, site_id: site.id },
        { soil_type: "IMPERMEABLE_SOILS", surface_area: 1300.0, site_id: site.id },
      ]);
    });

    it("Saves given site with expenses and incomes in sites, expenses and incomes", async () => {
      const site: NonFricheSite = buildMinimalSite({
        yearlyExpenses: [
          { amount: 45000, bearer: "owner", purposeCategory: "other", purpose: "other" },
        ],
        yearlyIncomes: [
          { amount: 20000, source: "operations" },
          { amount: 32740.3, source: "other" },
        ],
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("id");
      expect(sitesResult).toEqual([{ id: site.id }]);

      const expensesResult = await sqlConnection("site_expenses").select("amount", "purpose");
      expect(expensesResult).toEqual([{ amount: 45000.0, purpose: "other" }]);

      const incomesResult = await sqlConnection("site_incomes").select("amount", "source");
      expect(incomesResult).toEqual([
        { amount: 20000.0, source: "operations" },
        { amount: 32740.3, source: "other" },
      ]);
    });

    it("Doesn't save given site and address if something goes wrong with insertion of soils distributions", async () => {
      const site: NonFricheSite = buildMinimalSite({
        soilsDistribution: {
          // @ts-expect-error string is passed instead of number
          MINERAL_SOIL: "wrong-value",
        },
      });

      await expect(siteRepository.save(site)).rejects.toThrow();

      const sitesResult = await sqlConnection("sites").select("id");
      expect(sitesResult).toEqual([]);

      const addressResult = await sqlConnection("addresses").select("value");
      expect(addressResult).toEqual([]);

      const soilsDistributionResult = await sqlConnection("site_soils_distributions").select("id");
      expect(soilsDistributionResult).toEqual([]);
    });
  });
});
