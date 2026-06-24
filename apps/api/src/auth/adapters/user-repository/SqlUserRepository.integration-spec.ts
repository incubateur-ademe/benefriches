import type { Knex } from "knex";
import knex from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { assertShapeEquals, isDate } from "test/assertShapeEquals";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlUserRepository } from "./SqlUsersRepository";

describe("SqlUserRepository integration", () => {
  let sqlConnection: Knex;
  let userRepository: SqlUserRepository;

  before(() => {
    sqlConnection = knex(knexConfig);
  });
  after(async () => {
    await sqlConnection.destroy();
  });
  beforeEach(() => {
    userRepository = new SqlUserRepository(sqlConnection);
  });

  it("Saves user with minimal required props", async () => {
    const user = new UserBuilder().build();

    await userRepository.save(user);

    const rows = await sqlConnection("users").select().where({ id: user.id });
    assert.strictEqual(rows.length, 1);
    const [row] = rows;
    assert.ok(row);
    assertShapeEquals(
      row,
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        structure_name: null,
        structure_type: user.structureType,
        structure_activity: user.structureActivity,
        personal_data_storage_consented_at: user.personalDataStorageConsentedAt,
        personal_data_analytics_use_consented_at: null,
        personal_data_communication_use_consented_at: null,
        subscribed_to_newsletter: user.subscribedToNewsletter,
      },
      { created_at: isDate },
    );
  });

  it("Saves user with full props", async () => {
    const user = new UserBuilder()
      .withEmail("test@example.com")
      .asUrbanPlanner()
      .withNewsletterSubscription()
      .build();

    await userRepository.save(user);

    const rows = await sqlConnection("users").select().where({ id: user.id });
    assert.strictEqual(rows.length, 1);
    const [row] = rows;
    assert.ok(row);
    // `created_at` is a Knex-generated timestamp — checked by type, not value; every other
    // column is asserted exactly (an unexpected extra column would fail the assertion).
    assertShapeEquals(
      row,
      {
        id: user.id,
        email: user.email,
        firstname: user.firstName,
        lastname: user.lastName,
        structure_name: user.structureName,
        structure_type: user.structureType,
        structure_activity: user.structureActivity,
        personal_data_storage_consented_at: user.personalDataStorageConsentedAt,
        personal_data_analytics_use_consented_at: user.personalDataAnalyticsUseConsentedAt ?? null,
        personal_data_communication_use_consented_at:
          user.personalDataCommunicationUseConsentedAt ?? null,
        subscribed_to_newsletter: true,
      },
      { created_at: isDate },
    );
  });
});
