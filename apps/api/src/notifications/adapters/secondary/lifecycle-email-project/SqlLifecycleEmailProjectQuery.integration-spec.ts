import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import type { LifecycleEmailProject } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlLifecycleEmailProjectQuery } from "./SqlLifecycleEmailProjectQuery";

describe("SqlLifecycleEmailProjectQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlLifecycleEmailProjectQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlLifecycleEmailProjectQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("returns the project's id, name, site name and creation date", async () => {
    const userId = uuid();
    const siteId = uuid();
    const projectId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: userId,
      name: "Friche de la gare",
      nature: "FRICHE",
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: "custom",
      created_at: new Date("2026-06-14T00:00:00.000Z"),
    });
    await sqlConnection("reconversion_projects").insert({
      id: projectId,
      created_by: userId,
      name: "Habitation, école et commerce",
      related_site_id: siteId,
      creation_mode: "custom",
      status: "active",
      created_at: new Date("2026-06-15T10:00:00.000Z"),
    });

    const result = await query.getById(projectId);

    assert.deepStrictEqual(result, {
      id: projectId,
      name: "Habitation, école et commerce",
      siteName: "Friche de la gare",
      createdAt: new Date("2026-06-15T10:00:00.000Z"),
    } satisfies LifecycleEmailProject);
  });

  it("returns undefined for an unknown project", async () => {
    const result = await query.getById(uuid());

    assert.strictEqual(result, undefined);
  });

  it("returns an archived project too", async () => {
    const userId = uuid();
    const siteId = uuid();
    const projectId = uuid();
    await sqlConnection("sites").insert({
      id: siteId,
      created_by: userId,
      name: "Friche de la gare",
      nature: "FRICHE",
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: "custom",
      created_at: new Date("2026-06-14T00:00:00.000Z"),
    });
    await sqlConnection("reconversion_projects").insert({
      id: projectId,
      created_by: userId,
      name: "Habitation, école et commerce",
      related_site_id: siteId,
      creation_mode: "custom",
      status: "archived",
      created_at: new Date("2026-06-15T10:00:00.000Z"),
    });

    const result = await query.getById(projectId);

    assert.deepStrictEqual(result, {
      id: projectId,
      name: "Habitation, école et commerce",
      siteName: "Friche de la gare",
      createdAt: new Date("2026-06-15T10:00:00.000Z"),
    } satisfies LifecycleEmailProject);
  });
});
