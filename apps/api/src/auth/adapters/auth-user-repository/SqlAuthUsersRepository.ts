import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { AuthUserRepository } from "./AuthUsersRepository";

@Injectable()
export class SqlAuthUserRepository implements AuthUserRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async existsWithEmail(email: string): Promise<boolean> {
    const foundWithEmail = await this.sqlConnection("users").select("id").where({ email }).first();
    return !!foundWithEmail;
  }
}
