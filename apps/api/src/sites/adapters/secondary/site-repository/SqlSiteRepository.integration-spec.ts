/* eslint-disable jest/no-conditional-expect */
import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { FricheSite, NonFricheSite } from "src/sites/domain/models/site";
import { buildMinimalSite } from "src/sites/domain/models/site.mock";
import {
  SqlAddress,
  SqlSite,
  SqlSiteExpense,
  SqlSiteIncome,
  SqlSiteRepository,
  SqlSoilsDistribution,
} from "./SqlSiteRepository";

describe("SqlSiteRepository integration", () => {
  let sqlConnection: Knex;
  let siteRepository: SqlSiteRepository;
  const now = new Date();

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(async () => {
    siteRepository = new SqlSiteRepository(sqlConnection);
    await sqlConnection("addresses").delete();
    await sqlConnection("site_expenses").delete();
    await sqlConnection("site_incomes").delete();
    await sqlConnection("site_soils_distributions").delete();
    await sqlConnection("sites").delete();
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
    it("Saves given site with minimal data in sites", async () => {
      const site: NonFricheSite = buildMinimalSite({ createdAt: now });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection<SqlSite[]>("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
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
          surface_area: "15000.00",
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

      const sitesResult = await sqlConnection<SqlSite[]>("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          description: "Description of site",
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          full_time_jobs_involved: "1.30",
          is_friche: false,
          name: "My site",
          owner_name: "Le département Paris",
          owner_structure_type: "department",
          surface_area: "15000.00",
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

      const sitesResult = await sqlConnection<SqlSite[]>("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          description: "Description of site",
          friche_accidents_minor_injuries: 2,
          friche_accidents_severe_injuries: 1,
          friche_accidents_deaths: 0,
          friche_activity: "HOUSING",
          friche_contaminated_soil_surface_area: "1400.00",
          friche_has_contaminated_soils: true,
          is_friche: true,
          name: "My site",
          owner_name: "Le département Paris",
          owner_structure_type: "department",
          surface_area: "15000.00",
          tenant_name: null,
          tenant_structure_type: null,
          full_time_jobs_involved: null,
          created_at: now,
        },
      ]);
    });

    it("Saves given site with minimal data in sites, soils distribution, address tables", async () => {
      const site: NonFricheSite = buildMinimalSite();

      await siteRepository.save(site);

      const sitesResult = await sqlConnection<SqlSite[]>("sites").select("id");
      expect(sitesResult).toEqual([{ id: site.id }]);

      const addressResult = await sqlConnection<SqlAddress[]>("addresses").select(
        "value",
        "site_id",
      );
      expect(addressResult).toEqual([{ value: site.address.value, site_id: site.id }]);

      const soilsDistributionResult = await sqlConnection<SqlSoilsDistribution[]>(
        "site_soils_distributions",
      ).select("surface_area", "soil_type", "site_id");

      expect(soilsDistributionResult).toEqual([
        { soil_type: "BUILDINGS", surface_area: "3000.00", site_id: site.id },
        { soil_type: "ARTIFICIAL_TREE_FILLED", surface_area: "5000.00", site_id: site.id },
        { soil_type: "FOREST_MIXED", surface_area: "60000.00", site_id: site.id },
        { soil_type: "MINERAL_SOIL", surface_area: "5000.00", site_id: site.id },
        { soil_type: "IMPERMEABLE_SOILS", surface_area: "1300.00", site_id: site.id },
      ]);
    });

    it("Saves given site with expenses and incomes in sites, expenses and incomes", async () => {
      const site: NonFricheSite = buildMinimalSite({
        yearlyExpenses: [{ amount: 45000, bearer: "owner", category: "other", type: "other" }],
        yearlyIncomes: [
          { amount: 20000, type: "operations" },
          { amount: 32740.3, type: "other" },
        ],
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection<SqlSite[]>("sites").select("id");
      expect(sitesResult).toEqual([{ id: site.id }]);

      const expensesResult = await sqlConnection<SqlSiteExpense[]>("site_expenses").select(
        "amount",
        "type",
      );
      expect(expensesResult).toEqual([{ amount: "45000.00", type: "other" }]);

      const incomesResult = await sqlConnection<SqlSiteIncome[]>("site_incomes").select(
        "amount",
        "type",
      );
      expect(incomesResult).toEqual([
        { amount: "20000.00", type: "operations" },
        { amount: "32740.30", type: "other" },
      ]);
    });

    it("Doesn't save given site and address if something goes wrong with insertion of soils distributions", async () => {
      const site: NonFricheSite = buildMinimalSite({
        soilsDistribution: {
          // @ts-expect-error string is passed instead of number
          MINERAL_SOIL: "wrong-value",
        },
      });

      expect.assertions(3);

      try {
        await siteRepository.save(site);
      } catch (err) {
        const sitesResult = await sqlConnection<SqlSite[]>("sites").select("id");
        expect(sitesResult).toEqual([]);

        const addressResult = await sqlConnection<SqlAddress[]>("addresses").select("value");
        expect(addressResult).toEqual([]);

        const soilsDistributionResult = await sqlConnection<SqlSoilsDistribution[]>(
          "site_soils_distributions",
        ).select("id");
        expect(soilsDistributionResult).toEqual([]);
      }
    });
  });
});
