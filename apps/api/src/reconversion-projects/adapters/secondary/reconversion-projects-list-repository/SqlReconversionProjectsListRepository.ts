import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { DevelopmentPlan } from "src/reconversion-projects/core/model/reconversionProject";
import {
  ReconversionProjectsGroupedBySite,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

export class SqlReconversionProjectsListRepository implements ReconversionProjectsListRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}
  async getGroupedBySite({
    userId,
  }: {
    userId: string;
  }): Promise<ReconversionProjectsGroupedBySite> {
    const result = (await this.sqlConnection("sites")
      .where("sites.created_by", userId)
      .leftJoin("reconversion_projects as rp", "sites.id", "=", "rp.related_site_id")
      .leftJoin(
        "reconversion_project_development_plans as rpdp",
        "rp.id",
        "=",
        "rpdp.reconversion_project_id",
      )
      .select(
        "sites.id as siteId",
        "sites.name as siteName",
        "sites.is_friche as isFriche",
        "sites.friche_activity as fricheActivity",
        this.sqlConnection.raw(`
        CASE 
          WHEN count(rp.id) = 0 THEN '[]'::json
          ELSE json_agg(json_build_object('id', rp.id, 'name', rp.name, 'type', rpdp.type)) 
        END as "reconversionProjects"`),
      )
      .groupBy("sites.id")
      .orderBy("sites.created_at", "desc")) as {
      siteId: string;
      siteName: string;
      isFriche: boolean;
      fricheActivity: string | null;
      reconversionProjects: { id: string; name: string; type: DevelopmentPlan["type"] }[];
    }[];

    return result.map((reconversionProjectsBySite) => {
      return {
        ...reconversionProjectsBySite,
        fricheActivity: reconversionProjectsBySite.fricheActivity ?? undefined,
      };
    });
  }
}
