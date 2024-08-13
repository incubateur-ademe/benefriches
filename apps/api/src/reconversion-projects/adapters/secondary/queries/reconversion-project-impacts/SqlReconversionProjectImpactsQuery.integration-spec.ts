import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { ReconversionProjectImpactsDataView } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlReconversionProjectImpactsQuery } from "./SqlReconversionProjectImpactsQuery";

describe("SqlReconversionProjectImpactsQuery integration", () => {
  let sqlConnection: Knex;
  let repository: SqlReconversionProjectImpactsQuery;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlReconversionProjectImpactsQuery(sqlConnection);
  });

  describe("getById", () => {
    it("gets reconversion project with ALL data needed for impact computation", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "9b3a4906-1db2-441d-97d5-7be287add907",
        name: "Site name",
        surface_area: 14000,
        is_friche: false,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Big project",
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        creation_mode: "express",
        related_site_id: siteId,
        created_at: new Date(),
        conversion_full_time_jobs_involved: 20,
        reinstatement_full_time_jobs_involved: 5,
        future_operations_full_time_jobs: 0.2,
        reinstatement_schedule_start_date: new Date("2024-07-01"),
        reinstatement_schedule_end_date: new Date("2024-12-31"),
        future_operator_name: "Mairie de Blajan",
        future_site_owner_name: "Mairie de Blajan",
        reinstatement_contract_owner_name: "Mairie de Blajan",
        site_purchase_selling_price: 100000,
        site_purchase_property_transfer_duties: 8000,
        site_resale_expected_selling_price: 150000,
        site_resale_expected_property_transfer_duties: 8715,
        operations_first_year: 2025,
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "BUILDINGS",
          surface_area: 1200,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 30000,
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
          developer_name: "Terre cuite d’occitanie",
          developer_structure_type: "company",
          features: {
            expectedAnnualProduction: 10,
            surfaceArea: 2000,
            electricalPowerKWc: 300,
            contractDuration: 30,
          },
        },
      ]);
      await sqlConnection("reconversion_project_development_plan_costs").insert([
        {
          id: uuid(),
          development_plan_id: developmentPlanId,
          amount: 35000,
          purpose: "technical_studies",
        },
        {
          id: uuid(),
          development_plan_id: developmentPlanId,
          amount: 125000,
          purpose: "installation_works",
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
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          amount: 5000,
          source: "other",
        },
      ]);

      const result = await repository.getById(reconversionProjectId);

      expect(result).toEqual<Required<ReconversionProjectImpactsDataView>>({
        id: reconversionProjectId,
        name: "Big project",
        isExpressProject: true,
        relatedSiteId: siteId,
        soilsDistribution: {
          BUILDINGS: 1200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 30000,
        },
        operationsFullTimeJobs: 0.2,
        conversionFullTimeJobs: 20,
        conversionSchedule: {
          startDate: new Date("2025-01-01"),
          endDate: new Date("2025-05-15"),
        },
        reinstatementFullTimeJobs: 5,
        reinstatementSchedule: {
          startDate: new Date("2024-07-01"),
          endDate: new Date("2024-12-31"),
        },
        reinstatementCosts: [
          { purpose: "waste_collection", amount: 1000 },
          { purpose: "deimpermeabilization", amount: 500 },
        ],
        futureOperatorName: "Mairie de Blajan",
        futureSiteOwnerName: "Mairie de Blajan",
        reinstatementContractOwnerName: "Mairie de Blajan",
        sitePurchaseTotalAmount: 108000,
        sitePurchasePropertyTransferDutiesAmount: 8000,
        developmentPlanInstallationCosts: [
          {
            amount: 35000,
            purpose: "technical_studies",
          },
          {
            amount: 125000,
            purpose: "installation_works",
          },
        ],
        financialAssistanceRevenues: [
          { amount: 45000, source: "public_subsidies" },
          { amount: 5000, source: "other" },
        ],
        yearlyProjectedCosts: [],
        yearlyProjectedRevenues: [],
        developmentPlanFeatures: {
          expectedAnnualProduction: 10,
          surfaceArea: 2000,
          electricalPowerKWc: 300,
          contractDuration: 30,
        },
        operationsFirstYear: 2025,
        developmentPlanDeveloperName: "Terre cuite d’occitanie",
        developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
        siteResaleTotalAmount: 158715,
      });
    });
    it("gets reconversion project when optional data does not exist", async () => {
      const reconversionProjectId = uuid();
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: "9b3a4906-1db2-441d-97d5-7be287add907",
        name: "Site name",
        surface_area: 14000,
        is_friche: false,
        owner_structure_type: "company",
        created_at: new Date(),
      });
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Big project",
        created_by: "d185b43f-e54a-4dd4-9c60-ba85775a01e7",
        related_site_id: siteId,
        created_at: new Date(),
      });

      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "BUILDINGS",
          surface_area: 1200,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 30000,
        },
      ]);
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          type: "PHOTOVOLTAIC_POWER_PLANT",
          features: {},
        },
      ]);

      const result = await repository.getById(reconversionProjectId);

      expect(result).toEqual<ReconversionProjectImpactsDataView>({
        id: reconversionProjectId,
        name: "Big project",
        isExpressProject: false,
        relatedSiteId: siteId,
        soilsDistribution: {
          BUILDINGS: 1200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 30000,
        },
        yearlyProjectedCosts: [],
        yearlyProjectedRevenues: [],
        conversionFullTimeJobs: undefined,
        conversionSchedule: undefined,
        developmentPlanInstallationCosts: [],
        developmentPlanDeveloperName: undefined,
        developmentPlanFeatures: undefined,
        developmentPlanType: "PHOTOVOLTAIC_POWER_PLANT",
        futureOperatorName: undefined,
        futureSiteOwnerName: undefined,
        operationsFullTimeJobs: undefined,
        sitePurchaseTotalAmount: undefined,
        reinstatementContractOwnerName: undefined,
        reinstatementCosts: [],
        financialAssistanceRevenues: [],
        reinstatementFullTimeJobs: undefined,
        reinstatementSchedule: undefined,
      });
    });
  });
});
