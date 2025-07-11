import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { DevelopmentPlan } from "src/reconversion-projects/core/model/reconversionProject";
import {
  ApiReconversionProjectImpactsDataView,
  ReconversionProjectImpactsQuery,
} from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

const sumIfNotNullish = (
  a: number | null | undefined,
  b: number | null | undefined,
): number | undefined => {
  if (a == null) return undefined;
  return b ? a + b : a;
};

export type ReconversionProjectImpactsQueryResult = Omit<
  ApiReconversionProjectImpactsDataView,
  "developmentPlan"
> & {
  developmentPlan?: {
    installationCosts: ApiReconversionProjectImpactsDataView["developmentPlan"]["installationCosts"];
  } & Partial<Omit<ApiReconversionProjectImpactsDataView["developmentPlan"], "installationCosts">>;
};

export class SqlReconversionProjectImpactsQuery implements ReconversionProjectImpactsQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsQueryResult | undefined> {
    const reconversionProject = await this.sqlConnection("reconversion_projects")
      .select(
        "id",
        "name",
        "creation_mode",
        "related_site_id",
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
        "buildings_resale_expected_selling_price",
        "buildings_resale_expected_property_transfer_duties",
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
      developer_name?: string;
      type: DevelopmentPlan["type"];
      schedule_start_date?: Date;
      schedule_end_date?: Date;
      features?: DevelopmentPlan["features"];
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
      !sqlDevelopmentPlan || Object.keys(sqlDevelopmentPlan.features ?? {}).length === 0
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

    const sitePurchaseTotalAmount = sumIfNotNullish(
      reconversionProject.site_purchase_selling_price,
      reconversionProject.site_purchase_property_transfer_duties,
    );

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
      conversionSchedule,
      reinstatementSchedule,
      futureOperatorName: reconversionProject.future_operator_name ?? undefined,
      futureSiteOwnerName: reconversionProject.future_site_owner_name ?? undefined,
      reinstatementContractOwnerName:
        reconversionProject.reinstatement_contract_owner_name ?? undefined,
      sitePurchaseTotalAmount,
      sitePurchasePropertyTransferDutiesAmount:
        reconversionProject.site_purchase_property_transfer_duties ?? undefined,
      reinstatementExpenses: sqlReinstatementCosts,
      financialAssistanceRevenues: sqlFinancialAssistanceRevenues,
      yearlyProjectedExpenses: sqlExpenses,
      yearlyProjectedRevenues: sqlRevenues,
      developmentPlan: sqlDevelopmentPlan
        ? {
            type: sqlDevelopmentPlan.type,
            features: sqlDevelopmentPlanFeatures ?? undefined,
            developerName: sqlDevelopmentPlan.developer_name ?? undefined,
            installationCosts: sqlDevelopmentPlan.costs,
            installationSchedule: sqlDevelopmentPlan.schedule_start_date
              ? {
                  startDate: sqlDevelopmentPlan.schedule_start_date,
                  endDate: sqlDevelopmentPlan.schedule_end_date,
                }
              : undefined,
          }
        : undefined,
      operationsFirstYear: reconversionProject.operations_first_year ?? undefined,
      siteResaleSellingPrice: reconversionProject.site_resale_expected_selling_price ?? undefined,
      buildingsResaleSellingPrice:
        reconversionProject.buildings_resale_expected_selling_price ?? undefined,
      decontaminatedSoilSurface:
        reconversionProject.friche_decontaminated_soil_surface_area ?? undefined,
    } as ReconversionProjectImpactsQueryResult;
  }
}
