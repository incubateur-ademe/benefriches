import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { User } from "src/auth/core/user";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlUser } from "src/shared-kernel/adapters/sql-knex/tableTypes";

import { UserRepository } from "../../core/gateways/UsersRepository";

const mapSqlUserToAuthenticatedUser = (userRow: SqlUser): User => ({
  id: userRow.id,
  firstName: userRow.firstname ?? "",
  lastName: userRow.lastname ?? "",
  email: userRow.email,
  createdAt: userRow.created_at,
  personalDataStorageConsentedAt: userRow.personal_data_storage_consented_at,
  personalDataAnalyticsUseConsentedAt:
    userRow.personal_data_analytics_use_consented_at ?? undefined,
  personalDataCommunicationUseConsentedAt:
    userRow.personal_data_communication_use_consented_at ?? undefined,
  structureName: userRow.structure_name ?? undefined,
  structureType: userRow.structure_type,
  structureActivity: userRow.structure_activity,
  subscribedToNewsletter: userRow.subscribed_to_newsletter,
});

export const mapUserToSqlRow = (user: User): SqlUser => ({
  id: user.id,
  email: user.email,
  firstname: user.firstName,
  lastname: user.lastName,
  structure_name: user.structureName ?? null,
  structure_type: user.structureType,
  structure_activity: user.structureActivity,
  created_at: user.createdAt,
  personal_data_storage_consented_at: user.personalDataStorageConsentedAt,
  personal_data_analytics_use_consented_at: user.personalDataAnalyticsUseConsentedAt ?? null,
  personal_data_communication_use_consented_at:
    user.personalDataCommunicationUseConsentedAt ?? null,
  subscribed_to_newsletter: user.subscribedToNewsletter,
});

@Injectable()
export class SqlUserRepository implements UserRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(user: User): Promise<void> {
    await this.sqlConnection("users").insert(mapUserToSqlRow(user)).onConflict("id").merge();
  }

  async existsWithEmail(email: string): Promise<boolean> {
    const exists = await this.sqlConnection("users").select("id").where({ email }).first();

    return !!exists;
  }

  async getWithEmail(email: string): Promise<User | undefined> {
    const foundUser = await this.sqlConnection("users").select("*").where("email", email).first();

    if (!foundUser) return undefined;

    return mapSqlUserToAuthenticatedUser(foundUser);
  }

  async getWithId(id: string): Promise<User | undefined> {
    const foundUser = await this.sqlConnection("users").select("*").where("id", id).first();

    if (!foundUser) return undefined;

    return mapSqlUserToAuthenticatedUser(foundUser);
  }
}
