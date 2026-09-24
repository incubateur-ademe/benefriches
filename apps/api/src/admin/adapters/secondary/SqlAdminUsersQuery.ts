import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type {
  AdminUserActivityRecord,
  AdminUserListItem,
  AdminUsersQuery,
} from "src/admin/core/gateways/AdminUsersQuery";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

type UserListRow = {
  id: string;
  email: string;
  firstname: string | null;
  lastname: string | null;
  structure_name: string | null;
  structure_type: string;
  structure_activity: string;
  created_at: Date;
  last_login_at: Date | null;
};

@Injectable()
export class SqlAdminUsersQuery implements AdminUsersQuery {
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
  }): Promise<{ users: AdminUserListItem[]; total: number }> {
    const applySearch = (qb: Knex.QueryBuilder): Knex.QueryBuilder => {
      if (!search) return qb;
      const pattern = `%${search}%`;
      return qb.where((builder) => {
        builder
          .whereILike("users.email", pattern)
          .orWhereILike("users.firstname", pattern)
          .orWhereILike("users.lastname", pattern)
          .orWhereILike("users.structure_name", pattern);
      });
    };

    const [countRow, rows] = await Promise.all([
      applySearch(this.sqlConnection("users")).count<{ count: string | number }[]>("* as count"),
      applySearch(
        this.sqlConnection("users").select(
          "users.id",
          "users.email",
          "users.firstname",
          "users.lastname",
          "users.structure_name",
          "users.structure_type",
          "users.structure_activity",
          "users.created_at",
          this.sqlConnection.raw(
            `(SELECT MAX(created_at) FROM domain_events
              WHERE name = ? AND payload->>'userId' = users.id::text) AS last_login_at`,
            [LOGIN_SUCCEEDED],
          ),
        ),
      )
        .orderBy("users.created_at", "desc")
        .limit(pageSize)
        .offset((page - 1) * pageSize) as Promise<UserListRow[]>,
    ]);

    return {
      users: rows.map((row) => ({
        id: row.id,
        email: row.email,
        firstName: row.firstname,
        lastName: row.lastname,
        structureName: row.structure_name,
        structureType: row.structure_type,
        structureActivity: row.structure_activity,
        createdAt: row.created_at,
        lastLoginAt: row.last_login_at,
      })),
      total: Number(countRow[0]?.count ?? 0),
    };
  }

  async getUserActivity(userId: string): Promise<AdminUserActivityRecord | undefined> {
    const user = await this.sqlConnection("users")
      .select(
        "id",
        "email",
        "firstname",
        "lastname",
        "structure_name",
        "structure_type",
        "structure_activity",
        "subscribed_to_newsletter",
        "created_at",
      )
      .where("id", userId)
      .first();

    if (!user) return undefined;

    const [loginRows, siteRows, projectRows, evaluationRows] = await Promise.all([
      this.sqlConnection("domain_events")
        .select("created_at")
        .where("name", LOGIN_SUCCEEDED)
        .whereRaw("payload->>'userId' = ?", [userId])
        .orderBy("created_at", "asc"),
      this.sqlConnection("sites")
        .select("id", "name", "nature", "creation_mode", "status", "created_at", "updated_at")
        .where("created_by", userId)
        .orderBy("created_at", "asc"),
      this.sqlConnection("reconversion_projects")
        .select(
          "id",
          "name",
          "related_site_id",
          "creation_mode",
          "status",
          "created_at",
          "updated_at",
        )
        .where("created_by", userId)
        .orderBy("created_at", "asc"),
      this.sqlConnection("reconversion_compatibility_evaluations")
        .select("id", "related_site_id", "status", "created_at", "completed_at")
        .where("created_by", userId)
        .orderBy("created_at", "asc"),
    ]);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstname,
        lastName: user.lastname,
        structureName: user.structure_name,
        structureType: user.structure_type,
        structureActivity: user.structure_activity,
        subscribedToNewsletter: user.subscribed_to_newsletter,
        createdAt: user.created_at,
      },
      loginDates: loginRows.map((row) => row.created_at),
      sites: siteRows.map((row) => ({
        id: row.id,
        name: row.name,
        nature: row.nature,
        creationMode: row.creation_mode,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      projects: projectRows.map((row) => ({
        id: row.id,
        name: row.name,
        siteId: row.related_site_id,
        creationMode: row.creation_mode,
        status: row.status,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      })),
      compatibilityEvaluations: evaluationRows.map((row) => ({
        id: row.id,
        siteId: row.related_site_id,
        status: row.status,
        createdAt: row.created_at,
        completedAt: row.completed_at,
      })),
    };
  }
}
