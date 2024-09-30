import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { SoilType } from "shared";
import { v4 as uuid } from "uuid";

import { ReconversionProject } from "src/reconversion-projects/core/model/reconversionProject";
import { ReconversionProjectRepository } from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  SqlDevelopmentPlan,
  SqlDevelopmentPlanCost,
  SqlReconversionProject,
  SqlReconversionProjectExpense,
  SqlReconversionProjectSoilsDistribution,
  SqlReinstatementCost,
  SqlRevenue,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";

const mapRevenuesToSqlStruct = (
  revenues: { amount: number; source: string }[],
  reconversionProjectId: string,
): SqlRevenue[] => {
  return revenues.map(({ amount, source }) => {
    return {
      id: uuid(),
      amount,
      source,
      reconversion_project_id: reconversionProjectId,
    };
  });
};

export class SqlReconversionProjectRepository implements ReconversionProjectRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(reconversionProject: ReconversionProject): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      const [insertedReconversionProject] = await trx("reconversion_projects").insert(
        {
          id: reconversionProject.id,
          created_by: reconversionProject.createdBy,
          creation_mode: reconversionProject.creationMode,
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
          site_purchase_selling_price: reconversionProject.sitePurchaseSellingPrice,
          site_purchase_property_transfer_duties:
            reconversionProject.sitePurchasePropertyTransferDuties,
          reinstatement_full_time_jobs_involved:
            reconversionProject.reinstatementFullTimeJobsInvolved,
          conversion_full_time_jobs_involved: reconversionProject.conversionFullTimeJobsInvolved,
          reinstatement_schedule_start_date: reconversionProject.reinstatementSchedule?.startDate,
          reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
          operations_first_year: reconversionProject.operationsFirstYear,
          project_phase: reconversionProject.projectPhase,
          site_resale_expected_selling_price: reconversionProject.siteResaleExpectedSellingPrice,
          site_resale_expected_property_transfer_duties:
            reconversionProject.siteResaleExpectedPropertyTransferDuties,
          friche_decontaminated_soil_surface_area: reconversionProject.decontaminatedSoilSurface,
        },
        "id",
      );

      if (!insertedReconversionProject) throw new Error("Failed to insert reconversion project");

      // soils distribution
      const soilsDistributionToInsert: SqlReconversionProjectSoilsDistribution[] = Object.entries(
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

      // development plan
      const developmentPlanToInsert: SqlDevelopmentPlan = {
        id: uuid(),
        type: reconversionProject.developmentPlan.type,
        developer_name: reconversionProject.developmentPlan.developer.name,
        developer_structure_type: reconversionProject.developmentPlan.developer.structureType,
        features: reconversionProject.developmentPlan.features,
        schedule_start_date: reconversionProject.developmentPlan.installationSchedule?.startDate,
        schedule_end_date: reconversionProject.developmentPlan.installationSchedule?.endDate,
        reconversion_project_id: insertedReconversionProject.id,
      };
      await trx("reconversion_project_development_plans").insert(developmentPlanToInsert);
      if (reconversionProject.developmentPlan.costs.length > 0) {
        const costsToInsert: SqlDevelopmentPlanCost[] =
          reconversionProject.developmentPlan.costs.map(({ amount, purpose }) => {
            return {
              id: uuid(),
              amount,
              purpose,
              development_plan_id: developmentPlanToInsert.id,
            };
          });
        await trx("reconversion_project_development_plan_costs").insert(costsToInsert);
      }

      if (reconversionProject.yearlyProjectedCosts.length > 0) {
        const yearlyExpensesToInsert: SqlReconversionProjectExpense[] =
          reconversionProject.yearlyProjectedCosts.map(({ amount, purpose }) => {
            return {
              id: uuid(),
              amount,
              purpose,
              reconversion_project_id: insertedReconversionProject.id,
            };
          });
        await trx("reconversion_project_yearly_expenses").insert(yearlyExpensesToInsert);
      }

      if (reconversionProject.yearlyProjectedRevenues.length > 0) {
        const yearlyRevenuesToInsert: SqlRevenue[] = mapRevenuesToSqlStruct(
          reconversionProject.yearlyProjectedRevenues,
          insertedReconversionProject.id,
        );
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

      if (reconversionProject.financialAssistanceRevenues?.length) {
        const financialAssistanceRevenuesToInsert: SqlRevenue[] = mapRevenuesToSqlStruct(
          reconversionProject.financialAssistanceRevenues,
          insertedReconversionProject.id,
        );
        await trx("reconversion_project_financial_assistance_revenues").insert(
          financialAssistanceRevenuesToInsert,
        );
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
}
