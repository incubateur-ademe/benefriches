import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlSite } from "src/shared-kernel/adapters/sql-knex/tableTypes";
import {
  CreateAgriculturalOrNaturalSiteProps,
  CreateFricheProps,
  CreateUrbanZoneSiteProps,
} from "src/sites/core/models/site";
import {
  buildAgriculturalOrNaturalSite,
  buildFriche,
  buildUrbanZoneSite,
} from "src/sites/core/models/site.mock";
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
      status: "active",
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
      status: "active",
    };
  }

  function buildUrbanZoneSiteEntity(props?: Partial<CreateUrbanZoneSiteProps>): SiteEntity {
    return {
      ...buildUrbanZoneSite(props),
      createdAt: now,
      createdBy: uuid(),
      creationMode: "custom",
      status: "active",
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
        nature: "AGRICULTURAL_OPERATION",
        surface_area: 140000.2,
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
          soilsDistribution: {
            PRAIRIE_GRASS: 1000,
          },
          owner: {
            name: "Le département Doubs",
            structureType: "department",
          },
          isSiteOperated: true,
        }),
        creationMode: "express",
      };

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual([
        {
          id: site.id,
          nature: "AGRICULTURAL_OPERATION",
          created_by: site.createdBy,
          creation_mode: "express",
          name: "Integration test site",
          created_at: now,
          owner_name: "Le département Doubs",
          owner_structure_type: "department",
          surface_area: 1000.0,
          description: null,
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          tenant_name: null,
          tenant_structure_type: null,
          agricultural_operation_activity: "FLOWERS_AND_HORTICULTURE",
          is_operated: true,
          natural_area_type: null,
          status: "active",
          updated_at: null,
        },
      ]);
    });

    it("Saves given agricultural operation with complete data in sites table", async () => {
      const site: SiteEntity = buildAgriculturalOrNaturalSiteEntity({
        name: "Integration test site",
        description: "Description of site",
        soilsDistribution: {
          PRAIRIE_GRASS: 1000,
        },
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
          nature: "AGRICULTURAL_OPERATION",
          name: "Integration test site",
          created_at: now,
          owner_name: "Le département Doubs",
          owner_structure_type: "department",
          surface_area: 1000.0,
          description: "Description of site",
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          tenant_name: "Tenant SARL",
          tenant_structure_type: "company",
          agricultural_operation_activity: "FLOWERS_AND_HORTICULTURE",
          is_operated: false,
          natural_area_type: null,
          status: "active",
          updated_at: null,
        },
      ]);
    });

    it("Saves given friche in sites table", async () => {
      const site: SiteEntity = buildFricheEntity({
        name: "Integration test friche",
        description: "Description of friche",
        soilsDistribution: {
          BUILDINGS: 1000,
          MINERAL_SOIL: 500,
          ARTIFICIAL_TREE_FILLED: 1500,
        },
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
          owner_name: "Le département Nord",
          owner_structure_type: "department",
          surface_area: 3000.0,
          tenant_name: null,
          tenant_structure_type: null,
          created_at: now,
          creation_mode: "custom",
          agricultural_operation_activity: null,
          natural_area_type: null,
          is_operated: null,
          status: "active",
          updated_at: null,
        },
      ]);
    });

    it("Saves given agricultural operation with minimal data in sites, soils distribution, address tables", async () => {
      const site: SiteEntity = buildAgriculturalOrNaturalSiteEntity({
        soilsDistribution: {
          BUILDINGS: 3000,
          ARTIFICIAL_TREE_FILLED: 5000,
          FOREST_MIXED: 60000,
          MINERAL_SOIL: 5000,
          IMPERMEABLE_SOILS: 1300,
        },
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

    it("Saves given urban zone in sites, urban zone features and address tables without site soils distributions", async () => {
      const site: SiteEntity = buildUrbanZoneSiteEntity({
        description: "Zone d'activites avec plusieurs ilots",
        vacantCommercialPremisesFootprint: 900,
        vacantCommercialPremisesFloorArea: 1200,
        fullTimeJobsEquivalent: 42,
        yearlyExpenses: [{ amount: 45000, bearer: "owner", purpose: "maintenance" }],
        yearlyIncomes: [{ amount: 12000, source: "other" }],
        hasContaminatedSoils: true,
        contaminatedSoilSurface: 150,
        landParcels: [
          {
            type: "COMMERCIAL_ACTIVITY_AREA",
            surfaceArea: 5000,
            buildingsFloorSurfaceArea: 3200,
            soilsDistribution: {
              BUILDINGS: 2500,
              IMPERMEABLE_SOILS: 1500,
              MINERAL_SOIL: 1000,
            },
          },
          {
            type: "PUBLIC_SPACES",
            surfaceArea: 2000,
            soilsDistribution: {
              MINERAL_SOIL: 1200,
              ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 800,
            },
          },
        ],
      });

      await siteRepository.save(site);

      const sitesResult = await sqlConnection("sites").select("*");
      expect(sitesResult).toEqual<SqlSite[]>([
        {
          id: site.id,
          created_by: site.createdBy,
          creation_mode: "custom",
          nature: "URBAN_ZONE",
          name: site.name,
          created_at: now,
          owner_name: "Mairie de Lyon",
          owner_structure_type: "municipality",
          surface_area: 7000.0,
          description: "Zone d'activites avec plusieurs ilots",
          friche_accidents_deaths: null,
          friche_accidents_severe_injuries: null,
          friche_accidents_minor_injuries: null,
          friche_activity: null,
          friche_contaminated_soil_surface_area: null,
          friche_has_contaminated_soils: null,
          tenant_name: null,
          tenant_structure_type: null,
          agricultural_operation_activity: null,
          is_operated: null,
          natural_area_type: null,
          status: "active",
          updated_at: null,
        },
      ]);

      const addressResult = await sqlConnection("addresses").select("value", "site_id");
      expect(addressResult).toEqual([{ value: site.address.value, site_id: site.id }]);

      const urbanZoneResult = await sqlConnection("site_urban_zone_features")
        .select(
          "site_id",
          "urban_zone_type",
          "land_parcels",
          "has_contaminated_soils",
          "contaminated_soil_surface",
          "manager_structure_type",
          "manager_name",
          "vacant_commercial_premises_footprint",
          "vacant_commercial_premises_floor_area",
          "full_time_jobs_equivalent",
        )
        .where({ site_id: site.id });

      expect(urbanZoneResult).toEqual([
        {
          site_id: site.id,
          urban_zone_type: "ECONOMIC_ACTIVITY_ZONE",
          land_parcels: [
            {
              type: "COMMERCIAL_ACTIVITY_AREA",
              surfaceArea: 5000,
              buildingsFloorSurfaceArea: 3200,
              soilsDistribution: {
                BUILDINGS: 2500,
                IMPERMEABLE_SOILS: 1500,
                MINERAL_SOIL: 1000,
              },
            },
            {
              type: "PUBLIC_SPACES",
              surfaceArea: 2000,
              soilsDistribution: {
                MINERAL_SOIL: 1200,
                ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 800,
              },
            },
          ],
          has_contaminated_soils: true,
          contaminated_soil_surface: 150.0,
          manager_structure_type: "activity_park_manager",
          manager_name: "Gestionnaire ZAE",
          vacant_commercial_premises_footprint: 900.0,
          vacant_commercial_premises_floor_area: 1200.0,
          full_time_jobs_equivalent: 42.0,
        },
      ]);

      const soilsDistributionResult = await sqlConnection("site_soils_distributions")
        .select("site_id")
        .where({ site_id: site.id });
      expect(soilsDistributionResult).toEqual([]);

      const expensesResult = await sqlConnection("site_expenses").select(
        "amount",
        "purpose",
        "bearer",
        "site_id",
      );
      expect(expensesResult).toEqual([
        {
          amount: 45000.0,
          purpose: "maintenance",
          bearer: "owner",
          site_id: site.id,
        },
      ]);

      const incomesResult = await sqlConnection("site_incomes").select(
        "amount",
        "source",
        "site_id",
      );
      expect(incomesResult).toEqual([
        {
          amount: 12000.0,
          source: "other",
          site_id: site.id,
        },
      ]);
    });
  });

  describe("patch", () => {
    it("Updates site status", async () => {
      const site: SiteEntity = buildAgriculturalOrNaturalSiteEntity({
        yearlyExpenses: [{ amount: 45000, bearer: "owner", purpose: "security" }],
        yearlyIncomes: [
          { amount: 20000, source: "operations" },
          { amount: 32740.3, source: "other" },
        ],
      });

      await siteRepository.save(site);

      const updatedAt = new Date();

      await siteRepository.patch(site.id, {
        status: "archived",
        updatedAt,
      });

      const result = await sqlConnection("sites").select("*").where({ id: site.id }).first();

      expect(result).toMatchObject({
        id: site.id,
        status: "archived",
        updated_at: updatedAt,
      });
    });
  });
});
