import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlAdministratorQuery } from "./SqlAdministratorQuery";

const insertUser = async (sqlConnection: Knex, id: string): Promise<void> => {
  await sqlConnection("users").insert({
    id,
    email: `${id}@test.fr`,
    structure_activity: "urban_planner",
    structure_type: "company",
    created_at: new Date("2026-01-01T00:00:00.000Z"),
    personal_data_storage_consented_at: new Date("2026-01-01T00:00:00.000Z"),
  });
};

describe("SqlAdministratorQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlAdministratorQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlAdministratorQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("returns true when user is in administrators table", async () => {
    const userId = uuid();
    await insertUser(sqlConnection, userId);
    await sqlConnection("administrators").insert({
      user_id: userId,
      created_at: new Date("2026-01-02T00:00:00.000Z"),
    });

    const result = await query.isAdministrator(userId);

    assert.strictEqual(result, true);
  });

  it("returns false when user exists but is not an administrator", async () => {
    const userId = uuid();
    await insertUser(sqlConnection, userId);

    const result = await query.isAdministrator(userId);

    assert.strictEqual(result, false);
  });

  it("returns false when user does not exist", async () => {
    const result = await query.isAdministrator(uuid());

    assert.strictEqual(result, false);
  });
});
