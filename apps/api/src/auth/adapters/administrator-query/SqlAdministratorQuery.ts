import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";

import type { AdministratorQuery } from "src/auth/core/gateways/AdministratorQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlAdministratorQuery implements AdministratorQuery {
  private readonly sqlConnection: Knex;

  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async isAdministrator(userId: string): Promise<boolean> {
    const row = await this.sqlConnection("administrators")
      .select("user_id")
      .where("user_id", userId)
      .first();

    return row !== undefined;
  }
}
