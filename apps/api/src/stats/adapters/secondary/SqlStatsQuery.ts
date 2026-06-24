import { Inject } from "@nestjs/common";
import type { Knex } from "knex";
import type {
  AgriculturalOperationActivity,
  BuildingsConstructionExpense,
  DevelopmentPlanInstallationExpenses,
  FinancialAssistanceRevenue,
  FricheActivity,
  NaturalAreaType,
  RecurringExpense,
  RecurringRevenue,
  ReinstatementExpense,
  SiteNature,
  SiteYearlyExpense,
  SiteYearlyIncome,
} from "shared";
import { convertHectaresToSquareMeters } from "shared";

import type { DevelopmentPlan } from "src/reconversion-projects/core/model/reconversionProject";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type {
  SqlAddress,
  SqlReconversionProject,
  SqlSite,
} from "src/shared-kernel/adapters/sql-knex/tableTypes";
import type { EvaluatedProjectsImpactsStatsResult } from "src/stats/core/usecases/computeEvaluatedProjectStats.usecase";

type CoreRow = Pick<
  SqlReconversionProject,
  | "related_site_id"
  | "reinstatement_schedule_start_date"
  | "reinstatement_schedule_end_date"
  | "future_operator_name"
  | "future_operator_structure_type"
  | "future_site_owner_name"
  | "future_site_owner_structure_type"
  | "reinstatement_contract_owner_name"
  | "reinstatement_contract_owner_structure_type"
  | "site_purchase_selling_price"
  | "site_purchase_property_transfer_duties"
  | "operations_first_year"
  | "site_resale_expected_selling_price"
  | "site_resale_expected_property_transfer_duties"
  | "buildings_resale_expected_property_transfer_duties"
  | "buildings_resale_expected_selling_price"
  | "friche_decontaminated_soil_surface_area"
> & { rp_id: SqlReconversionProject["id"] } & {
  rp_creation_mode: SqlReconversionProject["creation_mode"];
} & Pick<
    SqlSite,
    | "friche_activity"
    | "agricultural_operation_activity"
    | "natural_area_type"
    | "is_operated"
    | "surface_area"
    | "friche_contaminated_soil_surface_area"
    | "friche_accidents_minor_injuries"
    | "friche_accidents_severe_injuries"
    | "friche_accidents_deaths"
    | "owner_name"
    | "owner_structure_type"
    | "tenant_name"
    | "tenant_structure_type"
  > & { s_id: SqlSite["id"] } & { s_nature: SqlSite["nature"] } & {
    s_creation_mode: SqlSite["creation_mode"];
  } & { site_city_code: SqlAddress["city_code"] | null }; // address columns (nullable since LEFT JOIN)

const sumIfNotNullish = (
  a: number | null | undefined,
  b: number | null | undefined,
): number | undefined => {
  if (a == null) return undefined;
  return b ? a + b : a;
};

const toOptionalActor = (
  name: string | null | undefined,
  structureType: string | null | undefined,
): { name: string; structureType: string } | undefined => {
  if (!name) return undefined;
  return { name, structureType: structureType ?? "" };
};

const groupBy = <T>(arr: T[], key: (item: T) => string): Map<string, T[]> =>
  arr.reduce((map, item) => {
    const k = key(item);
    return map.set(k, [...(map.get(k) ?? []), item]);
  }, new Map<string, T[]>());

const toCityStats = (
  row:
    | { da_name: string; da_population: number; da_surface_ha?: number; dvf_pxm2_median?: number }
    | undefined,
): EvaluatedProjectsImpactsStatsResult["relatedSite"]["cityStats"] | undefined => {
  if (!row) {
    return undefined;
  }
  const population = row.da_population;
  return {
    surfaceAreaSquareMeters: row.da_surface_ha
      ? convertHectaresToSquareMeters(row.da_surface_ha)
      : undefined,
    population,
    propertyValueMedianPricePerSquareMeters:
      row.dvf_pxm2_median && row.dvf_pxm2_median !== 0 ? row.dvf_pxm2_median : undefined,
  };
};

