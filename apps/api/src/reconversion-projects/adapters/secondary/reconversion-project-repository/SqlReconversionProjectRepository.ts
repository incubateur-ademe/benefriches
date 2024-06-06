import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { v4 as uuid } from "uuid";
import { ReconversionProject } from "src/reconversion-projects/core/model/reconversionProject";
import { ReconversionProjectRepository } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SoilType } from "src/soils/domain/soils";

declare module "knex/types/tables" {
  interface Tables {
    reconversion_projects: SqlReconversionProject;
    reconversion_project_soils_distributions: SqlSoilsDistribution;
    reconversion_project_development_plans: SqlDevelopmentPlan;
    reconversion_project_yearly_expenses: SqlExpense;
    reconversion_project_yearly_revenues: SqlRevenue;
    reconversion_project_reinstatement_costs: SqlReinstatementCost;
  }
}
type SqlReconversionProject = {
  id: string;
  created_by: string;
  name: string;
  description?: string;
  related_site_id: string;
  future_operator_name?: string;
  future_operator_structure_type?: string;
  future_site_owner_name?: string;
  future_site_owner_structure_type?: string;
  future_operations_full_time_jobs?: number;
  conversion_full_time_jobs_involved?: number;
  operations_first_year?: number;
  // revenues
  financial_assistance_revenues?: number;
  // reinstatement
  reinstatement_contract_owner_name?: string;
  reinstatement_contract_owner_structure_type?: string;
  reinstatement_full_time_jobs_involved?: number;
  reinstatement_schedule_start_date?: Date;
  reinstatement_schedule_end_date?: Date;
  // real estate transaction
  real_estate_transaction_selling_price?: number;
  real_estate_transaction_property_transfer_duties?: number;
  // project phase
  project_phase: string;
  project_phase_details?: string;
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
  developer_name: string;
  developer_structure_type: string;
  features: unknown;
  reconversion_project_id: string;
  schedule_start_date?: Date;
  schedule_end_date?: Date;
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

type SqlReinstatementCost = {
  id: string;
  purpose: string;
  amount: number;
  reconversion_project_id: string;
};

export class SqlReconversionProjectRepository implements ReconversionProjectRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(reconversionProject: ReconversionProject): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      const [insertedReconversionProject] = await trx("reconversion_projects").insert(
        {
          id: reconversionProject.id,
          created_by: reconversionProject.createdBy,
          name: reconversionProject.name,
          description: reconversionProject.description,
          created_at: reconversionProject.createdAt,
          related_site_id: reconversionProject.relatedSiteId,
          future_operator_name: reconversionProject.futureOperator?.name,
          future_operator_structure_type: reconversionProject.futureOperator?.structureType,
          future_site_owner_name: reconversionProject.futureSiteOwner?.name,
          future_site_owner_structure_type: reconversionProject.futureSiteOwner?.structureType,
          future_operations_full_time_jobs: reconversionProject.operationsFullTimeJobsInvolved,
          reinstatement_contract_owner_name: reconversionProject.reinstatementContractOwner?.name,
          reinstatement_contract_owner_structure_type:
            reconversionProject.reinstatementContractOwner?.structureType,
          real_estate_transaction_selling_price:
            reconversionProject.realEstateTransactionSellingPrice,
          real_estate_transaction_property_transfer_duties:
            reconversionProject.realEstateTransactionPropertyTransferDuties,
          reinstatement_full_time_jobs_involved:
            reconversionProject.reinstatementFullTimeJobsInvolved,
          conversion_full_time_jobs_involved: reconversionProject.conversionFullTimeJobsInvolved,
          financial_assistance_revenues: reconversionProject.financialAssistanceRevenues,
          reinstatement_schedule_start_date: reconversionProject.reinstatementSchedule?.startDate,
          reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
          operations_first_year: reconversionProject.operationsFirstYear,
          project_phase: reconversionProject.projectPhase,
          project_phase_details: reconversionProject.projectPhaseDetails,
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
        reconversionProject.developmentPlans.map(
          ({ features, type, cost, installationSchedule, developer }) => {
            return {
              id: uuid(),
              type,
              developer_name: developer.name,
              developer_structure_type: developer.structureType,
              cost,
              features,
              schedule_start_date: installationSchedule?.startDate,
              schedule_end_date: installationSchedule?.endDate,
              reconversion_project_id: insertedReconversionProject.id,
            };
          },
        );
      await trx("reconversion_project_development_plans").insert(developmentPlansToInsert);

      if (reconversionProject.yearlyProjectedCosts.length > 0) {
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
      }

      if (reconversionProject.yearlyProjectedRevenues.length > 0) {
        const yearlyRevenuesToInsert: SqlRevenue[] =
          reconversionProject.yearlyProjectedRevenues.map(({ amount, source }) => {
            return {
              id: uuid(),
              amount,
              source,
              reconversion_project_id: insertedReconversionProject.id,
            };
          });
        await trx("reconversion_project_yearly_revenues").insert(yearlyRevenuesToInsert);
      }

      if (
        reconversionProject.reinstatementCosts &&
        reconversionProject.reinstatementCosts.length > 0
      ) {
        const reinstatementCostsToInsert: SqlReinstatementCost[] =
          reconversionProject.reinstatementCosts.map(({ amount, purpose }) => {
            return {
              id: uuid(),
              amount,
              purpose,
              reconversion_project_id: insertedReconversionProject.id,
            };
          });
        await trx("reconversion_project_reinstatement_costs").insert(reinstatementCostsToInsert);
      }
    });
  }

  async existsWithId(reconversionProjectId: string): Promise<boolean> {
    const exists = await this.sqlConnection<SqlReconversionProject>("reconversion_projects")
      .select("id")
      .where({ id: reconversionProjectId })
      .first();
    return !!exists;
  }

  async getById(
    reconversionProjectId: string,
  ): Promise<
    Pick<ReconversionProject, "id" | "name" | "relatedSiteId" | "soilsDistribution"> | undefined
  > {
    const reconversionProject = await this.sqlConnection("reconversion_projects")
      .select("id", "name", "related_site_id")
      .where({ id: reconversionProjectId })
      .first();

    const sqlSoilDistributions = await this.sqlConnection(
      "reconversion_project_soils_distributions",
    )
      .select("soil_type", "surface_area")
      .where("reconversion_project_id", reconversionProjectId);

    return (
      reconversionProject && {
        id: reconversionProject.id,
        name: reconversionProject.name,
        relatedSiteId: reconversionProject.related_site_id,
        soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
          return {
            ...acc,
            [soil_type]: surface_area,
          };
        }, {}),
      }
    );
  }
}
