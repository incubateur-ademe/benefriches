import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlUser } from "src/shared-kernel/adapters/sql-knex/tableTypes";

import { AuthenticatedUser, AuthUserRepository } from "./AuthUsersRepository";

const mapSqlUserToAuthenticatedUser = (userRow: SqlUser): AuthenticatedUser => ({
  id: userRow.id,
  firstName: userRow.firstname,
  lastName: userRow.lastname,
  email: userRow.email,
  structureType: userRow.structure_type,
  structureActivity: userRow.structure_activity,
  structureName: userRow.structure_name,
});

// todo: merge with SqlUserRepository
@Injectable()
export class SqlAuthUserRepository implements AuthUserRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async getWithEmail(email: string): Promise<AuthenticatedUser | undefined> {
    const foundUser = await this.sqlConnection("users").select("*").where("email", email).first();

    if (!foundUser) return undefined;

    return mapSqlUserToAuthenticatedUser(foundUser);
  }

  async getWithId(id: string): Promise<AuthenticatedUser | undefined> {
    const foundUser = await this.sqlConnection("users").select("*").where("id", id).first();

    if (!foundUser) return undefined;

    return mapSqlUserToAuthenticatedUser(foundUser);
  }
}
