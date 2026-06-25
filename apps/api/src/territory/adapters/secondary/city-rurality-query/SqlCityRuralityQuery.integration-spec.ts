import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";

import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlCityRuralityQuery } from "./SqlCityRuralityQuery";

describe("SqlCityRuralityQuery", () => {
  let sqlConnection: Knex;
  let query: SqlCityRuralityQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  beforeEach(() => {
    query = new SqlCityRuralityQuery(sqlConnection);
  });

  it("returns true for a commune classified as rural (FRR)", async () => {
    // 01029 (Beaupont) is classified "FRR socle" in the seeded FRR list
    const result = await query.isCityRural("01029");

    assert.strictEqual(result, true);
  });

  it("returns false for a commune that is 'Non classée' (absent from the table)", async () => {
    // 01001 (L'Abergement-Clémenciat) is "Non classée" so it is not seeded
    const result = await query.isCityRural("01001");

    assert.strictEqual(result, false);
  });
});