export class SqlReconversionProjectAndSiteImpactsQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getManyByReconversionProjectIds(
    reconversionProjectIds: string[],
  ): Promise<EvaluatedProjectsImpactsStatsResult[]> {
    if (reconversionProjectIds.length === 0) return [];

    const cores = await this.sqlConnection("reconversion_projects as rp")
      .join("sites as s", "s.id", "rp.related_site_id")
      .leftJoin("addresses as a", "a.site_id", "s.id")
      .select<CoreRow[]>(
        // project
        "rp.id as rp_id",
        "rp.creation_mode as rp_creation_mode",
        "rp.related_site_id",
        "rp.reinstatement_schedule_start_date",
        "rp.reinstatement_schedule_end_date",
        "rp.future_operator_name",
        "rp.future_operator_structure_type",
        "rp.future_site_owner_name",
        "rp.future_site_owner_structure_type",
        "rp.reinstatement_contract_owner_structure_type",
        "rp.reinstatement_contract_owner_name",
        "rp.site_purchase_selling_price",
        "rp.site_purchase_property_transfer_duties",

        "rp.operations_first_year",
        "rp.site_resale_expected_selling_price",
        "rp.buildings_resale_expected_selling_price",
        "rp.site_resale_expected_property_transfer_duties",
        "rp.buildings_resale_expected_property_transfer_duties",

        "rp.friche_decontaminated_soil_surface_area",

        // site
        "s.id as s_id",
        "s.nature as s_nature",
        "s.creation_mode as s_creation_mode",
        "s.friche_activity",
        "s.agricultural_operation_activity",
        "s.natural_area_type",
        "s.is_operated",
        "s.surface_area",
        "s.friche_contaminated_soil_surface_area",
        "s.friche_accidents_minor_injuries",
        "s.friche_accidents_severe_injuries",
        "s.friche_accidents_deaths",
        "s.owner_name",
        "s.owner_structure_type",
        "s.tenant_name",
        "s.tenant_structure_type",
        // address
        "a.city_code as site_city_code",
      )
      .whereIn("rp.id", reconversionProjectIds);

    if (cores.length === 0) return [];

    const siteIds = cores.map((c) => c.related_site_id);
    const uniqueCityCodes = [
      ...new Set(cores.map((c) => c.site_city_code).filter(Boolean)),
    ] as string[];

    const [
      projectSoilDistributions,
      projectExpenses,
      projectRevenues,
      projectReinstatementCosts,
      projectFinancialAssistanceRevenues,
      developmentPlanRows,
      siteSoilDistributions,
      siteExpenses,
      siteIncomes,
      cityStatsRows,
    ] = await Promise.all([
      this.sqlConnection("reconversion_project_soils_distributions")
        .select("reconversion_project_id", "soil_type", "surface_area", "space_category")
        .whereIn("reconversion_project_id", reconversionProjectIds),

      this.sqlConnection("reconversion_project_yearly_expenses")
        .select("reconversion_project_id", "amount", "purpose")
        .whereIn("reconversion_project_id", reconversionProjectIds),

      this.sqlConnection("reconversion_project_yearly_revenues")
        .select("reconversion_project_id", "amount", "source")
        .whereIn("reconversion_project_id", reconversionProjectIds),

      this.sqlConnection("reconversion_project_reinstatement_costs")
        .select("reconversion_project_id", "amount", "purpose")
        .whereIn("reconversion_project_id", reconversionProjectIds),

      this.sqlConnection("reconversion_project_financial_assistance_revenues")
        .select("reconversion_project_id", "amount", "source")
        .whereIn("reconversion_project_id", reconversionProjectIds),

      this.sqlConnection("reconversion_project_development_plans as dp")
        .whereIn("dp.reconversion_project_id", reconversionProjectIds)
        .leftJoin(
          "reconversion_project_development_plan_costs as cost",
          "dp.id",
          "cost.development_plan_id",
        )
        .leftJoin(
          "reconversion_project_buildings_construction_costs as building_cost",
          "dp.id",
          "building_cost.development_plan_id",
        )
        .select<
          {
            id: string;
            reconversion_project_id: string;
            developer_structure_type: string | null;
            developer_name: string | null;
            type: DevelopmentPlan["type"];
            schedule_start_date: Date | null;
            schedule_end_date: Date | null;
            features: DevelopmentPlan["features"] | null;
            costs: { amount: number; purpose: string }[];
            building_costs: { amount: number; purpose: string }[];
          }[]
        >(
          "dp.reconversion_project_id",
          "dp.id",
          "dp.type",
          "dp.features",
          "dp.developer_name",
          "dp.developer_structure_type",
          "dp.schedule_start_date",
          "dp.schedule_end_date",
          this.sqlConnection.raw(`
            CASE
              WHEN count(cost.id) = 0 THEN '[]'::json
              ELSE json_agg(json_build_object('amount', cost.amount, 'purpose', cost.purpose))
            END as "costs"
          `),
          this.sqlConnection.raw(`
            CASE
              WHEN count(building_cost.id) = 0 THEN '[]'::json
              ELSE json_agg(json_build_object('amount', building_cost.amount, 'purpose', building_cost.purpose))
            END as "building_costs"
          `),
        )
        .groupBy("dp.id"),

      this.sqlConnection("site_soils_distributions")
        .select("site_id", "soil_type", "surface_area")
        .whereIn("site_id", siteIds),

      this.sqlConnection("site_expenses")
        .select("site_id", "amount", "purpose", "bearer")
        .whereIn("site_id", siteIds),

      this.sqlConnection("site_incomes")
        .select("site_id", "amount", "source")
        .whereIn("site_id", siteIds),

      this.sqlConnection("city_stats")
        .select("city_code", "da_name", "da_population", "da_surface_ha", "dvf_pxm2_median")
        .whereIn("city_code", uniqueCityCodes),
    ]);

    const dpByProjectId = groupBy(developmentPlanRows, (r) => r.reconversion_project_id);
    const soilsByProjectId = groupBy(projectSoilDistributions, (r) => r.reconversion_project_id);
    const expensesByProjectId = groupBy(projectExpenses, (r) => r.reconversion_project_id);
    const revenuesByProjectId = groupBy(projectRevenues, (r) => r.reconversion_project_id);
    const reinstatementCostsByProjectId = groupBy(
      projectReinstatementCosts,
      (r) => r.reconversion_project_id,
    );
    const financialAssistanceByProjectId = groupBy(
      projectFinancialAssistanceRevenues,
      (r) => r.reconversion_project_id,
    );
    const siteSoilsBySiteId = groupBy(siteSoilDistributions, (r) => r.site_id);
    const siteExpensesBySiteId = groupBy(siteExpenses, (r) => r.site_id);
    const siteIncomesBySiteId = groupBy(siteIncomes, (r) => r.site_id);

    const cityStatsByCityCode = groupBy(cityStatsRows, (r) => r.city_code);

    return cores.map((core) => {
      const rpId = core.rp_id;
      const siteId = core.related_site_id;

      const dp = dpByProjectId.get(rpId)?.[0];

      const sitePurchaseTotalAmount = sumIfNotNullish(
        core.site_purchase_selling_price,
        core.site_purchase_property_transfer_duties,
      );

      const accidents =
        core.friche_accidents_deaths != null ||
        core.friche_accidents_severe_injuries != null ||
        core.friche_accidents_minor_injuries != null
          ? {
              deaths: core.friche_accidents_deaths ?? undefined,
              severeInjuries: core.friche_accidents_severe_injuries ?? undefined,
              minorInjuries: core.friche_accidents_minor_injuries ?? undefined,
            }
          : undefined;

      return {
        id: rpId,
        isExpressProject: core.rp_creation_mode === "express",

        stakeholders: {
          siteOwner: {
            name: core.owner_name ?? "",
            structureType: core.owner_structure_type,
          },
          siteTenant: core.tenant_structure_type
            ? { name: core.tenant_name ?? undefined, structureType: core.tenant_structure_type }
            : undefined,
          futureOperator: toOptionalActor(
            core.future_operator_name,
            core.future_operator_structure_type,
          ),
          futureSiteOwner: core.future_site_owner_structure_type
            ? {
                name: core.future_site_owner_name ?? undefined,
                structureType: core.future_site_owner_structure_type,
              }
            : undefined,
          reinstatementContractOwner: core.reinstatement_contract_owner_structure_type
            ? {
                name: core.reinstatement_contract_owner_name ?? undefined,
                structureType: core.reinstatement_contract_owner_structure_type,
              }
            : undefined,
          developer: {
            name: dp?.developer_name ?? "",
            structureType: dp?.developer_structure_type ?? "company",
          },
        },

        projectDevelopment: {
          expenses: {
            reinstatement: (reinstatementCostsByProjectId.get(rpId) ??
              []) as ReinstatementExpense[],
            installationCosts: (dp?.costs ?? []) as DevelopmentPlanInstallationExpenses[],
            buildingConstructionCosts: (dp?.building_costs ?? []) as BuildingsConstructionExpense[],
            sitePurchase:
              sitePurchaseTotalAmount != null
                ? {
                    totalAmount: sitePurchaseTotalAmount,
                    propertyTransferDutiesAmount:
                      core.site_purchase_property_transfer_duties ?? undefined,
                  }
                : undefined,
            recurringYearly: (expensesByProjectId.get(rpId) ?? []) as RecurringExpense[],
          },
          revenues: {
            recurringYearly: (revenuesByProjectId.get(rpId) ?? []) as RecurringRevenue[],
            siteResaleSellingPrice: core.site_resale_expected_selling_price ?? undefined,
            siteResaleExpectedPropertyTransferDutiesAmount:
              core.site_resale_expected_property_transfer_duties ?? undefined,
            buildingsResaleExpectedPropertyTransferDutiesAmount:
              core.buildings_resale_expected_property_transfer_duties ?? undefined,
            buildingsResaleSellingPrice: core.buildings_resale_expected_selling_price ?? undefined,
            financialAssistanceRevenues: (financialAssistanceByProjectId.get(rpId) ??
              []) as FinancialAssistanceRevenue[],
          },
          schedules: {
            reinstatement:
              core.reinstatement_schedule_start_date && core.reinstatement_schedule_end_date
                ? {
                    startDate: core.reinstatement_schedule_start_date,
                    endDate: core.reinstatement_schedule_end_date,
                  }
                : undefined,
            installation:
              dp?.schedule_start_date && dp.schedule_end_date
                ? {
                    startDate: dp.schedule_start_date,
                    endDate: dp.schedule_end_date,
                  }
                : undefined,
          },
          developmentPlan: dp
            ? {
                type: dp.type,
                features:
                  Object.keys(dp.features ?? {}).length > 0
                    ? (dp.features ?? undefined)
                    : undefined,
              }
            : undefined,
          projectedSoilsDistribution: (soilsByProjectId.get(rpId) ?? []).map((sd) => ({
            soilType: sd.soil_type,
            surfaceArea: sd.surface_area,
            spaceCategory: sd.space_category ?? undefined,
          })),
          operationsFirstYear: core.operations_first_year ?? undefined,
          decontaminatedSoilSurface: core.friche_decontaminated_soil_surface_area ?? undefined,
        },

        relatedSite: {
          id: core.s_id,
          nature: core.s_nature as SiteNature,
          fricheActivity: (core.friche_activity ?? undefined) as FricheActivity,
          agriculturalOperationActivity: (core.agricultural_operation_activity ??
            undefined) as AgriculturalOperationActivity,
          naturalAreaType: (core.natural_area_type ?? undefined) as NaturalAreaType,
          isSiteOperated: core.is_operated ?? undefined,
          isExpressSite: core.s_creation_mode === "express",
          siteCityCode: core.site_city_code ?? undefined,
          surfaceArea: core.surface_area,
          contaminatedSoilSurface: core.friche_contaminated_soil_surface_area ?? undefined,
          accidents,
          currentSoilsDistribution: (siteSoilsBySiteId.get(siteId) ?? []).reduce<
            Record<string, number>
          >((acc, { soil_type, surface_area }) => ({ ...acc, [soil_type]: surface_area }), {}),
          currentYearlyExpenses: (siteExpensesBySiteId.get(siteId) ?? []) as SiteYearlyExpense[],
          currentYearlyIncomes: (siteIncomesBySiteId.get(siteId) ?? []) as SiteYearlyIncome[],
          cityStats: core.site_city_code
            ? toCityStats(cityStatsByCityCode.get(core.site_city_code)?.[0])
            : undefined,
        },
      } satisfies EvaluatedProjectsImpactsStatsResult;
    });
  }
}
