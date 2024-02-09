/* eslint-disable jest/no-conditional-expect */
import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { FricheSite, NonFricheSite } from "src/sites/domain/models/site";
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

  const buildSite = (propsOverride?: Partial<NonFricheSite>): NonFricheSite => {
    return {
      id: "28b53918-a6f6-43f2-9554-7b5434428f8b",
      name: "My site",
      surfaceArea: 21000,
      owner: {
        structureType: "department",
        name: "Le département Paris",
      },
      soilsDistribution: {
        BUILDINGS: 3000,
        MINERAL_SOIL: 5000,
        PRAIRIE_BUSHES: 13000,
      },
      yearlyExpenses: [],
      yearlyIncomes: [],
      isFriche: false,
      address: {
        banId: "123abc",
        city: "Paris",
        cityCode: "75109",
        postCode: "75009",
        lat: 48.876517,
        long: 2.330785,
        value: "1 rue de Londres, 75009 Paris",
        streetName: "rue de Londres",
      },
      createdAt: now,
      ...propsOverride,
    };
  };

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

  it("Saves given site with minimal data in sites", async () => {
    const site: NonFricheSite = buildSite();

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
        surface_area: "21000.00",
        tenant_name: null,
        tenant_structure_type: null,
        created_at: now,
      },
    ]);
  });

  it("Saves given site with complete data in sites table", async () => {
    const site: NonFricheSite = buildSite({
      description: "Description of site",
      fullTimeJobsInvolved: 1.3,
      tenant: {
        structureType: "company",
        name: "Tenant SARL",
      },
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
        surface_area: "21000.00",
        tenant_name: "Tenant SARL",
        tenant_structure_type: "company",
        created_at: now,
      },
    ]);
  });

  it("Saves given site with friche data in sites table", async () => {
    const site: FricheSite = {
      ...buildSite(),
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
        surface_area: "21000.00",
        tenant_name: null,
        tenant_structure_type: null,
        full_time_jobs_involved: null,
        created_at: now,
      },
    ]);
  });

  it("Saves given site with minimal data in sites, soils distribution, address tables", async () => {
    const site: NonFricheSite = buildSite();

    await siteRepository.save(site);

    const sitesResult = await sqlConnection<SqlSite[]>("sites").select("id");
    expect(sitesResult).toEqual([{ id: site.id }]);

    const addressResult = await sqlConnection<SqlAddress[]>("addresses").select("value", "site_id");
    expect(addressResult).toEqual([{ value: site.address.value, site_id: site.id }]);

    const soilsDistributionResult = await sqlConnection<SqlSoilsDistribution[]>(
      "site_soils_distributions",
    ).select("surface_area", "soil_type", "site_id");

    expect(soilsDistributionResult).toEqual([
      { soil_type: "BUILDINGS", surface_area: "3000.00", site_id: site.id },
      { soil_type: "MINERAL_SOIL", surface_area: "5000.00", site_id: site.id },
      { soil_type: "PRAIRIE_BUSHES", surface_area: "13000.00", site_id: site.id },
    ]);
  });

  it("Saves given site with expenses and incomes in sites, expenses and incomes", async () => {
    const site: NonFricheSite = buildSite({
      yearlyExpenses: [
        { amount: 45000, bearer: "owner", purposeCategory: "other", purpose: "other" },
      ],
      yearlyIncomes: [
        { amount: 20000, source: "operations" },
        { amount: 32740.3, source: "other" },
      ],
    });

    await siteRepository.save(site);

    const sitesResult = await sqlConnection<SqlSite[]>("sites").select("id");
    expect(sitesResult).toEqual([{ id: site.id }]);

    const expensesResult = await sqlConnection<SqlSiteExpense[]>("site_expenses").select(
      "amount",
      "purpose",
    );
    expect(expensesResult).toEqual([{ amount: "45000.00", purpose: "other" }]);

    const incomesResult = await sqlConnection<SqlSiteIncome[]>("site_incomes").select(
      "amount",
      "source",
    );
    expect(incomesResult).toEqual([
      { amount: "20000.00", source: "operations" },
      { amount: "32740.30", source: "other" },
    ]);
  });

  it("Doesn't save given site and address if something goes wrong with insertion of soils distributions", async () => {
    const site: NonFricheSite = buildSite({
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
