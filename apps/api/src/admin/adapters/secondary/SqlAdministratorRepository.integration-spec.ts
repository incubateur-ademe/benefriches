import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlAdministratorRepository } from "./SqlAdministratorRepository";

const insertUser = async (
  sqlConnection: Knex,
  id: string,
  email: string,
  createdAt = new Date("2026-01-01T00:00:00.000Z"),
): Promise<void> => {
  await sqlConnection("users").insert({
    id,
    email,
    structure_activity: "urban_planner",
    structure_type: "company",
    created_at: createdAt,
    personal_data_storage_consented_at: createdAt,
  });
};

describe("SqlAdministratorRepository integration", () => {
  let sqlConnection: Knex;
  let repository: SqlAdministratorRepository;

  before(() => {
    sqlConnection = knex(knexConfig);
    repository = new SqlAdministratorRepository(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("getUsersByEmail matches every user whose email equals the argument case-insensitively", async () => {
    const olderUserId = uuid();
    const newerUserId = uuid();
    await insertUser(
      sqlConnection,
      newerUserId,
      "jane.doe@ademe.fr",
      new Date("2026-03-01T00:00:00.000Z"),
    );
    await insertUser(
      sqlConnection,
      olderUserId,
      "Jane.Doe@ademe.fr",
      new Date("2026-02-01T00:00:00.000Z"),
    );
    await insertUser(sqlConnection, uuid(), "other@ademe.fr");

    const result = await repository.getUsersByEmail("jane.doe@ademe.fr");

    assert.deepStrictEqual(result, [
      { id: olderUserId, email: "Jane.Doe@ademe.fr" },
      { id: newerUserId, email: "jane.doe@ademe.fr" },
    ]);
  });

  it("getUsersByEmail returns an empty list when no user matches", async () => {
    await insertUser(sqlConnection, uuid(), "other@ademe.fr");

    const result = await repository.getUsersByEmail("jane.doe@ademe.fr");

    assert.deepStrictEqual(result, []);
  });

  it("getUserById returns the user's id and email", async () => {
    const userId = uuid();
    await insertUser(sqlConnection, userId, "Jane.Doe@ademe.fr");

    const result = await repository.getUserById(userId);

    assert.deepStrictEqual(result, { id: userId, email: "Jane.Doe@ademe.fr" });
  });

  it("getUserById returns undefined for an unknown id", async () => {
    const result = await repository.getUserById(uuid());

    assert.strictEqual(result, undefined);
  });

  it("isAdministrator reflects the administrators table", async () => {
    const administratorId = uuid();
    const plainUserId = uuid();
    await insertUser(sqlConnection, administratorId, "admin@ademe.fr");
    await insertUser(sqlConnection, plainUserId, "user@ademe.fr");
    await sqlConnection("administrators").insert({
      user_id: administratorId,
      created_at: new Date("2026-01-02T00:00:00.000Z"),
    });

    assert.strictEqual(await repository.isAdministrator(administratorId), true);
    assert.strictEqual(await repository.isAdministrator(plainUserId), false);
  });

  it("grant inserts an administrators row with the given date", async () => {
    const userId = uuid();
    await insertUser(sqlConnection, userId, "jane.doe@ademe.fr");
    const grantedAt = new Date("2026-10-20T10:00:00.000Z");

    await repository.grant(userId, grantedAt);

    assert.deepStrictEqual(await sqlConnection("administrators").select(), [
      { user_id: userId, created_at: grantedAt },
    ]);
  });
});
