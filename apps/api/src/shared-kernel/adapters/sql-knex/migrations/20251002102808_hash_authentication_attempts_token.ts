import { Knex } from "knex";

import { RandomTokenGenerator } from "../../../../auth/adapters/token-generator/RandomTokenGenerator";

export async function up(knex: Knex): Promise<void> {
  const authAttemptsTokens = await knex("token_authentication_attempts").select("token");

  const updatePromises = authAttemptsTokens.map((record) => {
    const hashedToken = new RandomTokenGenerator().hash(record.token);

    return knex("token_authentication_attempts")
      .where("token", record.token)
      .update({ token: hashedToken });
  });

  await Promise.all(updatePromises);
}

export async function down(): Promise<void> {
  // not reversible since we can't unhash tokens
}
