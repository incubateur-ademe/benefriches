import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  SiteEvaluationDataView,
  SiteEvaluationQuery,
} from "src/site-evaluations/core/gateways/SiteEvaluationQuery";

export class SqlSiteEvaluationQuery implements SiteEvaluationQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}
  async getUserSiteEvaluations(userId: string): Promise<SiteEvaluationDataView[]> {
    const result = await this.sqlConnection("sites")
      .where("sites.created_by", userId)
      .leftJoin(
        "reconversion_compatibility_evaluations as rce",
        "sites.id",
        "=",
        "rce.related_site_id",
      )
      .select(
        "sites.id as siteId",
        "sites.name as siteName",
        "sites.nature as siteNature",
        this.sqlConnection.raw(
          `COALESCE(sites.creation_mode = 'express', false) as "isExpressSite"`,
        ),
        this.sqlConnection.raw(`
      (
        SELECT json_build_object(
          'total', COUNT(*)::int,
          'lastProjects', COALESCE(
            (
              SELECT json_agg(sub.project_data)
              FROM (
                SELECT json_build_object(
                  'id', rp3.id, 
                  'name', rp3.name, 
                  'projectType', rpdp3.type, 
                  'isExpressProject', rp3.creation_mode = 'express' 
                ) as project_data
                FROM reconversion_projects as rp3
                LEFT JOIN reconversion_project_development_plans as rpdp3 
                  ON rp3.id = rpdp3.reconversion_project_id
                WHERE rp3.related_site_id = sites.id
                ORDER BY rp3.created_at DESC
                LIMIT 2
              ) as sub
            ),
            '[]'::json
          )
        )
        FROM reconversion_projects as rp2
        WHERE rp2.related_site_id = sites.id
      ) as "reconversionProjects"
    `),
        this.sqlConnection.raw(`
      (
        SELECT json_build_object(
          'id', rce2.id,
          'mutafrichesEvaluationId', rce2.mutafriches_evaluation_id
        )
        FROM reconversion_compatibility_evaluations as rce2
        WHERE rce2.related_site_id = sites.id
        ORDER BY rce2.created_at DESC
        LIMIT 1
      ) as "compatibilityEvaluation"
    `),
      )
      .groupBy("sites.id")
      .orderBy("sites.created_at", "desc");

    return result.map(({ compatibilityEvaluation, ...row }: SiteEvaluationDataView) =>
      compatibilityEvaluation ? Object.assign(row, { compatibilityEvaluation }) : row,
    );
  }
}
