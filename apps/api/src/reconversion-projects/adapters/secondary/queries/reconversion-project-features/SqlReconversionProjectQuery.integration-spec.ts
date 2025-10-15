import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";

import { ReconversionProjectFeaturesView } from "src/reconversion-projects/core/model/reconversionProject";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlReconversionProjectQuery } from "./SqlReconversionProjectQuery";

describe("SqlReconversionProjectQuery integration", () => {
  let sqlConnection: Knex;
  let repository: SqlReconversionProjectQuery;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlReconversionProjectQuery(sqlConnection);
  });

  describe("getFeaturesById", () => {
    it("gets features for urban project", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const userId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: userId,
        name: "Site name",
        surface_area: 20000,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Urban project",
        created_by: userId,
        creation_mode: "custom",
        related_site_id: siteId,
        description: "A urban project description",
        created_at: new Date(),
        reinstatement_schedule_start_date: new Date("2024-07-01"),
        reinstatement_schedule_end_date: new Date("2024-12-31"),
        future_operator_name: "Mairie de Blajan",
        future_site_owner_name: "Mairie de Blajan",
        reinstatement_contract_owner_name: "Mairie de Blajan",
        site_purchase_selling_price: 100000,
        site_purchase_property_transfer_duties: 8000,
        site_resale_expected_selling_price: 125000,
        site_resale_expected_property_transfer_duties: 8715,
        buildings_resale_expected_selling_price: 140000,
        buildings_resale_expected_property_transfer_duties: 5000,
        operations_first_year: 2025,
        friche_decontaminated_soil_surface_area: 1000,
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "BUILDINGS",
          surface_area: 7000,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 10000,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_TREE_FILLED",
          surface_area: 3000,
        },
      ]);

      await sqlConnection("reconversion_project_yearly_expenses").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 10000,
          purpose: "taxes",
        },
      ]);

      const developmentPlanId = uuid();
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: developmentPlanId,
          reconversion_project_id: reconversionProjectId,
          schedule_start_date: new Date("2025-01-01"),
          schedule_end_date: new Date("2025-05-15"),
          type: "URBAN_PROJECT",
          developer_name: "Promoteur immo",
          developer_structure_type: "company",
          features: {
            spacesDistribution: {
              BUILDINGS_FOOTPRINT: 7000,
              PUBLIC_GREEN_SPACES: 10000,
              PRIVATE_GARDEN_AND_GRASS_ALLEYS: 3000,
            },
            buildingsFloorAreaDistribution: {
              RESIDENTIAL: 5000,
              LOCAL_SERVICES: 2000,
            },
          },
        },
      ]);
      await sqlConnection("reconversion_project_development_plan_costs").insert([
        {
          id: uuid(),
          development_plan_id: developmentPlanId,
          amount: 35000,
          purpose: "other",
        },
        {
          id: uuid(),
          development_plan_id: developmentPlanId,
          amount: 125000,
          purpose: "development_works",
        },
      ]);

      await sqlConnection("reconversion_project_reinstatement_costs").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 1000,
          purpose: "waste_collection",
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 500,
          purpose: "deimpermeabilization",
        },
      ]);
      await sqlConnection("reconversion_project_financial_assistance_revenues").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 45000,
          source: "public_subsidies",
        },
      ]);

      const result = await repository.getFeaturesById(reconversionProjectId);

      expect(result).toEqual<Required<ReconversionProjectFeaturesView>>({
        id: reconversionProjectId,
        name: "Urban project",
        description: "A urban project description",
        isExpress: false,
        soilsDistribution: {
          BUILDINGS: 7000,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 10000,
          ARTIFICIAL_TREE_FILLED: 3000,
        },
        developmentPlan: {
          type: "URBAN_PROJECT",
          installationCosts: [
            { amount: 35000, purpose: "other" },
            { amount: 125000, purpose: "development_works" },
          ],
          spacesDistribution: {
            BUILDINGS_FOOTPRINT: 7000,
            PUBLIC_GREEN_SPACES: 10000,
            PRIVATE_GARDEN_AND_GRASS_ALLEYS: 3000,
          },
          buildingsFloorAreaDistribution: {
            RESIDENTIAL: 5000,
            LOCAL_SERVICES: 2000,
          },
          developerName: "Promoteur immo",
          installationSchedule: {
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-05-15"),
          },
        },
        reinstatementSchedule: {
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-12-31"),
        },
        reinstatementCosts: [
          { purpose: "waste_collection", amount: 1000 },
          { purpose: "deimpermeabilization", amount: 500 },
        ],
        futureOperator: "Mairie de Blajan",
        futureOwner: "Mairie de Blajan",
        reinstatementContractOwner: "Mairie de Blajan",
        sitePurchaseTotalAmount: 108000,
        financialAssistanceRevenues: [{ amount: 45000, source: "public_subsidies" }],
        yearlyProjectedExpenses: [{ amount: 10000, purpose: "taxes" }],
        yearlyProjectedRevenues: [],
        firstYearOfOperation: 2025,
        siteResaleSellingPrice: 125000,
        buildingsResaleSellingPrice: 140000,
        decontaminatedSoilSurface: 1000,
      });
    });

    it("gets features for photovoltaic power station", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const userId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: userId,
        name: "Site name",
        surface_area: 20000,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Photovoltaic power station",
        created_by: userId,
        creation_mode: "custom",
        related_site_id: siteId,
        description: "A description of a photovoltaic power station",
        created_at: new Date(),
        reinstatement_schedule_start_date: new Date("2024-07-01"),
        reinstatement_schedule_end_date: new Date("2024-12-31"),
        future_operator_name: "Solar Power Co.",
        future_site_owner_name: "Mairie de Blajan",
        reinstatement_contract_owner_name: "Solar Power Co.",
        operations_first_year: 2025,
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 18000,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "MINERAL_SOIL",
          surface_area: 2000,
        },
      ]);

      await sqlConnection("reconversion_project_yearly_expenses").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 10000,
          purpose: "maintenance",
        },
      ]);

      await sqlConnection("reconversion_project_yearly_revenues").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 12000,
          source: "operations",
        },
      ]);

      const developmentPlanId = uuid();
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: developmentPlanId,
          reconversion_project_id: reconversionProjectId,
          schedule_start_date: new Date("2025-01-01"),
          schedule_end_date: new Date("2025-05-15"),
          type: "PHOTOVOLTAIC_POWER_PLANT",
          developer_name: "Solar Power Co.",
          developer_structure_type: "company",
          features: {
            contractDuration: 20,
            electricalPowerKWc: 1000,
            surfaceArea: 20000,
            expectedAnnualProduction: 15000,
          },
        },
      ]);
      await sqlConnection("reconversion_project_development_plan_costs").insert([
        {
          id: uuid(),
          development_plan_id: developmentPlanId,
          amount: 100000,
          purpose: "installation_works",
        },
      ]);

      await sqlConnection("reconversion_project_reinstatement_costs").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 500,
          purpose: "deimpermeabilization",
        },
      ]);

      await sqlConnection("reconversion_project_financial_assistance_revenues").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 45000,
          source: "public_subsidies",
        },
      ]);

      const result = await repository.getFeaturesById(reconversionProjectId);

      expect(result).toEqual<ReconversionProjectFeaturesView>({
        id: reconversionProjectId,
        name: "Photovoltaic power station",
        description: "A description of a photovoltaic power station",
        isExpress: false,
        soilsDistribution: {
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
          MINERAL_SOIL: 2000,
        },
        developmentPlan: {
          type: "PHOTOVOLTAIC_POWER_PLANT",
          installationCosts: [{ amount: 100000, purpose: "installation_works" }],
          developerName: "Solar Power Co.",
          contractDuration: 20,
          electricalPowerKWc: 1000,
          surfaceArea: 20000,
          expectedAnnualProduction: 15000,
          installationSchedule: {
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-05-15"),
          },
        },
        reinstatementSchedule: {
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-12-31"),
        },
        reinstatementCosts: [{ purpose: "deimpermeabilization", amount: 500 }],
        futureOperator: "Solar Power Co.",
        futureOwner: "Mairie de Blajan",
        reinstatementContractOwner: "Solar Power Co.",
        financialAssistanceRevenues: [{ amount: 45000, source: "public_subsidies" }],
        yearlyProjectedExpenses: [{ amount: 10000, purpose: "maintenance" }],
        yearlyProjectedRevenues: [{ amount: 12000, source: "operations" }],
        firstYearOfOperation: 2025,
      });
    });

    it("gets features for photovoltaic power station with minimal values", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      const userId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: userId,
        name: "Site name",
        surface_area: 20000,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Photovoltaic power station",
        created_by: userId,
        creation_mode: "custom",
        related_site_id: siteId,
        created_at: new Date(),
        future_operator_name: "Solar Power Co.",
        future_site_owner_name: "Mairie de Blajan",
        operations_first_year: 2025,
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 18000,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "MINERAL_SOIL",
          surface_area: 2000,
        },
      ]);
      const developmentPlanId = uuid();
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: developmentPlanId,
          reconversion_project_id: reconversionProjectId,
          schedule_start_date: new Date("2025-01-01"),
          schedule_end_date: new Date("2025-05-15"),
          type: "PHOTOVOLTAIC_POWER_PLANT",
          developer_name: "Solar Power Co.",
          developer_structure_type: "company",
          features: {
            contractDuration: 20,
            electricalPowerKWc: 1000,
            surfaceArea: 20000,
            expectedAnnualProduction: 15000,
          },
        },
      ]);

      const result = await repository.getFeaturesById(reconversionProjectId);

      expect(result).toEqual<ReconversionProjectFeaturesView>({
        id: reconversionProjectId,
        name: "Photovoltaic power station",
        isExpress: false,
        soilsDistribution: {
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 18000,
          MINERAL_SOIL: 2000,
        },
        developmentPlan: {
          type: "PHOTOVOLTAIC_POWER_PLANT",
          installationCosts: [],
          developerName: "Solar Power Co.",
          contractDuration: 20,
          electricalPowerKWc: 1000,
          surfaceArea: 20000,
          expectedAnnualProduction: 15000,
          installationSchedule: {
            startDate: new Date("2025-01-01"),
            endDate: new Date("2025-05-15"),
          },
        },
        futureOperator: "Solar Power Co.",
        futureOwner: "Mairie de Blajan",
        yearlyProjectedExpenses: [],
        yearlyProjectedRevenues: [],
        firstYearOfOperation: 2025,
      });
    });
  });
});
