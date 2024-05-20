import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { ReconversionProjectImpactsDataView } from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlReconversionProjectImpactsRepository } from "./SqlReconversionProjectImpactsRepository";

describe("SqlReconversionProjectImpactsRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlReconversionProjectImpactsRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlReconversionProjectImpactsRepository(sqlConnection);
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
        reinstatement_cost: 15000,
        real_estate_transaction_selling_price: 100000,
        real_estate_transaction_property_transfer_duties: 8000,
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
      await sqlConnection("reconversion_project_development_plans").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          schedule_start_date: new Date("2025-01-01"),
          schedule_end_date: new Date("2025-05-15"),
          type: "any",
          developer_name: "Terre cuite d’occitanie",
          developer_structure_type: "company",
          features: {
            expectedAnnualProduction: 10,
            surfaceArea: 2000,
            electricalPowerKWc: 300,
          },
        },
      ]);

      const result = await repository.getById(reconversionProjectId);

      expect(result).toEqual<Required<ReconversionProjectImpactsDataView>>({
        id: reconversionProjectId,
        name: "Big project",
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
        futureOperatorName: "Mairie de Blajan",
        futureSiteOwnerName: "Mairie de Blajan",
        reinstatementContractOwnerName: "Mairie de Blajan",
        realEstateTransactionTotalCost: 108000,
        reinstatementCost: 15000,
        developmentPlanInstallationCost: 0,
        reinstatementFinancialAssistanceAmount: 0,
        yearlyProjectedCosts: [],
        yearlyProjectedRevenues: [],
        developmentPlanExpectedAnnualEnergyProductionMWh: 10,
        realEstateTransactionPropertyTransferDutiesAmount: 8000,
        operationsFirstYear: 2025,
        developmentPlanElectricalPowerKWc: 300,
        developmentPlanSurfaceArea: 2000,
        developmentPlanDeveloperName: "Terre cuite d’occitanie",
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
          type: "any",
          features: {},
        },
      ]);

      const result = await repository.getById(reconversionProjectId);

      expect(result).toEqual<ReconversionProjectImpactsDataView>({
        id: reconversionProjectId,
        name: "Big project",
        relatedSiteId: siteId,
        soilsDistribution: {
          BUILDINGS: 1200,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 30000,
        },
        yearlyProjectedCosts: [],
        yearlyProjectedRevenues: [],
        conversionFullTimeJobs: undefined,
        conversionSchedule: undefined,
        developmentPlanInstallationCost: 0,
        developmentPlanDeveloperName: undefined,
        futureOperatorName: undefined,
        futureSiteOwnerName: undefined,
        operationsFullTimeJobs: undefined,
        realEstateTransactionTotalCost: undefined,
        reinstatementContractOwnerName: undefined,
        reinstatementCost: 0,
        reinstatementFinancialAssistanceAmount: 0,
        reinstatementFullTimeJobs: undefined,
        reinstatementSchedule: undefined,
      });
    });
  });
});
