import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { ReconversionProjectCreationMode, SoilType, SpaceCategory } from "shared";
import { v4 as uuid } from "uuid";

import { ReconversionProjectRepository } from "src/reconversion-projects/core/gateways/ReconversionProjectRepository";
import {
  PhotovoltaicPowerStationFeatures,
  ReconversionProjectSaveDto,
  ReconversionProjectUpdateDto,
  ReconversionProjectDataView,
  Schedule,
} from "src/reconversion-projects/core/model/reconversionProject";
import { UrbanProjectFeatures } from "src/reconversion-projects/core/model/urbanProjects";
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

const mapSqlSchedule = (startDate: Date | null, endDate: Date | null): Schedule | undefined => {
  return startDate && endDate ? { startDate, endDate } : undefined;
};

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

type ReconversionProjectSqlResult = {
  id: string;
  created_by: string;
  creation_mode: ReconversionProjectCreationMode;
  name: string;
  description: string | null;
  related_site_id: string;
  future_operator_name: string | null;
  future_operator_structure_type: string | null;
  future_site_owner_name: string | null;
  future_site_owner_structure_type: string | null;
  operations_first_year: number | null;
  // reinstatement
  reinstatement_contract_owner_name: string | null;
  reinstatement_contract_owner_structure_type: string | null;
  reinstatement_schedule_start_date: Date | null;
  reinstatement_schedule_end_date: Date | null;
  // site purchase
  site_purchase_selling_price: number | null;
  site_purchase_property_transfer_duties: number | null;
  // site resale
  site_resale_expected_selling_price: number | null;
  site_resale_expected_property_transfer_duties: number | null;
  // buildings resale
  buildings_resale_expected_selling_price: number | null;
  buildings_resale_expected_property_transfer_duties: number | null;
  // project phase
  project_phase: string;
  // dates
  created_at: Date;
  updated_at: Date;
  friche_decontaminated_soil_surface_area: number | null;
  soils_distribution:
    | {
        soil_type: string;
        surface_area: number;
        space_category: string | null;
      }[]
    | null;
  development_plan: {
    id: string;
    type: string;
    developer_name: string;
    developer_structure_type: string;
    features: unknown;
    reconversion_project_id: string;
    schedule_start_date: Date | null;
    schedule_end_date: Date | null;
    costs: { amount: number; purpose: string }[] | null;
  };
  yearly_projected_expenses: { purpose: string; amount: number }[] | null;
  yearly_projected_revenues: { source: string; amount: number }[] | null;
  reinstatement_costs: { purpose: string; amount: number }[] | null;
  financial_assistance_revenues: { source: string; amount: number }[] | null;
};

