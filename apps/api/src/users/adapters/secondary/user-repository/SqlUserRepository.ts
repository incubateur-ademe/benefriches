import { Inject } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { User } from "src/users/core/model/user";
import { UserRepository } from "src/users/core/usecases/createUser.usecase";

export class SqlUserRepository implements UserRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(user: User): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      await trx("users").insert(
        {
          id: user.id,
          email: user.email,
          firstname: user.firstname,
          lastname: user.lastname,
          structure_name: user.structureName,
          structure_type: user.structureType,
          structure_activity: user.structureActivity,
          created_at: user.createdAt,
          personal_data_storage_consented_at: user.personalDataStorageConsentedAt,
          personal_data_analytics_use_consented_at: user.personalDataAnalyticsUseConsentedAt,
          personal_data_communication_use_consented_at:
            user.personalDataCommunicationUseConsentedAt,
          created_from: user.createdFrom,
        },
        "id",
      );
    });
  }
}
