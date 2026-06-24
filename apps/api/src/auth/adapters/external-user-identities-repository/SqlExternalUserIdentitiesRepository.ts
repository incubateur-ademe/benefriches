import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import {
  ExternalUserIdentity,
  ExternalUserIdentityRepository,
} from "./ExternalUserIdentitiesRepository";

@Injectable()
export class SqlExternalUserIdentitiesRepository implements ExternalUserIdentityRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(userIdentity: ExternalUserIdentity): Promise<void> {
    await this.sqlConnection("auth_external_user_identities").insert({
      id: userIdentity.id,
      user_id: userIdentity.userId,
      provider: userIdentity.provider,
      provider_user_id: userIdentity.providerUserId,
      provider_info: userIdentity.providerInfo ?? null,
      created_at: userIdentity.createdAt,
    });
  }

  async findByProviderUserId(
    provider: string,
    providerUserId: string,
  ): Promise<ExternalUserIdentity | undefined> {
    const userIdentityResult = await this.sqlConnection("auth_external_user_identities")
      .select("*")
      .where({ provider, provider_user_id: providerUserId })
      .first();

    if (!userIdentityResult) return undefined;

    return {
      id: userIdentityResult.id,
      userId: userIdentityResult.user_id,
      provider: userIdentityResult.provider,
      providerUserId: userIdentityResult.provider_user_id,
      createdAt: userIdentityResult.created_at,
    };
  }
}