export class SqlReconversionProjectRepository implements ReconversionProjectRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(reconversionProject: ReconversionProjectSaveDto): Promise<void> {
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
          reinstatement_contract_owner_name: reconversionProject.reinstatementContractOwner?.name,
          reinstatement_contract_owner_structure_type:
            reconversionProject.reinstatementContractOwner?.structureType,
          site_purchase_selling_price: reconversionProject.sitePurchaseSellingPrice,
          site_purchase_property_transfer_duties:
            reconversionProject.sitePurchasePropertyTransferDuties,
          reinstatement_schedule_start_date: reconversionProject.reinstatementSchedule?.startDate,
          reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
          operations_first_year: reconversionProject.operationsFirstYear,
          project_phase: reconversionProject.projectPhase,
          site_resale_expected_selling_price: reconversionProject.siteResaleExpectedSellingPrice,
          site_resale_expected_property_transfer_duties:
            reconversionProject.siteResaleExpectedPropertyTransferDuties,
          buildings_resale_expected_selling_price:
            reconversionProject.buildingsResaleExpectedSellingPrice,
          buildings_resale_expected_property_transfer_duties:
            reconversionProject.buildingsResaleExpectedPropertyTransferDuties,
          friche_decontaminated_soil_surface_area: reconversionProject.decontaminatedSoilSurface,
        },
        "id",
      );

      if (!insertedReconversionProject) throw new Error("Failed to insert reconversion project");

      // soils distribution
      const soilsDistributionToInsert: SqlReconversionProjectSoilsDistribution[] =
        reconversionProject.soilsDistribution.map(({ soilType, surfaceArea, spaceCategory }) => {
          return {
            id: uuid(),
            soil_type: soilType,
            surface_area: surfaceArea,
            space_category: spaceCategory,
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
        schedule_start_date:
          reconversionProject.developmentPlan.installationSchedule?.startDate ?? null,
        schedule_end_date:
          reconversionProject.developmentPlan.installationSchedule?.endDate ?? null,
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

  async getById(reconversionProjectId: string): Promise<ReconversionProjectDataView | null> {
    const sqlResult = (await this.sqlConnection("reconversion_projects")
      .select(
        "id",
        "created_by",
        "creation_mode",
        "name",
        "description",
        "related_site_id",
        "future_operator_name",
        "future_operator_structure_type",
        "future_site_owner_name",
        "future_site_owner_structure_type",
        "operations_first_year",
        // reinstatement
        "reinstatement_contract_owner_name",
        "reinstatement_contract_owner_structure_type",
        "reinstatement_schedule_start_date",
        "reinstatement_schedule_end_date",
        // site purchase
        "site_purchase_selling_price",
        "site_purchase_property_transfer_duties",
        // site resale
        "site_resale_expected_selling_price",
        "site_resale_expected_property_transfer_duties",
        // buildings resale
        "buildings_resale_expected_selling_price",
        "buildings_resale_expected_property_transfer_duties",
        // project phase
        "project_phase",
        "created_at",
        "updated_at",
        "friche_decontaminated_soil_surface_area",
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
          .as("yearly_projected_expenses"),
        this.sqlConnection
          .select(this.sqlConnection.raw("json_agg(row_to_json(revenues_rows))"))
          .from(
            this.sqlConnection("reconversion_project_yearly_revenues")
              .select("amount", "source")
              .where("reconversion_project_id", reconversionProjectId)
              .as("revenues_rows"),
          )
          .as("yearly_projected_revenues"),
        this.sqlConnection.raw(
          `(
              SELECT row_to_json(development_plan_row)
              FROM (
                SELECT
                  dp.developer_name, dp.developer_structure_type, dp.schedule_start_date, dp.schedule_end_date, dp.type, dp.features,
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
      .first()) as ReconversionProjectSqlResult | undefined;

    if (!sqlResult) return null;

    const getDevelopmentPlan = (): ReconversionProjectDataView["developmentPlan"] => {
      const developer = {
        name: sqlResult.development_plan.developer_name,
        structureType: sqlResult.development_plan.developer_structure_type,
      };
      const installationSchedule = mapSqlSchedule(
        sqlResult.development_plan.schedule_start_date,
        sqlResult.development_plan.schedule_end_date,
      );
      const costs = sqlResult.development_plan.costs ?? [];

      if (sqlResult.development_plan.type === "PHOTOVOLTAIC_POWER_PLANT") {
        const { contractDuration, electricalPowerKWc, surfaceArea, expectedAnnualProduction } =
          sqlResult.development_plan.features as PhotovoltaicPowerStationFeatures;

        return {
          costs,
          developer,
          installationSchedule,
          type: "PHOTOVOLTAIC_POWER_PLANT",
          features: {
            contractDuration,
            electricalPowerKWc,
            surfaceArea,
            expectedAnnualProduction,
          },
        };
      }
      if (sqlResult.development_plan.type === "URBAN_PROJECT") {
        const { buildingsFloorAreaDistribution } = sqlResult.development_plan
          .features as UrbanProjectFeatures;

        return {
          costs,
          developer,
          installationSchedule,
          type: "URBAN_PROJECT",
          features: {
            buildingsFloorAreaDistribution,
          },
        };
      }
      throw new Error("Unknown development plan type");
    };

    return {
      id: sqlResult.id,
      name: sqlResult.name,
      description: sqlResult.description ?? undefined,
      decontaminatedSoilSurface: sqlResult.friche_decontaminated_soil_surface_area ?? undefined,
      operationsFirstYear: sqlResult.operations_first_year ?? undefined,
      futureSiteOwner: sqlResult.future_site_owner_name
        ? {
            name: sqlResult.future_site_owner_name,
            structureType: sqlResult.future_site_owner_structure_type ?? "",
          }
        : undefined,
      futureOperator: sqlResult.future_operator_name
        ? {
            name: sqlResult.future_operator_name,
            structureType: sqlResult.future_operator_structure_type ?? "",
          }
        : undefined,
      developmentPlan: getDevelopmentPlan(),
      soilsDistribution: (sqlResult.soils_distribution ?? []).map(
        ({ soil_type, surface_area, space_category }) => ({
          soilType: soil_type as SoilType,
          surfaceArea: surface_area,
          spaceCategory: (space_category as SpaceCategory) ?? undefined,
        }),
      ),
      // costs and revenues
      yearlyProjectedCosts: sqlResult.yearly_projected_expenses ?? [],
      yearlyProjectedRevenues: sqlResult.yearly_projected_revenues ?? [],
      reinstatementContractOwner: sqlResult.reinstatement_contract_owner_name
        ? {
            name: sqlResult.reinstatement_contract_owner_name,
            structureType: sqlResult.reinstatement_contract_owner_structure_type ?? "",
          }
        : undefined,
      financialAssistanceRevenues: sqlResult.financial_assistance_revenues ?? [],
      reinstatementCosts: sqlResult.reinstatement_costs ?? [],
      reinstatementSchedule: mapSqlSchedule(
        sqlResult.reinstatement_schedule_start_date,
        sqlResult.reinstatement_schedule_end_date,
      ),
      // site purchase
      sitePurchaseSellingPrice: sqlResult.site_purchase_selling_price ?? undefined,
      sitePurchasePropertyTransferDuties:
        sqlResult.site_purchase_property_transfer_duties ?? undefined,
      // site resale
      siteResaleExpectedSellingPrice: sqlResult.site_resale_expected_selling_price ?? undefined,
      siteResaleExpectedPropertyTransferDuties:
        sqlResult.site_resale_expected_property_transfer_duties ?? undefined,
      // buildings resale
      buildingsResaleExpectedSellingPrice:
        sqlResult.buildings_resale_expected_selling_price ?? undefined,
      buildingsResaleExpectedPropertyTransferDuties:
        sqlResult.buildings_resale_expected_property_transfer_duties ?? undefined,
      relatedSiteId: sqlResult.related_site_id,
      projectPhase: sqlResult.project_phase,
      createdBy: sqlResult.created_by,
      creationMode: sqlResult.creation_mode,
      createdAt: sqlResult.created_at,
      updatedAt: sqlResult.updated_at ?? undefined,
    };
  }

  async update(reconversionProject: ReconversionProjectUpdateDto): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      await trx("reconversion_projects").where({ id: reconversionProject.id }).update({
        updated_at: reconversionProject.updatedAt,
        name: reconversionProject.name,
        description: reconversionProject.description,
        future_operator_name: reconversionProject.futureOperator?.name,
        future_operator_structure_type: reconversionProject.futureOperator?.structureType,
        future_site_owner_name: reconversionProject.futureSiteOwner?.name,
        future_site_owner_structure_type: reconversionProject.futureSiteOwner?.structureType,
        reinstatement_contract_owner_name: reconversionProject.reinstatementContractOwner?.name,
        reinstatement_contract_owner_structure_type:
          reconversionProject.reinstatementContractOwner?.structureType,
        site_purchase_selling_price: reconversionProject.sitePurchaseSellingPrice,
        site_purchase_property_transfer_duties:
          reconversionProject.sitePurchasePropertyTransferDuties,
        reinstatement_schedule_start_date: reconversionProject.reinstatementSchedule?.startDate,
        reinstatement_schedule_end_date: reconversionProject.reinstatementSchedule?.endDate,
        operations_first_year: reconversionProject.operationsFirstYear,
        project_phase: reconversionProject.projectPhase,
        site_resale_expected_selling_price: reconversionProject.siteResaleExpectedSellingPrice,
        site_resale_expected_property_transfer_duties:
          reconversionProject.siteResaleExpectedPropertyTransferDuties,
        buildings_resale_expected_selling_price:
          reconversionProject.buildingsResaleExpectedSellingPrice,
        buildings_resale_expected_property_transfer_duties:
          reconversionProject.buildingsResaleExpectedPropertyTransferDuties,
        friche_decontaminated_soil_surface_area: reconversionProject.decontaminatedSoilSurface,
      });

      // Delete and recreate soils distribution
      await trx("reconversion_project_soils_distributions")
        .where({ reconversion_project_id: reconversionProject.id })
        .delete();

      const soilsDistributionToInsert: SqlReconversionProjectSoilsDistribution[] =
        reconversionProject.soilsDistribution.map(({ soilType, surfaceArea, spaceCategory }) => ({
          id: uuid(),
          soil_type: soilType,
          surface_area: surfaceArea,
          space_category: spaceCategory,
          reconversion_project_id: reconversionProject.id,
        }));
      await trx("reconversion_project_soils_distributions").insert(soilsDistributionToInsert);

      // Update development plan
      await trx("reconversion_project_development_plans")
        .where({ reconversion_project_id: reconversionProject.id })
        .update({
          type: reconversionProject.developmentPlan.type,
          developer_name: reconversionProject.developmentPlan.developer.name,
          developer_structure_type: reconversionProject.developmentPlan.developer.structureType,
          features: reconversionProject.developmentPlan.features,
          schedule_start_date:
            reconversionProject.developmentPlan.installationSchedule?.startDate ?? null,
          schedule_end_date:
            reconversionProject.developmentPlan.installationSchedule?.endDate ?? null,
        });

      // Get development plan id for costs update
      const developmentPlan = await trx("reconversion_project_development_plans")
        .select("id")
        .where({ reconversion_project_id: reconversionProject.id })
        .first();

      if (developmentPlan) {
        // Delete and recreate development plan costs
        await trx("reconversion_project_development_plan_costs")
          .where({ development_plan_id: developmentPlan.id })
          .delete();

        if (reconversionProject.developmentPlan.costs.length > 0) {
          const costsToInsert: SqlDevelopmentPlanCost[] =
            reconversionProject.developmentPlan.costs.map(({ amount, purpose }) => ({
              id: uuid(),
              amount,
              purpose,
              development_plan_id: developmentPlan.id,
            }));
          await trx("reconversion_project_development_plan_costs").insert(costsToInsert);
        }
      }

      // Delete and recreate yearly expenses
      await trx("reconversion_project_yearly_expenses")
        .where({ reconversion_project_id: reconversionProject.id })
        .delete();

      if (reconversionProject.yearlyProjectedCosts.length > 0) {
        const yearlyExpensesToInsert: SqlReconversionProjectExpense[] =
          reconversionProject.yearlyProjectedCosts.map(({ amount, purpose }) => ({
            id: uuid(),
            amount,
            purpose,
            reconversion_project_id: reconversionProject.id,
          }));
        await trx("reconversion_project_yearly_expenses").insert(yearlyExpensesToInsert);
      }

      // Delete and recreate yearly revenues
      await trx("reconversion_project_yearly_revenues")
        .where({ reconversion_project_id: reconversionProject.id })
        .delete();

      if (reconversionProject.yearlyProjectedRevenues.length > 0) {
        const yearlyRevenuesToInsert: SqlRevenue[] = mapRevenuesToSqlStruct(
          reconversionProject.yearlyProjectedRevenues,
          reconversionProject.id,
        );
        await trx("reconversion_project_yearly_revenues").insert(yearlyRevenuesToInsert);
      }

      // Delete and recreate reinstatement costs
      await trx("reconversion_project_reinstatement_costs")
        .where({ reconversion_project_id: reconversionProject.id })
        .delete();

      if (
        reconversionProject.reinstatementCosts &&
        reconversionProject.reinstatementCosts.length > 0
      ) {
        const reinstatementCostsToInsert: SqlReinstatementCost[] =
          reconversionProject.reinstatementCosts.map(({ amount, purpose }) => ({
            id: uuid(),
            amount,
            purpose,
            reconversion_project_id: reconversionProject.id,
          }));
        await trx("reconversion_project_reinstatement_costs").insert(reinstatementCostsToInsert);
      }

      // Delete and recreate financial assistance revenues
      await trx("reconversion_project_financial_assistance_revenues")
        .where({ reconversion_project_id: reconversionProject.id })
        .delete();

      if (reconversionProject.financialAssistanceRevenues?.length) {
        const financialAssistanceRevenuesToInsert: SqlRevenue[] = mapRevenuesToSqlStruct(
          reconversionProject.financialAssistanceRevenues,
          reconversionProject.id,
        );
        await trx("reconversion_project_financial_assistance_revenues").insert(
          financialAssistanceRevenuesToInsert,
        );
      }
    });
  }

  async patch(
    reconversionProjectId: string,
    { status, updatedAt }: { status: "active" | "archived"; updatedAt: Date },
  ): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      await trx("reconversion_projects").where({ id: reconversionProjectId }).update({
        status,
        updated_at: updatedAt,
      });
    });
  }
}
