import knex, { Knex } from "knex";

import { SqlUserRepository } from "src/auth/adapters/user-repository/SqlUsersRepository";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlMarketingUsersRepository } from "./SqlMarketingUsersRepository";

describe("SqlMarketingUsersRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlMarketingUsersRepository;
  let userRepository: SqlUserRepository;

  beforeAll(() => {
    sqlConnection = knex(knexConfig);
  });

  afterAll(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlMarketingUsersRepository(sqlConnection);
    userRepository = new SqlUserRepository(sqlConnection);
  });

  it("flips subscribed_to_newsletter to true", async () => {
    const user = new UserBuilder().build();
    await userRepository.save(user);

    await repository.updateSubscriptionStatus(user.id, true);

    const [row] = await sqlConnection("users").select("subscribed_to_newsletter").where({
      id: user.id,
    });
    expect(row?.subscribed_to_newsletter).toBe(true);
  });

  it("flips subscribed_to_newsletter to false", async () => {
    const user = new UserBuilder().withNewsletterSubscription().build();
    await userRepository.save(user);

    await repository.updateSubscriptionStatus(user.id, false);

    const [row] = await sqlConnection("users").select("subscribed_to_newsletter").where({
      id: user.id,
    });
    expect(row?.subscribed_to_newsletter).toBe(false);
  });

  it("does not throw when the user id does not exist (no-op)", async () => {
    await expect(
      repository.updateSubscriptionStatus("00000000-0000-0000-0000-000000000000", true),
    ).resolves.toBeUndefined();
  });
});
