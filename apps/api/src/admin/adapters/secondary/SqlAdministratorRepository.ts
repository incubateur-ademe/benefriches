import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { AdministratorRepository } from "src/admin/core/gateways/AdministratorRepository";
import type { AdministratorCandidate } from "src/admin/core/models/administratorCandidate";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlAdministratorRepository implements AdministratorRepository {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async getUsersByEmail(normalizedEmail: string): Promise<AdministratorCandidate[]> {
    const rows = await this.sqlConnection("users")
      .select("id", "email")
      .whereRaw("lower(email) = ?", [normalizedEmail])
      .orderBy("created_at", "asc");

    return rows.map(({ id, email }) => ({ id, email }));
  }

  async getUserById(userId: string): Promise<AdministratorCandidate | undefined> {
    const row = await this.sqlConnection("users").select("id", "email").where("id", userId).first();

    return row ? { id: row.id, email: row.email } : undefined;
  }

  async isAdministrator(userId: string): Promise<boolean> {
    const row = await this.sqlConnection("administrators")
      .select("user_id")
      .where("user_id", userId)
      .first();

    return row !== undefined;
  }

  async grant(userId: string, grantedAt: Date): Promise<void> {
    await this.sqlConnection("administrators").insert({ user_id: userId, created_at: grantedAt });
  }
}
