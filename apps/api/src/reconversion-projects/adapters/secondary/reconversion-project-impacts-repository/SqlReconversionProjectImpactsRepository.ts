import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { DevelopmentPlan } from "src/reconversion-projects/domain/model/reconversionProject";
import {
  ReconversionProjectImpactsDataView,
  ReconversionProjectImpactsRepository,
} from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SoilType } from "src/soils/domain/soils";

export class SqlReconversionProjectImpactsRepository
  implements ReconversionProjectImpactsRepository
{
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(
    reconversionProjectId: string,
  ): Promise<ReconversionProjectImpactsDataView | undefined> {
    const reconversionProject = await this.sqlConnection("reconversion_projects")
      .select(
        "id",
        "name",
        "related_site_id",
        "conversion_full_time_jobs_involved",
        "future_operations_full_time_jobs",
        "reinstatement_full_time_jobs_involved",
        "reinstatement_schedule_start_date",
        "reinstatement_schedule_end_date",
      )
      .where({ id: reconversionProjectId })
      .first();

    if (!reconversionProject) return undefined;

    const sqlSoilDistributions = await this.sqlConnection(
      "reconversion_project_soils_distributions",
    )
      .select("soil_type", "surface_area")
      .where("reconversion_project_id", reconversionProjectId);

    const sqlDevelopmentPlan = await this.sqlConnection("reconversion_project_development_plans")
      .select("schedule_start_date", "schedule_end_date", "features")
      .first();
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

    const developmentPlanExpectedAnnualEnergyProductionMWh = sqlDevelopmentPlan?.features
      ? (sqlDevelopmentPlan.features as DevelopmentPlan["features"]).expectedAnnualProduction
      : undefined;

    return {
      id: reconversionProject.id,
      name: reconversionProject.name,
      relatedSiteId: reconversionProject.related_site_id,
      soilsDistribution: sqlSoilDistributions.reduce((acc, { soil_type, surface_area }) => {
        return {
          ...acc,
          [soil_type as SoilType]: surface_area,
        };
      }, {}),
      conversionFullTimeJobs: reconversionProject.conversion_full_time_jobs_involved ?? undefined,
      conversionSchedule,
      operationsFullTimeJobs: reconversionProject.future_operations_full_time_jobs ?? undefined,
      reinstatementFullTimeJobs:
        reconversionProject.reinstatement_full_time_jobs_involved ?? undefined,
      reinstatementSchedule,
      developmentPlanExpectedAnnualEnergyProductionMWh,
    };
  }
}
