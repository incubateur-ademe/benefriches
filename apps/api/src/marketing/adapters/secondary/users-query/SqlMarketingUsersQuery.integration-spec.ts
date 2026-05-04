import knex, { Knex } from "knex";

import { SqlUserRepository } from "src/auth/adapters/user-repository/SqlUsersRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlMarketingUsersQuery } from "./SqlMarketingUsersQuery";

describe("SqlMarketingUsersQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlMarketingUsersQuery;
  let userRepository: SqlUserRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    query = new SqlMarketingUsersQuery(sqlConnection);
    userRepository = new SqlUserRepository(sqlConnection);
  });

  it("returns an empty array when there are no users", async () => {
    const result = await query.listAll();
    expect(result).toEqual([]);
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

    expect(result).toHaveLength(2);
    expect(result).toEqual([
      { id: subscribed.id, email: subscribed.email, subscribedToNewsletter: true },
      { id: unsubscribed.id, email: unsubscribed.email, subscribedToNewsletter: false },
    ]);
  });
});
