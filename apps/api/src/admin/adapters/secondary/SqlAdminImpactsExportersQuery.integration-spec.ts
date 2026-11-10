import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import type { AdminImpactsExporterListItem } from "src/admin/core/models/adminImpactsExporterReadModel";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import { RECONVERSION_PROJECT_IMPACTS_EXPORTED } from "src/reconversion-projects/core/events/reconversionProjectImpactsExported.event";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlAdminImpactsExportersQuery } from "./SqlAdminImpactsExportersQuery";

type UserInsert = {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  structure_name?: string;
};

const insertUser = async (sqlConnection: Knex, user: UserInsert): Promise<void> => {
  await sqlConnection("users").insert({
    structure_activity: "urban_planner",
    structure_type: "company",
    created_at: new Date("2026-01-01T08:00:00.000Z"),
    personal_data_storage_consented_at: new Date("2026-01-01T08:00:00.000Z"),
    ...user,
  });
};

const insertImpactsExport = async (
  sqlConnection: Knex,
  { userId, projectId, createdAt }: { userId: string; projectId: string; createdAt: Date },
): Promise<void> => {
  await sqlConnection("domain_events").insert({
    id: uuid(),
    name: RECONVERSION_PROJECT_IMPACTS_EXPORTED,
    payload: {
      userId,
      reconversionProjectId: projectId,
      format: "pdf",
      sections: {},
    },
    created_at: createdAt,
  });
};

describe("SqlAdminImpactsExportersQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlAdminImpactsExportersQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlAdminImpactsExportersQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  it("returns each user with their impacts exports count, distinct exported projects count and last export date", async () => {
    const userId = uuid();
    const projectA = uuid();
    const projectB = uuid();
    await insertUser(sqlConnection, {
      id: userId,
      email: "jane@collectivite.fr",
      firstname: "Jane",
      lastname: "Doe",
      structure_name: "Mairie de Blajan",
    });
    await insertImpactsExport(sqlConnection, {
      userId,
      projectId: projectA,
      createdAt: new Date("2026-10-01T08:00:00.000Z"),
    });
    await insertImpactsExport(sqlConnection, {
      userId,
      projectId: projectA,
      createdAt: new Date("2026-10-20T08:00:00.000Z"),
    });
    await insertImpactsExport(sqlConnection, {
      userId,
      projectId: projectB,
      createdAt: new Date("2026-10-10T08:00:00.000Z"),
    });
    await sqlConnection("domain_events").insert({
      id: uuid(),
      name: LOGIN_SUCCEEDED,
      payload: { userId, userEmail: "jane@collectivite.fr", method: "email-link" },
      created_at: new Date("2026-10-30T08:00:00.000Z"),
    });

    const result = await query.list({ page: 1, pageSize: 25 });

    assert.deepStrictEqual(result, {
      total: 1,
      users: [
        {
          id: userId,
          email: "jane@collectivite.fr",
          firstName: "Jane",
          lastName: "Doe",
          structureName: "Mairie de Blajan",
          impactsExportsCount: 3,
          exportedProjectsCount: 2,
          lastImpactsExportedAt: new Date("2026-10-20T08:00:00.000Z"),
        },
      ] satisfies AdminImpactsExporterListItem[],
    });
  });

  it("orders users by last impacts export date, newest first", async () => {
    const earlyExporterId = uuid();
    const lateExporterId = uuid();
    await insertUser(sqlConnection, { id: earlyExporterId, email: "early@test.fr" });
    await insertUser(sqlConnection, { id: lateExporterId, email: "late@test.fr" });
    await insertImpactsExport(sqlConnection, {
      userId: earlyExporterId,
      projectId: uuid(),
      createdAt: new Date("2026-10-01T08:00:00.000Z"),
    });
    await insertImpactsExport(sqlConnection, {
      userId: lateExporterId,
      projectId: uuid(),
      createdAt: new Date("2026-10-05T08:00:00.000Z"),
    });

    const result = await query.list({ page: 1, pageSize: 25 });

    assert.deepStrictEqual(
      result.users.map((user) => user.id),
      [lateExporterId, earlyExporterId],
    );
  });

  it("leaves out users without impacts exports", async () => {
    const exporterId = uuid();
    await insertUser(sqlConnection, { id: exporterId, email: "exporter@test.fr" });
    await insertUser(sqlConnection, { id: uuid(), email: "no-export@test.fr" });
    await insertImpactsExport(sqlConnection, {
      userId: exporterId,
      projectId: uuid(),
      createdAt: new Date("2026-10-01T08:00:00.000Z"),
    });

    const result = await query.list({ page: 1, pageSize: 25 });

    assert.deepStrictEqual(
      { total: result.total, userIds: result.users.map((user) => user.id) },
      { total: 1, userIds: [exporterId] },
    );
  });

  it("leaves out administrators even when they exported impacts", async () => {
    const exporterId = uuid();
    const administratorId = uuid();
    await insertUser(sqlConnection, { id: exporterId, email: "exporter@test.fr" });
    await insertUser(sqlConnection, { id: administratorId, email: "admin@benefriches.fr" });
    await sqlConnection("administrators").insert({
      user_id: administratorId,
      created_at: new Date("2026-01-01T00:00:00.000Z"),
    });
    await insertImpactsExport(sqlConnection, {
      userId: exporterId,
      projectId: uuid(),
      createdAt: new Date("2026-10-01T08:00:00.000Z"),
    });
    await insertImpactsExport(sqlConnection, {
      userId: administratorId,
      projectId: uuid(),
      createdAt: new Date("2026-10-02T08:00:00.000Z"),
    });

    const result = await query.list({ page: 1, pageSize: 25 });

    assert.deepStrictEqual(
      { total: result.total, userIds: result.users.map((user) => user.id) },
      { total: 1, userIds: [exporterId] },
    );
  });

  it("leaves out impacts exports of accounts that no longer exist", async () => {
    await insertImpactsExport(sqlConnection, {
      userId: uuid(),
      projectId: uuid(),
      createdAt: new Date("2026-10-01T08:00:00.000Z"),
    });

    const result = await query.list({ page: 1, pageSize: 25 });

    assert.deepStrictEqual(result, { total: 0, users: [] });
  });

  it("paginates results and reports total count of all matching users", async () => {
    const user1 = uuid();
    const user2 = uuid();
    const user3 = uuid();
    for (const [userId, day] of [
      [user1, "01"],
      [user2, "02"],
      [user3, "03"],
    ] as const) {
      await insertUser(sqlConnection, { id: userId, email: `${userId}@test.fr` });
      await insertImpactsExport(sqlConnection, {
        userId,
        projectId: uuid(),
        createdAt: new Date(`2026-10-${day}T08:00:00.000Z`),
      });
    }

    const result = await query.list({ page: 2, pageSize: 2 });

    assert.deepStrictEqual(
      { total: result.total, userIds: result.users.map((user) => user.id) },
      { total: 3, userIds: [user1] },
    );
  });

  it("returns each user exactly once across pages when users share a last export date", async () => {
    const firstUserId = "00000000-0000-4000-8000-000000000001";
    const secondUserId = "00000000-0000-4000-8000-000000000002";
    for (const userId of [firstUserId, secondUserId]) {
      await insertUser(sqlConnection, { id: userId, email: `${userId}@test.fr` });
      await insertImpactsExport(sqlConnection, {
        userId,
        projectId: uuid(),
        createdAt: new Date("2026-10-10T10:00:00.000Z"),
      });
    }

    const firstPage = await query.list({ page: 1, pageSize: 1 });
    const secondPage = await query.list({ page: 2, pageSize: 1 });

    assert.deepStrictEqual(
      {
        firstPage: { total: firstPage.total, userIds: firstPage.users.map((user) => user.id) },
        secondPage: { total: secondPage.total, userIds: secondPage.users.map((user) => user.id) },
      },
      {
        firstPage: { total: 2, userIds: [secondUserId] },
        secondPage: { total: 2, userIds: [firstUserId] },
      },
    );
  });

  for (const { field, search } of [
    { field: "email", search: "COLLECTIVITE" },
    { field: "first name", search: "jan" },
    { field: "last name", search: "DOE" },
    { field: "structure name", search: "blajan" },
  ]) {
    it(`filters users with case-insensitive search on ${field}`, async () => {
      const matchingUserId = uuid();
      const otherUserId = uuid();
      await insertUser(sqlConnection, {
        id: matchingUserId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
      });
      await insertUser(sqlConnection, {
        id: otherUserId,
        email: "john@company.fr",
        firstname: "John",
        lastname: "Smith",
        structure_name: "UrbanPlanning Inc.",
      });
      for (const userId of [matchingUserId, otherUserId]) {
        await insertImpactsExport(sqlConnection, {
          userId,
          projectId: uuid(),
          createdAt: new Date("2026-10-01T08:00:00.000Z"),
        });
      }

      const result = await query.list({ search, page: 1, pageSize: 25 });

      assert.deepStrictEqual(
        { total: result.total, userIds: result.users.map((user) => user.id) },
        { total: 1, userIds: [matchingUserId] },
      );
    });
  }
});
