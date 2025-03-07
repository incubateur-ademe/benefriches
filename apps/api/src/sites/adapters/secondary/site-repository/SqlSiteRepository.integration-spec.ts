import knex, { Knex } from "knex";
import {
  CreateAgriculturalOrNaturalSiteProps,
  CreateFricheProps,
  createSoilSurfaceAreaDistribution,
} from "shared";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlSite } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import { buildAgriculturalOrNaturalSite, buildFriche } from "src/sites/core/models/site.mock";
import { SiteEntity } from "src/sites/core/models/siteEntity";

import { SqlSiteRepository } from "./SqlSiteRepository";

describe("SqlSiteRepository integration", () => {
  let sqlConnection: Knex;
  let siteRepository: SqlSiteRepository;
  const now = new Date();

  function buildFricheEntity(fricheProps?: Partial<CreateFricheProps>): SiteEntity {
    return {
      ...buildFriche(fricheProps),
      createdAt: now,
      createdBy: uuid(),
      creationMode: "custom",
    };
  }

  function buildAgriculturalOrNaturalSiteEntity(
    props?: Partial<CreateAgriculturalOrNaturalSiteProps>,
  ): SiteEntity {
    return {
      ...buildAgriculturalOrNaturalSite(props),
      createdAt: now,
      createdBy: uuid(),
      creationMode: "custom",
    };
  }

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    siteRepository = new SqlSiteRepository(sqlConnection);
  });

  describe("existsWithId", () => {
    it("Tells when site exists with id", async () => {
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        name: "Site name",
        nature: "AGRICULTURAL",
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
    it("Saves given agricultural operation with minimal data and express mode in sites", async () => {
      const site: SiteEntity = {
        ...buildAgriculturalOrNaturalSiteEntity({
          name: "Integration test site",
          soilsDistribution: createSoilSurfaceAreaDistribution({
            PRAIRIE_GRASS: 1000,
          }),
          owner: {
            name: "Le département Doubs",
            structureType: "department",
          },
        }),
        creationMode: "express",
      };

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          nature: "AGRICULTURAL",
          created_by: site.createdBy,
          creation_mode: "express",
          name: "Integration test site",
          created_at: now,
          owner_name: "Le département Doubs",
          owner_structure_type: "department",
          surface_area: 1000.0,
          is_friche: false,
          description: null,
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          tenant_name: null,
          tenant_structure_type: null,
        },
      ]);
    });

    it("Saves given agricultural operation with complete data in sites table", async () => {
      const site: SiteEntity = buildAgriculturalOrNaturalSiteEntity({
        name: "Integration test site",
        description: "Description of site",
        soilsDistribution: createSoilSurfaceAreaDistribution({
          PRAIRIE_GRASS: 1000,
        }),
        owner: {
          name: "Le département Doubs",
          structureType: "department",
        },
        tenant: {
          structureType: "company",
          name: "Tenant SARL",
        },
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual<SqlSite[]>([
        {
          id: site.id,
          created_by: site.createdBy,
          creation_mode: "custom",
          nature: "AGRICULTURAL",
          name: "Integration test site",
          created_at: now,
          owner_name: "Le département Doubs",
          owner_structure_type: "department",
          surface_area: 1000.0,
          is_friche: false,
          description: "Description of site",
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          tenant_name: "Tenant SARL",
          tenant_structure_type: "company",
        },
      ]);
    });

    it("Saves given friche in sites table", async () => {
      const site: SiteEntity = buildFricheEntity({
        name: "Integration test friche",
        description: "Description of friche",
        soilsDistribution: createSoilSurfaceAreaDistribution({
          BUILDINGS: 1000,
          MINERAL_SOIL: 500,
          ARTIFICIAL_TREE_FILLED: 1500,
        }),
        owner: {
          name: "Le département Nord",
          structureType: "department",
        },
        fricheActivity: "BUILDING",
        contaminatedSoilSurface: 1400,
        accidentsMinorInjuries: 2,
        accidentsSevereInjuries: 1,
        accidentsDeaths: 0,
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual<SqlSite[]>([
        {
          id: site.id,
          created_by: site.createdBy,
          name: "Integration test friche",
          nature: "FRICHE",
          description: "Description of friche",
          friche_accidents_minor_injuries: 2,
          friche_accidents_severe_injuries: 1,
          friche_accidents_deaths: 0,
          friche_activity: "BUILDING",
          friche_contaminated_soil_surface_area: 1400.0,
          friche_has_contaminated_soils: true,
          is_friche: true,
          owner_name: "Le département Nord",
          owner_structure_type: "department",
          surface_area: 3000.0,
          tenant_name: null,
          tenant_structure_type: null,
          created_at: now,
          creation_mode: "custom",
        },
      ]);
    });

    it("Saves given agricultural operation with minimal data in sites, soils distribution, address tables", async () => {
      const site: SiteEntity = buildAgriculturalOrNaturalSiteEntity({
        soilsDistribution: createSoilSurfaceAreaDistribution({
          BUILDINGS: 3000,
          ARTIFICIAL_TREE_FILLED: 5000,
          FOREST_MIXED: 60000,
          MINERAL_SOIL: 5000,
          IMPERMEABLE_SOILS: 1300,
        }),
      });

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

    it("Saves given agricultural operation with expenses and incomes in sites, expenses and incomes", async () => {
      const site: SiteEntity = buildAgriculturalOrNaturalSiteEntity({
        yearlyExpenses: [{ amount: 45000, bearer: "owner", purpose: "security" }],
        yearlyIncomes: [
          { amount: 20000, source: "operations" },
          { amount: 32740.3, source: "other" },
        ],
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("id");
      expect(sitesResult).toEqual([{ id: site.id }]);

      const expensesResult = await sqlConnection("site_expenses").select("amount", "purpose");
      expect(expensesResult).toEqual([{ amount: 45000.0, purpose: "security" }]);

      const incomesResult = await sqlConnection("site_incomes").select("amount", "source");
      expect(incomesResult).toEqual([
        { amount: 20000.0, source: "operations" },
        { amount: 32740.3, source: "other" },
      ]);
    });
  });
});
