import { Inject } from "@nestjs/common";
import { Knex } from "knex";
import { Identity } from "src/identities/domain/model/identity";
import { IdentityRepository } from "src/identities/domain/usecases/createIdentity.usecase";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

declare module "knex/types/tables" {
  interface Tables {
    identities: SqlIdentity;
  }
}
type SqlIdentity = {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  structure_name?: string;
  structure_type?: string;
  created_at: Date;
  personal_data_storage_consented_at: Date;
  personal_data_analytics_use_consented_at?: Date;
  personal_data_communication_use_consented_at?: Date;
};

export class SqlIdentityRepository implements IdentityRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(identity: Identity): Promise<void> {
    await this.sqlConnection.transaction(async (trx) => {
      await trx("identities").insert(
        {
          id: identity.id,
          email: identity.email,
          firstname: identity.firstname,
          lastname: identity.lastname,
          structure_name: identity.structureName,
          structure_type: identity.structureType,
          created_at: identity.createdAt,
          personal_data_storage_consented_at: identity.personalDataStorageConsentedAt,
          personal_data_analytics_use_consented_at: identity.personalDataAnalyticsUseConsentedAt,
          personal_data_communication_use_consented_at:
            identity.personalDataCommunicationUseConsentedAt,
        },
        "id",
      );
    });
  }
}
