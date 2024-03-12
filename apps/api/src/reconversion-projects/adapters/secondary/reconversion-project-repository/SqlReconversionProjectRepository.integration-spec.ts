import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import {
  buildExhaustiveReconversionProjectProps,
  buildReconversionProject,
} from "src/reconversion-projects/domain/model/reconversionProject.mock";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { SqlReconversionProjectRepository } from "./SqlReconversionProjectRepository";

describe("SqlReconversionProjectRepository integration", () => {
  let sqlConnection: Knex;
  let reconversionProjectRepository: SqlReconversionProjectRepository;
  const now = new Date();

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    reconversionProjectRepository = new SqlReconversionProjectRepository(sqlConnection);
  });

  const insertSiteInDb = async (): Promise<string> => {
    const siteId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: "9b3a4906-1db2-441d-97d5-7be287add907",
      name: "Site name",
      surface_area: 14000,
      is_friche: false,
      owner_structure_type: "company",
      created_at: now,
    });
    return siteId;
  };

  describe("existsWithId", () => {
    it("Tells when reconversion project exists with id", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProjectId = uuid();
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Centrale pv",
        related_site_id: siteId,
        created_at: now,
      });
      const result = await reconversionProjectRepository.existsWithId(reconversionProjectId);
      expect(result).toEqual(true);
    });

    it("Tells when reconversion project does not exist with id", async () => {
      const reconversionProjectId = uuid();
      const result = await reconversionProjectRepository.existsWithId(reconversionProjectId);
      expect(result).toEqual(false);
    });
  });

  describe("getById", () => {
    it("gets reconversion project by id", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProjectId = uuid();
      await sqlConnection("reconversion_projects").insert({
        id: reconversionProjectId,
        name: "Centrale pv",
        related_site_id: siteId,
        created_at: now,
      });
      await sqlConnection("reconversion_project_soils_distributions").insert([
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "BUILDINGS",
          surface_area: 50,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 230,
        },
        {
          id: uuid(),
          reconversion_project_id: reconversionProjectId,
          soil_type: "IMPERMEABLE_SOILS",
          surface_area: 100,
        },
      ]);
      const result = await reconversionProjectRepository.getById(reconversionProjectId);
      expect(result).toEqual({
        id: reconversionProjectId,
        name: "Centrale pv",
        relatedSiteId: siteId,
        soilsDistribution: {
          BUILDINGS: 50,
          ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 230,
          IMPERMEABLE_SOILS: 100,
        },
      });
    });
  });

  describe("save", () => {
    it("Saves given reconversion project with minimal data in table reconversion_projects", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProject = buildReconversionProject({
        createdAt: now,
        relatedSiteId: siteId,
      });

      await reconversionProjectRepository.save(reconversionProject);

      const result = await sqlConnection("reconversion_projects").select("*");
      expect(result).toEqual([
        {
          id: reconversionProject.id,
          created_by: reconversionProject.createdBy,
          name: reconversionProject.name,
          related_site_id: siteId,
          created_at: now,
          description: null,
          future_operator_name: null,
          future_operator_structure_type: null,
          future_site_owner_name: null,
          future_site_owner_structure_type: null,
          future_operations_full_time_jobs: null,
          reinstatement_contract_owner_name: null,
          reinstatement_contract_owner_structure_type: null,
          reinstatement_cost: null,
          real_estate_transaction_cost: null,
          reinstatement_full_time_jobs_involved: null,
          conversion_full_time_jobs_involved: null,
          reinstatement_financial_assistance_amount: null,
          reinstatement_schedule_start_date: null,
          reinstatement_schedule_end_date: null,
          operations_first_year: null,
        },
      ]);
    });

    it("Saves given reconversion project with exhaustive data in table reconversion_projects", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProject = buildReconversionProject({
        ...buildExhaustiveReconversionProjectProps(),
        createdAt: now,
        relatedSiteId: siteId,
      });

      await reconversionProjectRepository.save(reconversionProject);

      const result = await sqlConnection("reconversion_projects").select("*");
      expect(result).toEqual([
        {
          id: reconversionProject.id,
          created_by: reconversionProject.createdBy,
          name: reconversionProject.name,
          related_site_id: siteId,
          created_at: now,
          description: reconversionProject.description,
          future_operator_name: reconversionProject.futureOperator?.name,
          future_operator_structure_type: reconversionProject.futureOperator?.structureType,
          future_site_owner_name: reconversionProject.futureSiteOwner?.name,
          future_site_owner_structure_type: reconversionProject.futureSiteOwner?.structureType,
          future_operations_full_time_jobs: reconversionProject.operationsFullTimeJobsInvolved,
          reinstatement_contract_owner_name: reconversionProject.reinstatementContractOwner?.name,
          reinstatement_contract_owner_structure_type:
            reconversionProject.reinstatementContractOwner?.structureType,
          reinstatement_cost: reconversionProject.reinstatementCost,
          real_estate_transaction_cost: reconversionProject.realEstateTransactionCost,
          reinstatement_full_time_jobs_involved:
            reconversionProject.reinstatementFullTimeJobsInvolved,
          conversion_full_time_jobs_involved: reconversionProject.conversionFullTimeJobsInvolved,
          reinstatement_financial_assistance_amount:
            reconversionProject.reinstatementFinancialAssistanceAmount,
          reinstatement_schedule_start_date: reconversionProject.reinstatementSchedule?.startDate,
          reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
          operations_first_year: reconversionProject.operationsFirstYear,
        },
      ]);
    });

    it("Saves given reconversion project in tables reconversion_projects_soils_distributions, reconversion_projects_development_plans, reconversion_project_yearly_expenses and reconversion_project_yearly_revenues", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProject = buildReconversionProject({
        ...buildExhaustiveReconversionProjectProps(),
        relatedSiteId: siteId,
        soilsDistribution: { ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1200, PRAIRIE_GRASS: 5000 },
      });

      await reconversionProjectRepository.save(reconversionProject);

      const result = await sqlConnection("reconversion_projects").select("id");
      expect(result).toEqual([{ id: reconversionProject.id }]);

      const soilsDistributionResult = await sqlConnection(
        "reconversion_project_soils_distributions",
      ).select("surface_area", "soil_type", "reconversion_project_id");

      expect(soilsDistributionResult).toEqual([
        {
          soil_type: "ARTIFICIAL_GRASS_OR_BUSHES_FILLED",
          surface_area: 1200.0,
          reconversion_project_id: reconversionProject.id,
        },
        {
          soil_type: "PRAIRIE_GRASS",
          surface_area: 5000.0,
          reconversion_project_id: reconversionProject.id,
        },
      ]);

      const developmentPlansResult = await sqlConnection(
        "reconversion_project_development_plans",
      ).select(
        "type",
        "features",
        "reconversion_project_id",
        "cost",
        "schedule_start_date",
        "schedule_end_date",
      );
      expect(developmentPlansResult).toEqual([
        {
          type: reconversionProject.developmentPlans[0].type,
          cost: 1300,
          features: reconversionProject.developmentPlans[0].features,
          reconversion_project_id: reconversionProject.id,
          schedule_start_date:
            reconversionProject.developmentPlans[0].installationSchedule?.startDate,
          schedule_end_date: reconversionProject.developmentPlans[0].installationSchedule?.endDate,
        },
      ]);

      const yearlyExpensesResult = await sqlConnection(
        "reconversion_project_yearly_expenses",
      ).select("amount", "purpose", "reconversion_project_id");
      expect(yearlyExpensesResult).toEqual([
        {
          purpose: "rent",
          amount: 12000.0,
          reconversion_project_id: reconversionProject.id,
        },
      ]);

      const yearlyRevenuesResult = await sqlConnection(
        "reconversion_project_yearly_revenues",
      ).select("amount", "source", "reconversion_project_id");
      expect(yearlyRevenuesResult).toEqual([
        {
          source: "operations",
          amount: 13000.0,
          reconversion_project_id: reconversionProject.id,
        },
      ]);
    });
  });
});
