import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { AdminImpactsExportersQuery } from "src/admin/core/gateways/AdminImpactsExportersQuery";
import type { AdminImpactsExporterListItem } from "src/admin/core/models/adminImpactsExporterReadModel";
import { RECONVERSION_PROJECT_IMPACTS_EXPORTED } from "src/reconversion-projects/core/events/reconversionProjectImpactsExported.event";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { whereAdminUserMatchesSearch } from "./adminUserSearch";

type ImpactsExporterRow = {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  structure_name: string | null;
  impacts_exports_count: number;
  exported_projects_count: number;
  last_impacts_exported_at: Date;
};

@Injectable()
export class SqlAdminImpactsExportersQuery implements AdminImpactsExportersQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async list({
    search,
    page,
    pageSize,
  }: {
    search?: string;
    page: number;
    pageSize: number;
  }): Promise<{ users: AdminImpactsExporterListItem[]; total: number }> {
    const exportsByUser = this.sqlConnection("domain_events")
      .select(
        this.sqlConnection.raw("payload->>'userId' AS user_id"),
        this.sqlConnection.raw("COUNT(*)::int AS impacts_exports_count"),
        this.sqlConnection.raw(
          "COUNT(DISTINCT payload->>'reconversionProjectId')::int AS exported_projects_count",
        ),
        this.sqlConnection.raw("MAX(created_at) AS last_impacts_exported_at"),
      )
      .where("name", RECONVERSION_PROJECT_IMPACTS_EXPORTED)
      .groupByRaw("payload->>'userId'")
      .as("exports");

    // Inner join: users without exports, and exports of deleted accounts, are left out.
    const exportersQuery = (): Knex.QueryBuilder =>
      whereAdminUserMatchesSearch(
        this.sqlConnection("users")
          .join(exportsByUser, (join) => {
            join.on(this.sqlConnection.raw("exports.user_id = users.id::text"));
          })
          .whereNotExists((builder) => {
            void builder
              .select(this.sqlConnection.raw("1"))
              .from("administrators")
              .whereRaw("administrators.user_id = users.id");
          }),
        search,
      );

    const [countRow, rows] = await Promise.all([
      exportersQuery().count<{ count: string | number }[]>("* as count"),
      exportersQuery()
        .select(
          "users.id",
          "users.email",
          "users.firstname",
          "users.lastname",
          "users.structure_name",
          "exports.impacts_exports_count",
          "exports.exported_projects_count",
          "exports.last_impacts_exported_at",
        )
        .orderBy("exports.last_impacts_exported_at", "desc")
        // Tiebreaker so users sharing a last export date keep a stable order across pages.
        .orderBy("users.id", "desc")
        .limit(pageSize)
        .offset((page - 1) * pageSize) as Promise<ImpactsExporterRow[]>,
    ]);

    return {
      users: rows.map((row) => ({
        id: row.id,
        email: row.email,
        firstName: row.firstname,
        lastName: row.lastname,
        structureName: row.structure_name,
        impactsExportsCount: row.impacts_exports_count,
        exportedProjectsCount: row.exported_projects_count,
        lastImpactsExportedAt: row.last_impacts_exported_at,
      })),
      total: Number(countRow[0]?.count ?? 0),
    };
  }
}
