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
  describe("listCreatedSince", () => {
    it("returns an empty array when no user was created since the given date", async () => {
      const user = {
        ...new UserBuilder().withEmail("old@example.com").build(),
        createdAt: new Date("2026-05-01T00:00:00.000Z"),
      };
      await userRepository.save(user);

      const result = await query.listCreatedSince(new Date("2026-06-05T00:00:00.000Z"));

      assert.deepStrictEqual(result, []);
    });

    it("returns only users created at or after the given date, oldest first", async () => {
      const before = {
        ...new UserBuilder().withEmail("before@example.com").build(),
        createdAt: new Date("2026-06-04T23:59:59.000Z"),
      };
      const exactlyOn = {
        ...new UserBuilder()
          .withEmail("exactly-on@example.com")
          .withNewsletterSubscription()
          .build(),
        createdAt: new Date("2026-06-05T00:00:00.000Z"),
      };
      const after = {
        ...new UserBuilder().withEmail("after@example.com").build(),
        createdAt: new Date("2026-07-01T00:00:00.000Z"),
      };
      await userRepository.save(before);
      await userRepository.save(after);
      await userRepository.save(exactlyOn);

      const result = await query.listCreatedSince(new Date("2026-06-05T00:00:00.000Z"));

      assert.deepStrictEqual(result, [
        { id: exactlyOn.id, email: exactlyOn.email, subscribedToNewsletter: true },
        { id: after.id, email: after.email, subscribedToNewsletter: false },
      ]);
    });
  });
});
