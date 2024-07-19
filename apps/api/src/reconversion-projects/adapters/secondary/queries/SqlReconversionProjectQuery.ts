import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { MixedUseNeighbourhoodFeatures } from "src/reconversion-projects/core/model/mixedUseNeighbourhood";
import {
  DevelopmentPlan,
  PhotovoltaicPowerStationFeatures,
  Schedule,
} from "src/reconversion-projects/core/model/reconversionProject";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  ReconversionProjectFeaturesView,
  ReconversionProjectQueryGateway,
} from "../../../core/usecases/getReconversionProjectFeatures.usecase";

const mapSqlSchedule = (startDate: string | null, endDate: string | null): Schedule | undefined => {
  return startDate && endDate
    ? {
        startDate: new Date(startDate),
        endDate: new Date(endDate),
      }
    : undefined;
};

const sumIfNotNull = (a: number | null, b: number | null): number | undefined => {
  return a && b ? a + b : undefined;
};

export class SqlReconversionProjectQuery implements ReconversionProjectQueryGateway {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getFeaturesById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectFeaturesView | undefined> {
    const sqlResult = (await this.sqlConnection("reconversion_projects")
      .select(
        "id",
        "name",
        "description",
        "operations_first_year",
        "future_site_owner_name",
        "future_operator_name",
        "conversion_full_time_jobs_involved",
        "reinstatement_full_time_jobs_involved",
        "future_operations_full_time_jobs",
        "reinstatement_contract_owner_name",
        "reinstatement_schedule_start_date",
        "reinstatement_schedule_end_date",
        "site_purchase_selling_price",
        "site_purchase_property_transfer_duties",
        "site_resale_expected_selling_price",
        "site_resale_expected_property_transfer_duties",
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(soils_distribution_rows))"))
          .from({ soils_distribution_rows: "reconversion_project_soils_distributions" })
          .where("reconversion_project_id", reconversionProjectId)
          .as("soils_distribution"),
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(financial_assistance_rows))"))
          .from({ financial_assistance_rows: "reconversion_project_financial_assistance_revenues" })
          .where("reconversion_project_id", reconversionProjectId)
          .as("financial_assistance_revenues"),
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(reinstatement_costs_rows))"))
          .from(
            this.sqlConnection("reconversion_project_reinstatement_costs")
              .select("amount", "purpose")
              .where("reconversion_project_id", reconversionProjectId)
              .as("reinstatement_costs_rows"),
          )
          .as("reinstatement_costs"),
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(expenses_rows))"))
          .from(
            this.sqlConnection("reconversion_project_yearly_expenses")
              .select("amount", "purpose")
              .where("reconversion_project_id", reconversionProjectId)
              .as("expenses_rows"),
          )
          .as("expenses"),
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(revenues_rows))"))
          .from(
            this.sqlConnection("reconversion_project_yearly_revenues")
              .select("amount", "source")
              .where("reconversion_project_id", reconversionProjectId)
              .as("revenues_rows"),
          )
          .as("revenues"),
        this.sqlConnection.raw(
          `(
              SELECT row_to_json(development_plan_row)
              FROM (
                SELECT
                  dp.developer_name, dp.schedule_start_date, dp.schedule_end_date, dp.type, dp.features,
                  (
                    SELECT json_agg(row_to_json(development_plan_costs_rows))
                    FROM (
                      SELECT amount, purpose
                      FROM reconversion_project_development_plan_costs
                      WHERE development_plan_id = dp.id
                    ) development_plan_costs_rows
                  ) as costs
                FROM reconversion_project_development_plans dp
                WHERE dp.reconversion_project_id = ?
                LIMIT 1
              ) development_plan_row
            ) as development_plan`,
          [reconversionProjectId],
        ),
      )
      .where("reconversion_projects.id", reconversionProjectId)
      .first()) as
      | {
          id: string;
          name: string;
          description: string | null;
          operations_first_year: number | null;
          future_site_owner_name: string | null;
          future_operator_name: string | null;
          future_operations_full_time_jobs: number | null;
          conversion_full_time_jobs_involved: number | null;
          reinstatement_full_time_jobs_involved: number | null;
          reinstatement_contract_owner_name: string | null;
          reinstatement_schedule_start_date: string | null;
          reinstatement_schedule_end_date: string | null;
          soils_distribution: { soil_type: string; surface_area: number }[];
          expenses: { amount: number; purpose: string }[] | null;
          revenues: { amount: number; source: string }[] | null;
          financial_assistance_revenues: { amount: number; source: string }[] | null;
          reinstatement_costs: { amount: number; purpose: string }[] | null;
          site_purchase_selling_price: number | null;
          site_purchase_property_transfer_duties: number | null;
          site_resale_expected_selling_price: number | null;
          site_resale_expected_property_transfer_duties: number | null;
          development_plan: {
            type: string;
            costs: { amount: number; purpose: string }[];
            developer_name: string;
            schedule_start_date: string | null;
            schedule_end_date: string | null;
            features: DevelopmentPlan["features"];
          };
        }
      | undefined;

    if (!sqlResult) {
      return undefined;
    }

    const getDevelopmentPlan = (): ReconversionProjectFeaturesView["developmentPlan"] => {
      if (sqlResult.development_plan.type === "PHOTOVOLTAIC_POWER_PLANT") {
        const { contractDuration, electricalPowerKWc, surfaceArea, expectedAnnualProduction } =
          sqlResult.development_plan.features as PhotovoltaicPowerStationFeatures;
        return {
          installationCosts: sqlResult.development_plan.costs,
          developerName: sqlResult.development_plan.developer_name,
          installationSchedule: mapSqlSchedule(
            sqlResult.development_plan.schedule_start_date,
            sqlResult.development_plan.schedule_end_date,
          ),
          type: "PHOTOVOLTAIC_POWER_PLANT",
          contractDuration,
          electricalPowerKWc,
          surfaceArea,
          expectedAnnualProduction,
        };
      }
      if (sqlResult.development_plan.type === "MIXED_USE_NEIGHBOURHOOD") {
        return {
          installationCosts: sqlResult.development_plan.costs,
          developerName: sqlResult.development_plan.developer_name,
          installationSchedule: mapSqlSchedule(
            sqlResult.development_plan.schedule_start_date,
            sqlResult.development_plan.schedule_end_date,
          ),
          type: "MIXED_USE_NEIGHBOURHOOD",
          spaces: (sqlResult.development_plan.features as MixedUseNeighbourhoodFeatures)
            .spacesDistribution,
        };
      }
      throw new Error("Unknown development plan type");
    };

    return {
      id: sqlResult.id,
      name: sqlResult.name,
      description: sqlResult.description ?? undefined,
      firstYearOfOperation: sqlResult.operations_first_year ?? undefined,
      futureOwner: sqlResult.future_site_owner_name ?? undefined,
      futureOperator: sqlResult.future_operator_name ?? undefined,
      developmentPlan: getDevelopmentPlan(),
      soilsDistribution: sqlResult.soils_distribution.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type]: surface_area,
        };
      }, {}),
      yearlyProjectedExpenses: sqlResult.expenses ?? [],
      yearlyProjectedRevenues: sqlResult.revenues ?? [],
      reinstatementContractOwner: sqlResult.reinstatement_contract_owner_name ?? undefined,
      conversionFullTimeJobs: sqlResult.conversion_full_time_jobs_involved ?? undefined,
      operationsFullTimeJobs: sqlResult.future_operations_full_time_jobs ?? undefined,
      reinstatementSchedule: mapSqlSchedule(
        sqlResult.reinstatement_schedule_start_date,
        sqlResult.reinstatement_schedule_end_date,
      ),
      reinstatementFullTimeJobs: sqlResult.reinstatement_full_time_jobs_involved ?? undefined,
      financialAssistanceRevenues: sqlResult.financial_assistance_revenues ?? undefined,
      reinstatementCosts: sqlResult.reinstatement_costs ?? undefined,
      sitePurchaseTotalAmount: sumIfNotNull(
        sqlResult.site_purchase_selling_price,
        sqlResult.site_purchase_property_transfer_duties,
      ),
      siteResaleTotalAmount: sumIfNotNull(
        sqlResult.site_resale_expected_selling_price,
        sqlResult.site_resale_expected_property_transfer_duties,
      ),
    };
  }
}
