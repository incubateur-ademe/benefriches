import { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { ReconversionProject } from "src/reconversion-projects/domain/model/reconversionProject";
import { ReconversionProjectRepository } from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";
import { SoilType } from "src/soils/domain/soils";

declare module "knex/types/tables" {
  interface Tables {
    reconversion_projects: SqlReconversionProject;
    reconversion_project_soils_distributions: SqlSoilsDistribution;
    reconversion_project_development_plans: SqlDevelopmentPlan;
    reconversion_project_yearly_expenses: SqlExpense;
    reconversion_project_yearly_revenues: SqlRevenue;
  }
}
type SqlReconversionProject = {
  id: string;
  name: string;
  description?: string;
  related_site_id: string;
  future_operator_name?: string;
  future_operator_structure_type?: string;
  future_operations_full_time_jobs?: number;
  reinstatement_contract_owner_name?: string;
  reinstatement_contract_owner_structure_type?: string;
  reinstatement_cost?: number;
  reinstatement_full_time_jobs_involved?: number;
  conversion_full_time_jobs_involved?: number;
  reinstatement_financial_assistance_amount?: number;
  // dates
  created_at: Date;
};

type SqlSoilsDistribution = {
  id: string;
  soil_type: SoilType;
  surface_area: number;
  reconversion_project_id: string;
};

type SqlDevelopmentPlan = {
  id: string;
  type: string;
  cost: number;
  features: unknown;
  reconversion_project_id: string;
};

type SqlExpense = {
  id: string;
  purpose: string;
  amount: number;
  reconversion_project_id: string;
};

type SqlRevenue = {
  id: string;
  source: string;
  amount: number;
  reconversion_project_id: string;
};

export class SqlReconversionProjectRepository implements ReconversionProjectRepository {
  constructor(private readonly sqlConnection: Knex) {}

  async save(reconversionProject: ReconversionProject): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      const [insertedReconversionProject] = await trx("reconversion_projects").insert(
        {
          id: reconversionProject.id,
          name: reconversionProject.name,
          description: reconversionProject.description,
          created_at: reconversionProject.createdAt,
          related_site_id: reconversionProject.relatedSiteId,
          future_operator_name: reconversionProject.futureOperator?.name,
          future_operator_structure_type: reconversionProject.futureOperator?.structureType,
          future_operations_full_time_jobs: reconversionProject.operationsFullTimeJobsInvolved,
          reinstatement_contract_owner_name: reconversionProject.reinstatementContractOwner?.name,
          reinstatement_contract_owner_structure_type:
            reconversionProject.reinstatementContractOwner?.structureType,
          reinstatement_cost: reconversionProject.reinstatementCost,
          reinstatement_full_time_jobs_involved:
            reconversionProject.reinstatementFullTimeJobsInvolved,
          conversion_full_time_jobs_involved: reconversionProject.conversionFullTimeJobsInvolved,
          reinstatement_financial_assistance_amount:
            reconversionProject.reinstatementFinancialAssistanceAmount,
        },
        "id",
      );

      // soils distribution
      const soilsDistributionToInsert: SqlSoilsDistribution[] = Object.entries(
        reconversionProject.soilsDistribution,
      ).map(([soilType, surfaceArea]) => {
        return {
          id: uuid(),
          soil_type: soilType as SoilType,
          surface_area: surfaceArea,
          reconversion_project_id: insertedReconversionProject.id,
        };
      });
      await trx("reconversion_project_soils_distributions").insert(soilsDistributionToInsert);

      // development plans
      const developmentPlansToInsert: SqlDevelopmentPlan[] =
        reconversionProject.developmentPlans.map(({ features, type, cost }) => {
          return {
            id: uuid(),
            type,
            cost,
            features,
            reconversion_project_id: insertedReconversionProject.id,
          };
        });
      await trx("reconversion_project_development_plans").insert(developmentPlansToInsert);

      const yearlyExpensesToInsert: SqlExpense[] = reconversionProject.yearlyProjectedCosts.map(
        ({ amount, purpose }) => {
          return {
            id: uuid(),
            amount,
            purpose,
            reconversion_project_id: insertedReconversionProject.id,
          };
        },
      );
      await trx("reconversion_project_yearly_expenses").insert(yearlyExpensesToInsert);
      const yearlyRevenuesToInsert: SqlRevenue[] = reconversionProject.yearlyProjectedRevenues.map(
        ({ amount, source }) => {
          return {
            id: uuid(),
            amount,
            source,
            reconversion_project_id: insertedReconversionProject.id,
          };
        },
      );
      await trx("reconversion_project_yearly_revenues").insert(yearlyRevenuesToInsert);
    });
  }

  async existsWithId(reconversionProjectId: string): Promise<boolean> {
    const exists = await this.sqlConnection<SqlReconversionProject>("reconversion_projects")
      .select("id")
      .where({ id: reconversionProjectId })
      .first();
    return !!exists;
  }
}
