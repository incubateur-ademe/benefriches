import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import type { AdminMonthlyCounts, MonthlyCount } from "src/admin/core/gateways/AdminStatsQuery";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlAdminStatsQuery } from "./SqlAdminStatsQuery";

const insertUser = async (sqlConnection: Knex, createdAt: Date): Promise<string> => {
  const id = uuid();
  await sqlConnection("users").insert({
    id,
    email: `${id}@test.fr`,
    structure_activity: "urban_planner",
    structure_type: "company",
    created_at: createdAt,
    personal_data_storage_consented_at: createdAt,
  });
  return id;
};

const insertSite = async (
  sqlConnection: Knex,
  createdBy: string,
  createdAt: Date,
): Promise<string> => {
  const id = uuid();
  await sqlConnection("sites").insert({
    id,
    created_by: createdBy,
    name: "Site",
    nature: "FRICHE",
    surface_area: 1000,
    owner_structure_type: "company",
    creation_mode: "express",
    created_at: createdAt,
  });
  return id;
};

const insertProject = async (
  sqlConnection: Knex,
  createdBy: string,
  siteId: string,
  createdAt: Date,
): Promise<void> => {
  await sqlConnection("reconversion_projects").insert({
    id: uuid(),
    created_by: createdBy,
    name: "Projet",
    related_site_id: siteId,
    creation_mode: "express",
    created_at: createdAt,
  });
};

const insertCompatibilityEvaluation = async (
  sqlConnection: Knex,
  createdBy: string,
  createdAt: Date,
): Promise<void> => {
  await sqlConnection("reconversion_compatibility_evaluations").insert({
    id: uuid(),
    created_by: createdBy,
    created_at: createdAt,
    project_creations: [],
  });
};

const insertLogin = async (sqlConnection: Knex, userId: string, createdAt: Date): Promise<void> => {
  await sqlConnection("domain_events").insert({
    id: uuid(),
    name: LOGIN_SUCCEEDED,
    payload: { userId, userEmail: `${userId}@test.fr`, method: "email-link" },
    created_at: createdAt,
  });
};

describe("SqlAdminStatsQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlAdminStatsQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlAdminStatsQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  describe("getTotals", () => {
    it("returns zeros when database is empty", async () => {
      const result = await query.getTotals();

      assert.deepStrictEqual(result, {
        users: 0,
        sites: 0,
        projects: 0,
        compatibilityEvaluations: 0,
      });
    });

    it("counts users, sites, projects and compatibility evaluations", async () => {
      const date = new Date("2026-01-10T10:00:00.000Z");
      const user1 = await insertUser(sqlConnection, date);
      const user2 = await insertUser(sqlConnection, date);
      const site1 = await insertSite(sqlConnection, user1, date);
      const site2 = await insertSite(sqlConnection, user1, date);
      await insertSite(sqlConnection, user2, date);
      await insertProject(sqlConnection, user1, site1, date);
      await insertProject(sqlConnection, user1, site2, date);
      await insertCompatibilityEvaluation(sqlConnection, user2, date);

      const result = await query.getTotals();

      assert.deepStrictEqual(result, {
        users: 2,
        sites: 3,
        projects: 2,
        compatibilityEvaluations: 1,
      });
    });
  });

  describe("getMonthlyCounts", () => {
    it("returns no counts when there is no activity since given date", async () => {
      const user = await insertUser(sqlConnection, new Date("2025-06-15T10:00:00.000Z"));
      await insertLogin(sqlConnection, user, new Date("2025-06-16T10:00:00.000Z"));

      const result = await query.getMonthlyCounts(new Date("2026-01-01T00:00:00.000Z"));

      assert.deepStrictEqual(result, {
        usersCreated: [],
        sitesCreated: [],
        projectsCreated: [],
        compatibilityEvaluationsCreated: [],
        logins: [],
      } satisfies AdminMonthlyCounts);
    });

    it("counts rows per metric and UTC month, ignoring rows before given date and non-login events", async () => {
      const user1 = await insertUser(sqlConnection, new Date("2025-12-31T23:30:00.000Z"));
      const user2 = await insertUser(sqlConnection, new Date("2026-01-01T00:30:00.000Z"));
      const user3 = await insertUser(sqlConnection, new Date("2026-01-20T10:00:00.000Z"));
      const site1 = await insertSite(sqlConnection, user2, new Date("2026-01-05T10:00:00.000Z"));
      const site2 = await insertSite(sqlConnection, user3, new Date("2026-03-05T10:00:00.000Z"));
      await insertProject(sqlConnection, user2, site1, new Date("2026-01-06T10:00:00.000Z"));
      await insertProject(sqlConnection, user3, site2, new Date("2026-03-06T10:00:00.000Z"));
      await insertProject(sqlConnection, user3, site2, new Date("2026-03-07T10:00:00.000Z"));
      await insertCompatibilityEvaluation(
        sqlConnection,
        user2,
        new Date("2026-03-08T10:00:00.000Z"),
      );
      await insertLogin(sqlConnection, user1, new Date("2025-12-31T23:59:00.000Z"));
      await insertLogin(sqlConnection, user2, new Date("2026-01-02T10:00:00.000Z"));
      await insertLogin(sqlConnection, user2, new Date("2026-01-03T10:00:00.000Z"));
      await insertLogin(sqlConnection, user3, new Date("2026-03-09T10:00:00.000Z"));
      await sqlConnection("domain_events").insert({
        id: uuid(),
        name: "user.login-attempted",
        payload: { method: "email-link" },
        created_at: new Date("2026-03-09T10:00:00.000Z"),
      });

      const result = await query.getMonthlyCounts(new Date("2026-01-01T00:00:00.000Z"));

      // order is not part of the contract
      const byMonth = (counts: MonthlyCount[]) =>
        counts.toSorted((a, b) => a.month.localeCompare(b.month));
      assert.deepStrictEqual(
        {
          usersCreated: byMonth(result.usersCreated),
          sitesCreated: byMonth(result.sitesCreated),
          projectsCreated: byMonth(result.projectsCreated),
          compatibilityEvaluationsCreated: byMonth(result.compatibilityEvaluationsCreated),
          logins: byMonth(result.logins),
        },
        {
          usersCreated: [{ month: "2026-01", count: 2 }],
          sitesCreated: [
            { month: "2026-01", count: 1 },
            { month: "2026-03", count: 1 },
          ],
          projectsCreated: [
            { month: "2026-01", count: 1 },
            { month: "2026-03", count: 2 },
          ],
          compatibilityEvaluationsCreated: [{ month: "2026-03", count: 1 }],
          logins: [
            { month: "2026-01", count: 2 },
            { month: "2026-03", count: 1 },
          ],
        } satisfies AdminMonthlyCounts,
      );
    });
  });
});
