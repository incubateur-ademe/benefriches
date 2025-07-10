import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserQuery } from "src/users/core/gateways/UserQuery";

export type UserViewModel = {
  id: string;
  structure: { activity?: string; name?: string; type?: string };
};
export class SqlUserQuery implements UserQuery {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getById(userId: string): Promise<UserViewModel | undefined> {
    const [result] = await this.sqlConnection("users")
      .select("structure_activity", "structure_name", "structure_type", "id")
      .where("id", "=", userId);
    if (!result) return undefined;
    return {
      id: userId,
      structure: {
        activity: result.structure_activity,
        name: result.structure_name,
        type: result.structure_type,
      },
    };
  }
}
