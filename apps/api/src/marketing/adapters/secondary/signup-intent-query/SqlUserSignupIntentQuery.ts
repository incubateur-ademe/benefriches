import { Inject, Injectable } from "@nestjs/common";
import type { Knex } from "knex";
import { z } from "zod";

import { USER_ACCOUNT_CREATED } from "src/auth/core/events/userAccountCreated.event";
import type {
  UserSignupIntent,
  UserSignupIntentQuery,
} from "src/marketing/core/gateways/UserSignupIntentQuery";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

/**
 * Mirrors `UserAccountCreatedEvent["payload"]`. Every field is required: a payload missing or
 * mistyping any of them is not a signup intent we can trust, and guessing a default (an empty
 * name, a `false` subscription) would create a CRM contact with fabricated data. Such a row is
 * reported as "no signup event found" instead, so the user shows up in the backfill summary
 * rather than being silently half-repaired.
 */
const signupEventPayloadSchema = z.object({
  userFirstName: z.string(),
  userLastName: z.string(),
  subscribedToNewsletter: z.boolean(),
});

@Injectable()
export class SqlUserSignupIntentQuery implements UserSignupIntentQuery {
  private readonly sqlConnection: Knex;
  constructor(@Inject(SqlConnection) sqlConnection: Knex) {
    this.sqlConnection = sqlConnection;
  }

  async findByUserId(userId: string): Promise<UserSignupIntent | null> {
    const row = await this.sqlConnection("domain_events")
      .where("name", USER_ACCOUNT_CREATED)
      .whereRaw("payload->>'userId' = ?", [userId])
      // A user id is signed up once, so at most one row is expected. Ordering is defensive
      // only: should a duplicate ever exist, take the oldest, which carries the original intent.
      .orderBy("created_at")
      .select("payload")
      .first();

    if (!row?.payload) return null;

    const payload = signupEventPayloadSchema.safeParse(row.payload);

    if (!payload.success) return null;

    return {
      firstName: payload.data.userFirstName,
      lastName: payload.data.userLastName,
      subscribedToNewsletter: payload.data.subscribedToNewsletter,
    };
  }
}
