import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import {
  Schedule,
  DevelopmentPlan,
  PhotovoltaicPowerStationFeatures,
} from "src/reconversion-projects/core/model/reconversionProject";
import { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import {
  ReconversionProjectFeaturesView,
  ReconversionProjectQueryGateway,
} from "../../../../core/usecases/getReconversionProjectFeatures.usecase";

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
        "creation_mode",
        "name",
        "description",
        "friche_decontaminated_soil_surface_area",
        "operations_first_year",
        "future_site_owner_name",
        "future_operator_name",
        "reinstatement_contract_owner_name",
        "reinstatement_schedule_start_date",
        "reinstatement_schedule_end_date",
        "site_purchase_selling_price",
        "site_purchase_property_transfer_duties",
        "site_resale_expected_selling_price",
        "buildings_resale_expected_selling_price",
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(soils_distribution_rows))"))
          .from({ soils_distribution_rows: "reconversion_project_soils_distributions" })
          .where("reconversion_project_id", reconversionProjectId)
          .as("soils_distribution"),
        this.sqlConnection
          .select(
            this.sqlConnection.raw("json_agg(row_to_json(financial_assistance_revenues_rows))"),
          )
          .from(
            this.sqlConnection("reconversion_project_financial_assistance_revenues")
              .select("amount", "source")
              .where("reconversion_project_id", reconversionProjectId)
              .as("financial_assistance_revenues_rows"),
          )
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
          creation_mode: string;
          description: string | null;
          friche_decontaminated_soil_surface_area: number | null;
          operations_first_year: number | null;
          future_site_owner_name: string | null;
          future_operator_name: string | null;
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
          buildings_resale_expected_selling_price: number | null;
          development_plan: {
            type: string;
            costs: { amount: number; purpose: string }[] | null;
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
          installationCosts: sqlResult.development_plan.costs ?? [],
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
      if (sqlResult.development_plan.type === "URBAN_PROJECT") {
        const { spacesDistribution, buildingsFloorAreaDistribution } = sqlResult.development_plan
          .features as UrbanProjectFeatures;
        return {
          installationCosts: sqlResult.development_plan.costs ?? [],
          developerName: sqlResult.development_plan.developer_name,
          installationSchedule: mapSqlSchedule(
            sqlResult.development_plan.schedule_start_date,
            sqlResult.development_plan.schedule_end_date,
          ),
          type: "URBAN_PROJECT",
          spaces: spacesDistribution,
          buildingsFloorArea: buildingsFloorAreaDistribution,
        };
      }
      throw new Error("Unknown development plan type");
    };

    return {
      id: sqlResult.id,
      name: sqlResult.name,
      description: sqlResult.description ?? undefined,
      isExpress: sqlResult.creation_mode === "express",
      decontaminatedSoilSurface: sqlResult.friche_decontaminated_soil_surface_area ?? undefined,
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
      reinstatementSchedule: mapSqlSchedule(
        sqlResult.reinstatement_schedule_start_date,
        sqlResult.reinstatement_schedule_end_date,
      ),
      financialAssistanceRevenues: sqlResult.financial_assistance_revenues ?? undefined,
      reinstatementCosts: sqlResult.reinstatement_costs ?? undefined,
      sitePurchaseTotalAmount: sumIfNotNull(
        sqlResult.site_purchase_selling_price,
        sqlResult.site_purchase_property_transfer_duties,
      ),
      siteResaleSellingPrice: sqlResult.site_resale_expected_selling_price ?? undefined,
      buildingsResaleSellingPrice: sqlResult.buildings_resale_expected_selling_price ?? undefined,
    };
  }
}
