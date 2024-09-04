import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { DevelopmentPlan } from "src/reconversion-projects/core/model/reconversionProject";
import {
  ReconversionProjectImpactsDataView,
  ReconversionProjectImpactsQuery,
} from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

export class SqlReconversionProjectImpactsQuery implements ReconversionProjectImpactsQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsDataView | undefined> {
    const reconversionProject = await this.sqlConnection("reconversion_projects")
      .select(
        "id",
        "name",
        "creation_mode",
        "related_site_id",
        "conversion_full_time_jobs_involved",
        "future_operations_full_time_jobs",
        "reinstatement_full_time_jobs_involved",
        "reinstatement_schedule_start_date",
        "reinstatement_schedule_end_date",
        "future_operator_name",
        "future_site_owner_name",
        "reinstatement_contract_owner_name",
        "site_purchase_selling_price",
        "site_purchase_property_transfer_duties",
        "operations_first_year",
        "site_resale_expected_selling_price",
        "site_resale_expected_property_transfer_duties",
        "friche_decontaminated_soil_surface_area",
      )
      .where({ id: reconversionProjectId })
      .first();

    if (!reconversionProject) return undefined;

    const sqlSoilDistributions = await this.sqlConnection(
      "reconversion_project_soils_distributions",
    )
      .select("soil_type", "surface_area")
      .where("reconversion_project_id", reconversionProjectId);

    const sqlDevelopmentPlanResult: {
      id: string;
      developer_structure_type: string;
      developer_name: string;
      type: DevelopmentPlan["type"];
      schedule_start_date?: Date;
      schedule_end_date?: Date;
      features: DevelopmentPlan["features"];
      costs: { amount: number; purpose: string }[];
    }[] = await this.sqlConnection("reconversion_project_development_plans as dp")
      .where("dp.reconversion_project_id", reconversionProjectId)
      .leftJoin(
        "reconversion_project_development_plan_costs as cost",
        "dp.id",
        "=",
        "cost.development_plan_id",
      )
      .select(
        "dp.id",
        "dp.type",
        "dp.features",
        "dp.developer_structure_type",
        "dp.developer_name",
        "dp.schedule_start_date",
        "dp.schedule_end_date",
        this.sqlConnection.raw(`
        CASE 
          WHEN count(cost.id) = 0 THEN '[]'::json
          ELSE json_agg(json_build_object('amount', cost.amount, 'purpose', cost.purpose)) 
        END as "costs"
      `),
      )
      .groupBy("dp.id");
    const sqlDevelopmentPlan = sqlDevelopmentPlanResult[0] as
      | (typeof sqlDevelopmentPlanResult)[number]
      | undefined;

    const sqlDevelopmentPlanFeatures =
      !sqlDevelopmentPlan || Object.keys(sqlDevelopmentPlan.features).length === 0
        ? undefined
        : sqlDevelopmentPlan.features;

    const conversionSchedule =
      sqlDevelopmentPlan?.schedule_start_date && sqlDevelopmentPlan.schedule_end_date
        ? {
            startDate: sqlDevelopmentPlan.schedule_start_date,
            endDate: sqlDevelopmentPlan.schedule_end_date,
          }
        : undefined;
    const reinstatementSchedule =
      reconversionProject.reinstatement_schedule_start_date &&
      reconversionProject.reinstatement_schedule_end_date
        ? {
            startDate: reconversionProject.reinstatement_schedule_start_date,
            endDate: reconversionProject.reinstatement_schedule_end_date,
          }
        : undefined;

    const sqlExpenses = await this.sqlConnection("reconversion_project_yearly_expenses")
      .select("amount", "purpose")
      .where("reconversion_project_id", reconversionProjectId);

    const sqlRevenues = await this.sqlConnection("reconversion_project_yearly_revenues")
      .select("amount", "source")
      .where("reconversion_project_id", reconversionProjectId);

    const sqlReinstatementCosts = await this.sqlConnection(
      "reconversion_project_reinstatement_costs",
    )
      .select("amount", "purpose")
      .where("reconversion_project_id", reconversionProjectId);

    const sqlFinancialAssistanceRevenues = await this.sqlConnection(
      "reconversion_project_financial_assistance_revenues",
    )
      .select("amount", "source")
      .where("reconversion_project_id", reconversionProjectId);

    const sitePurchaseTotalAmount = reconversionProject.site_purchase_selling_price
      ? reconversionProject.site_purchase_selling_price +
        (reconversionProject.site_purchase_property_transfer_duties ?? 0)
      : undefined;
    const siteResaleTotalAmount = reconversionProject.site_resale_expected_selling_price
      ? reconversionProject.site_resale_expected_selling_price +
        (reconversionProject.site_resale_expected_property_transfer_duties ?? 0)
      : undefined;

    return {
      id: reconversionProject.id,
      name: reconversionProject.name,
      isExpressProject: reconversionProject.creation_mode === "express",
      relatedSiteId: reconversionProject.related_site_id,
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type]: surface_area,
        };
      }, {}),
      conversionFullTimeJobs: reconversionProject.conversion_full_time_jobs_involved ?? undefined,
      conversionSchedule,
      operationsFullTimeJobs: reconversionProject.future_operations_full_time_jobs ?? undefined,
      reinstatementFullTimeJobs:
        reconversionProject.reinstatement_full_time_jobs_involved ?? undefined,
      reinstatementSchedule,
      futureOperatorName: reconversionProject.future_operator_name ?? undefined,
      futureSiteOwnerName: reconversionProject.future_site_owner_name ?? undefined,
      reinstatementContractOwnerName:
        reconversionProject.reinstatement_contract_owner_name ?? undefined,
      sitePurchaseTotalAmount,
      sitePurchasePropertyTransferDutiesAmount:
        reconversionProject.site_purchase_property_transfer_duties ?? undefined,
      reinstatementCosts: sqlReinstatementCosts,
      financialAssistanceRevenues: sqlFinancialAssistanceRevenues,
      yearlyProjectedCosts: sqlExpenses,
      yearlyProjectedRevenues: sqlRevenues,
      developmentPlanType: sqlDevelopmentPlan?.type ?? undefined,
      developmentPlanFeatures: sqlDevelopmentPlanFeatures,
      developmentPlanDeveloperName: sqlDevelopmentPlan?.developer_name ?? undefined,
      developmentPlanInstallationCosts: sqlDevelopmentPlan?.costs ?? [],
      operationsFirstYear: reconversionProject.operations_first_year ?? undefined,
      siteResaleTotalAmount,
      decontaminatedSoilSurface:
        reconversionProject.friche_decontaminated_soil_surface_area ?? undefined,
    };
  }
}
