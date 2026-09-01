import { addMinutes, subMinutes } from "date-fns";
import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlTokenAuthenticationAttemptRepository } from "./SqlTokenAuthenticationAttemptRepository";

describe("SqlTokenAuthenticationAttemptRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlTokenAuthenticationAttemptRepository;

  const now = new Date("2025-01-01T14:00:00Z");

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    repository = new SqlTokenAuthenticationAttemptRepository(sqlConnection);
  });

  it("revokes an unused attempt", async () => {
    await sqlConnection("token_authentication_attempts").insert({
      token: "t-unused",
      user_id: uuid(),
      email: "user1@example.com",
      created_at: subMinutes(now, 5),
      expires_at: addMinutes(now, 15),
      used_at: null,
      revoked_at: null,
    });

    const revokedCount = await repository.revokeUnusedAttempts(now);

    assert.strictEqual(revokedCount, 1);
    const row = await sqlConnection("token_authentication_attempts")
      .where("token", "t-unused")
      .first();
    assert.ok(row);
    assert.deepStrictEqual(row.revoked_at, now);
  });

  it("leaves an already-used attempt alone", async () => {
    await sqlConnection("token_authentication_attempts").insert({
      token: "t-used",
      user_id: uuid(),
      email: "user1@example.com",
      created_at: subMinutes(now, 5),
      expires_at: addMinutes(now, 15),
      used_at: subMinutes(now, 1),
      revoked_at: null,
    });

    const revokedCount = await repository.revokeUnusedAttempts(now);

    assert.strictEqual(revokedCount, 0);
    const row = await sqlConnection("token_authentication_attempts")
      .where("token", "t-used")
      .first();
    assert.ok(row);
    assert.strictEqual(row.revoked_at, null);
  });

  it("leaves an already-revoked attempt alone", async () => {
    const earlierRevocation = subMinutes(now, 10);
    await sqlConnection("token_authentication_attempts").insert({
      token: "t-revoked",
      user_id: uuid(),
      email: "user1@example.com",
      created_at: subMinutes(now, 5),
      expires_at: addMinutes(now, 15),
      used_at: null,
      revoked_at: earlierRevocation,
    });

    const revokedCount = await repository.revokeUnusedAttempts(now);

    assert.strictEqual(revokedCount, 0);
    const row = await sqlConnection("token_authentication_attempts")
      .where("token", "t-revoked")
      .first();
    assert.ok(row);
    assert.deepStrictEqual(row.revoked_at, earlierRevocation);
  });

  it("returns a count matching the rows actually revoked in a mixed set", async () => {
    const earlierRevocation = subMinutes(now, 10);
    await sqlConnection("token_authentication_attempts").insert([
      {
        token: "t-unused-1",
        user_id: uuid(),
        email: "user1@example.com",
        created_at: subMinutes(now, 5),
        expires_at: addMinutes(now, 15),
        used_at: null,
        revoked_at: null,
      },
      {
        token: "t-unused-2",
        user_id: uuid(),
        email: "user1@example.com",
        created_at: subMinutes(now, 5),
        expires_at: addMinutes(now, 20),
        used_at: null,
        revoked_at: null,
      },
      {
        token: "t-used",
        user_id: uuid(),
        email: "user1@example.com",
        created_at: subMinutes(now, 5),
        expires_at: addMinutes(now, 15),
        used_at: subMinutes(now, 1),
        revoked_at: null,
      },
      {
        token: "t-revoked",
        user_id: uuid(),
        email: "user1@example.com",
        created_at: subMinutes(now, 5),
        expires_at: addMinutes(now, 15),
        used_at: null,
        revoked_at: earlierRevocation,
      },
    ]);

    const revokedCount = await repository.revokeUnusedAttempts(now);

    assert.strictEqual(revokedCount, 2);
    const rows = await sqlConnection("token_authentication_attempts")
      .select("token", "revoked_at")
      .orderBy("token");
    assert.deepStrictEqual(rows, [
      { token: "t-revoked", revoked_at: earlierRevocation },
      { token: "t-unused-1", revoked_at: now },
      { token: "t-unused-2", revoked_at: now },
      { token: "t-used", revoked_at: null },
    ]);
  });
});
