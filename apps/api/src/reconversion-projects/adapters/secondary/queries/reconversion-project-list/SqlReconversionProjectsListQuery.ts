import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { SiteNature, ReconversionProjectCreationMode } from "shared";

import { DevelopmentPlan } from "src/reconversion-projects/core/model/reconversionProject";
import {
  ReconversionProjectsGroupedBySite,
  ReconversionProjectsListQuery,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlSite } from "src/shared-kernel/adapters/sql-knex/tableTypes";

export class SqlReconversionProjectsListQuery implements ReconversionProjectsListQuery {
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
        "sites.nature as siteNature",
        "sites.creation_mode as creationMode",
        "sites.friche_activity as fricheActivity",
        this.sqlConnection.raw(`
        CASE 
          WHEN count(rp.id) = 0 THEN '[]'::json
          ELSE json_agg(
            json_build_object('id', rp.id, 'name', rp.name, 'type', rpdp.type, 'creationMode', rp.creation_mode, 'createdAt', rp.created_at)
            order by rp.created_at 
          ) 
        END as "reconversionProjects"`),
      )
      .groupBy("sites.id")
      .orderBy("sites.created_at", "desc")) as {
      siteId: string;
      siteName: string;
      siteNature: SiteNature;
      creationMode: SqlSite["creation_mode"];
      fricheActivity: string | null;
      reconversionProjects: {
        id: string;
        name: string;
        type: DevelopmentPlan["type"];
        creationMode: ReconversionProjectCreationMode;
      }[];
    }[];

    // oxlint-disable-next-line no-map-spread
    return result.map(({ creationMode, ...reconversionProjectsBySite }) => {
      return {
        ...reconversionProjectsBySite,
        isExpressSite: creationMode === "express",
        reconversionProjects: reconversionProjectsBySite.reconversionProjects.map((rp) => ({
          id: rp.id,
          name: rp.name,
          type: rp.type,
          isExpressProject: rp.creationMode === "express",
        })),
        fricheActivity: reconversionProjectsBySite.fricheActivity ?? undefined,
      };
    });
  }
}
