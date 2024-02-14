import knex, { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { buildReconversionProject } from "src/reconversion-projects/domain/model/reconversionProject.mock";
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
          name: reconversionProject.name,
          related_site_id: siteId,
          created_at: now,
          description: null,
          future_operator_name: null,
          future_operator_structure_type: null,
          future_operations_full_time_jobs: null,
          reinstatement_contract_owner_name: null,
          reinstatement_contract_owner_structure_type: null,
          reinstatement_cost: null,
          reinstatement_full_time_jobs_involved: null,
          conversion_full_time_jobs_involved: null,
          reinstatement_financial_assistance_amount: 120.0,
        },
      ]);
    });

    it("Saves given reconversion project with complete data in table reconversion_projects", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProject = buildReconversionProject({
        createdAt: now,
        relatedSiteId: siteId,
        name: "A complete project",
        description: "A description",
        // developmentPlans: z.array(developmentPlanSchema).nonempty(),
        futureOperator: {
          name: "Future operator's name",
          structureType: "company",
        },
        conversionFullTimeJobsInvolved: 0.4,
        reinstatementFullTimeJobsInvolved: 1.2,
        reinstatementContractOwner: {
          name: "Future operator's name",
          structureType: "company",
        },
        operationsFullTimeJobsInvolved: 0.5,
        reinstatementCost: 149950,
        reinstatementFinancialAssistanceAmount: 50000,
      });

      await reconversionProjectRepository.save(reconversionProject);

      const result = await sqlConnection("reconversion_projects").select("*");
      expect(result).toEqual([
        {
          id: reconversionProject.id,
          name: reconversionProject.name,
          related_site_id: siteId,
          created_at: now,
          description: reconversionProject.description,
          future_operator_name: reconversionProject.futureOperator?.name,
          future_operator_structure_type: reconversionProject.futureOperator?.structureType,
          future_operations_full_time_jobs: 0.5,
          reinstatement_contract_owner_name: reconversionProject.reinstatementContractOwner?.name,
          reinstatement_contract_owner_structure_type:
            reconversionProject.reinstatementContractOwner?.structureType,
          reinstatement_cost: 149950.0,
          reinstatement_full_time_jobs_involved: 1.2,
          conversion_full_time_jobs_involved: 0.4,
          reinstatement_financial_assistance_amount: 50000.0,
        },
      ]);
    });

    it("Saves given reconversion project in tables reconversion_projects_soils_distributions, reconversion_projects_development_plans, reconversion_project_yearly_expenses and reconversion_project_yearly_revenues", async () => {
      const siteId = await insertSiteInDb();
      const reconversionProject = buildReconversionProject({
        relatedSiteId: siteId,
        soilsDistribution: { ARTIFICIAL_GRASS_OR_BUSHES_FILLED: 1200, PRAIRIE_GRASS: 5000 },
        developmentPlans: [
          {
            cost: 129999.99,
            features: {
              contractDuration: 26,
              electricalPowerKWc: 10000,
              expectedAnnualProduction: 1000,
              surfaceArea: 3400,
            },
            type: "PHOTOVOLTAIC_POWER_PLANT",
          },
        ],
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
      ).select("type", "features", "reconversion_project_id", "cost");
      expect(developmentPlansResult).toEqual([
        {
          type: reconversionProject.developmentPlans[0].type,
          cost: 129999.99,
          features: reconversionProject.developmentPlans[0].features,
          reconversion_project_id: reconversionProject.id,
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
