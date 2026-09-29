import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import type { LifecycleEmailSite } from "src/notifications/core/gateways/LifecycleEmailSiteQuery";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlLifecycleEmailSiteQuery } from "./SqlLifecycleEmailSiteQuery";

describe("SqlLifecycleEmailSiteQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlLifecycleEmailSiteQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlLifecycleEmailSiteQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("returns the site's id, name and nature, archived included", async () => {
    const siteId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: uuid(),
      name: "Ancienne carrière d’argile de Blajan",
      nature: "FRICHE",
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: "custom",
      status: "archived",
      created_at: new Date("2026-01-14T00:00:00.000Z"),
    });

    const result = await query.getById(siteId);

    assert.deepStrictEqual(result, {
      id: siteId,
      name: "Ancienne carrière d’argile de Blajan",
      nature: "FRICHE",
    } satisfies LifecycleEmailSite);
  });

  it("returns undefined for an unknown site", async () => {
    const result = await query.getById(uuid());

    assert.strictEqual(result, undefined);
  });
});
