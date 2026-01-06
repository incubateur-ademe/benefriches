import { Inject, Injectable } from "@nestjs/common";
import { Knex } from "knex";

import { TokenAuthenticationAttemptRepository } from "src/auth/core/gateways/TokenAuthenticationAttemptRepository";
import { TokenAuthenticationAttempt } from "src/auth/core/tokenAuthenticationAttempt";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

@Injectable()
export class SqlTokenAuthenticationAttemptRepository implements TokenAuthenticationAttemptRepository {
  constructor(@Inject(SqlConnection) private readonly sqlConnection: Knex) {}

  async save(authToken: TokenAuthenticationAttempt): Promise<void> {
    await this.sqlConnection("token_authentication_attempts").insert({
      token: authToken.token,
      user_id: authToken.userId,
      email: authToken.email,
      created_at: authToken.createdAt,
      expires_at: authToken.expiresAt,
      used_at: authToken.completedAt,
    });
  }

  async hasRecentUnusedTokenForUser(userId: string, createdAfter: Date): Promise<boolean> {
    const result = await this.sqlConnection("token_authentication_attempts")
      .select("*")
      .where("user_id", userId)
      .where("used_at", null) // Only unused tokens
      .where("created_at", ">=", createdAfter)
      .orderBy("created_at", "desc")
      .first();

    return !!result;
  }

  async findByToken(token: string): Promise<TokenAuthenticationAttempt | null> {
    const result = await this.sqlConnection("token_authentication_attempts")
      .select("*")
      .where("token", token)
      .first();

    return result
      ? {
          completedAt: result.used_at,
          token: result.token,
          userId: result.user_id,
          email: result.email,
          createdAt: result.created_at,
          expiresAt: result.expires_at,
        }
      : null;
  }

  async markAsComplete(token: string, completedAt: Date): Promise<void> {
    await this.sqlConnection("token_authentication_attempts")
      .update({
        used_at: completedAt,
      })
      .where("token", token);
  }
}
