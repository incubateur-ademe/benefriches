import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import { SqlUserRepository } from "src/auth/adapters/user-repository/SqlUsersRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlMarketingUsersQuery } from "./SqlMarketingUsersQuery";

describe("SqlMarketingUsersQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlMarketingUsersQuery;
  let userRepository: SqlUserRepository;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    query = new SqlMarketingUsersQuery(sqlConnection);
    userRepository = new SqlUserRepository(sqlConnection);
  });

  it("returns an empty array when there are no users", async () => {
    const result = await query.listAll();
    assert.deepStrictEqual(result, []);
  });

  it("returns id, email, and subscribedToNewsletter for every user", async () => {
    const subscribed = new UserBuilder()
      .withEmail("subscribed@example.com")
      .withNewsletterSubscription()
      .build();
    const unsubscribed = new UserBuilder().withEmail("unsubscribed@example.com").build();

    await userRepository.save(subscribed);
    await userRepository.save(unsubscribed);

    const result = await query.listAll();

    assert.strictEqual(result.length, 2);
    assert.deepStrictEqual(result, [
      { id: subscribed.id, email: subscribed.email, subscribedToNewsletter: true },
      { id: unsubscribed.id, email: unsubscribed.email, subscribedToNewsletter: false },
    ]);
  });
});
