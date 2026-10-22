import knex, { type Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { v4 as uuid } from "uuid";

import type {
  AdminUserLifecycleEmailDeliveryRecord,
  AdminUserRecord,
} from "src/admin/core/models/adminUserReadModel";
import { LOGIN_SUCCEEDED } from "src/auth/core/events/loginSucceeded.event";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";

import { SqlAdminUsersQuery } from "./SqlAdminUsersQuery";

type UserInsert = {
  id: string;
  email: string;
  firstname?: string;
  lastname?: string;
  structure_name?: string;
  structure_type?: string;
  structure_activity?: string;
  subscribed_to_newsletter?: boolean;
  lifecycle_emails_unsubscribed_at?: Date;
  created_at: Date;
};

const insertUser = async (sqlConnection: Knex, user: UserInsert): Promise<void> => {
  await sqlConnection("users").insert({
    structure_activity: "urban_planner",
    structure_type: "company",
    personal_data_storage_consented_at: user.created_at,
    ...user,
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

type LifecycleEmailDeliveryInsert = {
  user_id: string;
  email_type: string;
  related_entity_id?: string;
  status: string;
  created_at: Date;
  sent_at?: Date;
  error_message?: string;
  attempts: number;
  last_attempted_at: Date;
};

const insertLifecycleEmailDelivery = async (
  sqlConnection: Knex,
  row: LifecycleEmailDeliveryInsert,
): Promise<void> => {
  await sqlConnection("lifecycle_email_deliveries").insert({ id: uuid(), ...row });
};

describe("SqlAdminUsersQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlAdminUsersQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlAdminUsersQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  describe("list", () => {
    it("returns users ordered by creation date desc with their last login date", async () => {
      const oldestUserId = uuid();
      const newestUserId = uuid();
      await insertUser(sqlConnection, {
        id: oldestUserId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
        structure_type: "municipality",
        structure_activity: "local_authority",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertUser(sqlConnection, {
        id: newestUserId,
        email: "john@company.fr",
        created_at: new Date("2026-02-01T08:00:00.000Z"),
      });
      await insertLogin(sqlConnection, oldestUserId, new Date("2026-01-02T09:00:00.000Z"));
      await insertLogin(sqlConnection, oldestUserId, new Date("2026-01-20T09:00:00.000Z"));
      await insertLogin(sqlConnection, oldestUserId, new Date("2026-01-10T09:00:00.000Z"));

      const result = await query.list({ page: 1, pageSize: 25 });

      assert.deepStrictEqual(result, {
        total: 2,
        users: [
          {
            id: newestUserId,
            email: "john@company.fr",
            firstName: null,
            lastName: null,
            structureName: null,
            structureType: "company",
            structureActivity: "urban_planner",
            createdAt: new Date("2026-02-01T08:00:00.000Z"),
            lastLoginAt: null,
          },
          {
            id: oldestUserId,
            email: "jane@collectivite.fr",
            firstName: "Jane",
            lastName: "Doe",
            structureName: "Mairie de Blajan",
            structureType: "municipality",
            structureActivity: "local_authority",
            createdAt: new Date("2026-01-01T08:00:00.000Z"),
            lastLoginAt: new Date("2026-01-20T09:00:00.000Z"),
          },
        ],
      });
    });

    it("paginates results and reports total count of all matching users", async () => {
      const user1 = uuid();
      const user2 = uuid();
      const user3 = uuid();
      await insertUser(sqlConnection, {
        id: user1,
        email: "u1@test.fr",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertUser(sqlConnection, {
        id: user2,
        email: "u2@test.fr",
        created_at: new Date("2026-01-02T08:00:00.000Z"),
      });
      await insertUser(sqlConnection, {
        id: user3,
        email: "u3@test.fr",
        created_at: new Date("2026-01-03T08:00:00.000Z"),
      });

      const result = await query.list({ page: 2, pageSize: 2 });

      assert.strictEqual(result.total, 3);
      assert.deepStrictEqual(
        result.users.map((user) => user.id),
        [user1],
      );
    });

    it("returns each user exactly once across pages when users share a creation date", async () => {
      const firstUserId = "00000000-0000-4000-8000-000000000001";
      const secondUserId = "00000000-0000-4000-8000-000000000002";
      await insertUser(sqlConnection, {
        id: firstUserId,
        email: "u1@test.fr",
        created_at: new Date("2026-01-10T10:00:00.000Z"),
      });
      await insertUser(sqlConnection, {
        id: secondUserId,
        email: "u2@test.fr",
        created_at: new Date("2026-01-10T10:00:00.000Z"),
      });

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
        await insertUser(sqlConnection, {
          id: matchingUserId,
          email: "jane@collectivite.fr",
          firstname: "Jane",
          lastname: "Doe",
          structure_name: "Mairie de Blajan",
          created_at: new Date("2026-01-01T08:00:00.000Z"),
        });
        await insertUser(sqlConnection, {
          id: uuid(),
          email: "john@company.fr",
          firstname: "John",
          lastname: "Smith",
          structure_name: "UrbanPlanning Inc.",
          created_at: new Date("2026-01-02T08:00:00.000Z"),
        });

        const result = await query.list({ search, page: 1, pageSize: 25 });

        assert.strictEqual(result.total, 1);
        assert.deepStrictEqual(
          result.users.map((user) => user.id),
          [matchingUserId],
        );
      });
    }
  });

  describe("getUserActivity", () => {
    it("returns undefined when user does not exist", async () => {
      const result = await query.getUserActivity(uuid());

      assert.strictEqual(result, undefined);
    });

    it("returns user record with login dates, sites, projects and compatibility evaluations created by user", async () => {
      const userId = uuid();
      const otherUserId = uuid();
      await insertUser(sqlConnection, {
        id: userId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
        structure_type: "municipality",
        structure_activity: "local_authority",
        subscribed_to_newsletter: true,
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertUser(sqlConnection, {
        id: otherUserId,
        email: "john@company.fr",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertLogin(sqlConnection, userId, new Date("2026-01-20T09:00:00.000Z"));
      await insertLogin(sqlConnection, userId, new Date("2026-01-02T09:00:00.000Z"));
      await insertLogin(sqlConnection, otherUserId, new Date("2026-01-03T09:00:00.000Z"));

      const siteId = uuid();
      const otherUserSiteId = uuid();
      await sqlConnection("sites").insert([
        {
          id: siteId,
          created_by: userId,
          name: "Friche industrielle",
          nature: "FRICHE",
          surface_area: 1000,
          owner_structure_type: "company",
          creation_mode: "custom",
          status: "active",
          created_at: new Date("2026-01-03T10:00:00.000Z"),
          updated_at: new Date("2026-01-10T10:00:00.000Z"),
        },
        {
          id: otherUserSiteId,
          created_by: otherUserId,
          name: "Site d'un autre utilisateur",
          nature: "FRICHE",
          surface_area: 1000,
          owner_structure_type: "company",
          creation_mode: "express",
          created_at: new Date("2026-01-03T10:00:00.000Z"),
        },
      ]);

      const projectId = uuid();
      await sqlConnection("reconversion_projects").insert([
        {
          id: projectId,
          created_by: userId,
          name: "Centrale PV",
          related_site_id: siteId,
          creation_mode: "express",
          status: "archived",
          created_at: new Date("2026-01-05T10:00:00.000Z"),
          updated_at: null,
        },
        {
          id: uuid(),
          created_by: otherUserId,
          name: "Projet d'un autre utilisateur",
          related_site_id: otherUserSiteId,
          creation_mode: "express",
          created_at: new Date("2026-01-05T10:00:00.000Z"),
        },
      ]);

      const evaluationId = uuid();
      await sqlConnection("reconversion_compatibility_evaluations").insert([
        {
          id: evaluationId,
          created_by: userId,
          related_site_id: siteId,
          status: "completed",
          created_at: new Date("2026-01-07T10:00:00.000Z"),
          completed_at: new Date("2026-01-08T10:00:00.000Z"),
          project_creations: [],
        },
        {
          id: uuid(),
          created_by: otherUserId,
          created_at: new Date("2026-01-07T10:00:00.000Z"),
          project_creations: [],
        },
      ]);

      const result = await query.getUserActivity(userId);

      assert.deepStrictEqual(result, {
        user: {
          id: userId,
          email: "jane@collectivite.fr",
          firstName: "Jane",
          lastName: "Doe",
          structureName: "Mairie de Blajan",
          structureType: "municipality",
          structureActivity: "local_authority",
          subscribedToNewsletter: true,
          lifecycleEmailsUnsubscribedAt: null,
          createdAt: new Date("2026-01-01T08:00:00.000Z"),
        },
        loginDates: [new Date("2026-01-02T09:00:00.000Z"), new Date("2026-01-20T09:00:00.000Z")],
        sites: [
          {
            id: siteId,
            name: "Friche industrielle",
            nature: "FRICHE",
            creationMode: "custom",
            status: "active",
            createdAt: new Date("2026-01-03T10:00:00.000Z"),
            updatedAt: new Date("2026-01-10T10:00:00.000Z"),
          },
        ],
        projects: [
          {
            id: projectId,
            name: "Centrale PV",
            siteId,
            creationMode: "express",
            status: "archived",
            createdAt: new Date("2026-01-05T10:00:00.000Z"),
            updatedAt: null,
          },
        ],
        compatibilityEvaluations: [
          {
            id: evaluationId,
            siteId,
            status: "completed",
            createdAt: new Date("2026-01-07T10:00:00.000Z"),
            completedAt: new Date("2026-01-08T10:00:00.000Z"),
          },
        ],
        lifecycleEmailDeliveries: [],
      });
    });

    it("returns the user's lifecycle email deliveries with the related site or project name", async () => {
      const userId = uuid();
      const otherUserId = uuid();
      await insertUser(sqlConnection, {
        id: userId,
        email: "jane@collectivite.fr",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertUser(sqlConnection, {
        id: otherUserId,
        email: "john@company.fr",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      const siteId = uuid();
      await sqlConnection("sites").insert({
        id: siteId,
        created_by: userId,
        name: "Friche Duval",
        nature: "FRICHE",
        surface_area: 1000,
        owner_structure_type: "company",
        creation_mode: "custom",
        created_at: new Date("2026-01-02T10:00:00.000Z"),
      });
      const projectId = uuid();
      await sqlConnection("reconversion_projects").insert({
        id: projectId,
        created_by: userId,
        name: "Parking Sud",
        related_site_id: siteId,
        creation_mode: "express",
        created_at: new Date("2026-01-03T10:00:00.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "welcome",
        status: "sent",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
        sent_at: new Date("2026-01-01T08:01:00.000Z"),
        attempts: 1,
        last_attempted_at: new Date("2026-01-01T08:00:30.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "first-project-reminder",
        related_entity_id: siteId,
        status: "sent",
        created_at: new Date("2026-01-04T10:00:00.000Z"),
        sent_at: new Date("2026-01-04T10:01:00.000Z"),
        attempts: 1,
        last_attempted_at: new Date("2026-01-04T10:00:30.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "project-impacts-summary",
        related_entity_id: projectId,
        status: "failed",
        created_at: new Date("2026-01-05T10:00:00.000Z"),
        error_message: "Connection timeout",
        attempts: 2,
        last_attempted_at: new Date("2026-01-05T11:00:00.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "first-site-reminder",
        status: "pending",
        created_at: new Date("2026-01-06T10:00:00.000Z"),
        attempts: 0,
        last_attempted_at: new Date("2026-01-06T10:00:00.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: otherUserId,
        email_type: "welcome",
        status: "sent",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
        sent_at: new Date("2026-01-01T08:01:00.000Z"),
        attempts: 1,
        last_attempted_at: new Date("2026-01-01T08:00:30.000Z"),
      });

      const result = await query.getUserActivity(userId);

      assert.deepStrictEqual(result?.lifecycleEmailDeliveries, [
        {
          emailType: "welcome",
          status: "sent",
          relatedEntityName: null,
          sentAt: new Date("2026-01-01T08:01:00.000Z"),
          lastAttemptedAt: new Date("2026-01-01T08:00:30.000Z"),
          attempts: 1,
          errorMessage: null,
        },
        {
          emailType: "first-project-reminder",
          status: "sent",
          relatedEntityName: "Friche Duval",
          sentAt: new Date("2026-01-04T10:01:00.000Z"),
          lastAttemptedAt: new Date("2026-01-04T10:00:30.000Z"),
          attempts: 1,
          errorMessage: null,
        },
        {
          emailType: "project-impacts-summary",
          status: "failed",
          relatedEntityName: "Parking Sud",
          sentAt: null,
          lastAttemptedAt: new Date("2026-01-05T11:00:00.000Z"),
          attempts: 2,
          errorMessage: "Connection timeout",
        },
        {
          emailType: "first-site-reminder",
          status: "pending",
          relatedEntityName: null,
          sentAt: null,
          lastAttemptedAt: new Date("2026-01-06T10:00:00.000Z"),
          attempts: 0,
          errorMessage: null,
        },
      ] satisfies AdminUserLifecycleEmailDeliveryRecord[]);
    });

    it("returns a null related entity name when the site or project no longer exists", async () => {
      const userId = uuid();
      await insertUser(sqlConnection, {
        id: userId,
        email: "jane@collectivite.fr",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "project-impacts-summary",
        related_entity_id: uuid(),
        status: "sent",
        created_at: new Date("2026-01-05T10:00:00.000Z"),
        sent_at: new Date("2026-01-05T10:01:00.000Z"),
        attempts: 1,
        last_attempted_at: new Date("2026-01-05T10:00:30.000Z"),
      });

      const result = await query.getUserActivity(userId);

      assert.deepStrictEqual(result?.lifecycleEmailDeliveries, [
        {
          emailType: "project-impacts-summary",
          status: "sent",
          relatedEntityName: null,
          sentAt: new Date("2026-01-05T10:01:00.000Z"),
          lastAttemptedAt: new Date("2026-01-05T10:00:30.000Z"),
          attempts: 1,
          errorMessage: null,
        },
      ] satisfies AdminUserLifecycleEmailDeliveryRecord[]);
    });

    it("ignores lifecycle email deliveries with an unknown status", async () => {
      const userId = uuid();
      await insertUser(sqlConnection, {
        id: userId,
        email: "jane@collectivite.fr",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "welcome",
        status: "sent",
        created_at: new Date("2026-01-01T08:00:00.000Z"),
        sent_at: new Date("2026-01-01T08:01:00.000Z"),
        attempts: 1,
        last_attempted_at: new Date("2026-01-01T08:00:30.000Z"),
      });
      await insertLifecycleEmailDelivery(sqlConnection, {
        user_id: userId,
        email_type: "first-site-reminder",
        status: "bounced",
        created_at: new Date("2026-01-02T08:00:00.000Z"),
        attempts: 1,
        last_attempted_at: new Date("2026-01-02T08:00:30.000Z"),
      });

      const result = await query.getUserActivity(userId);

      assert.deepStrictEqual(result?.lifecycleEmailDeliveries, [
        {
          emailType: "welcome",
          status: "sent",
          relatedEntityName: null,
          sentAt: new Date("2026-01-01T08:01:00.000Z"),
          lastAttemptedAt: new Date("2026-01-01T08:00:30.000Z"),
          attempts: 1,
          errorMessage: null,
        },
      ] satisfies AdminUserLifecycleEmailDeliveryRecord[]);
    });

    it("returns the user's lifecycle emails unsubscribe date", async () => {
      const userId = uuid();
      await insertUser(sqlConnection, {
        id: userId,
        email: "jane@collectivite.fr",
        firstname: "Jane",
        lastname: "Doe",
        structure_name: "Mairie de Blajan",
        structure_type: "municipality",
        structure_activity: "local_authority",
        subscribed_to_newsletter: false,
        lifecycle_emails_unsubscribed_at: new Date("2026-02-01T12:00:00.000Z"),
        created_at: new Date("2026-01-01T08:00:00.000Z"),
      });

      const result = await query.getUserActivity(userId);

      assert.deepStrictEqual(result?.user, {
        id: userId,
        email: "jane@collectivite.fr",
        firstName: "Jane",
        lastName: "Doe",
        structureName: "Mairie de Blajan",
        structureType: "municipality",
        structureActivity: "local_authority",
        subscribedToNewsletter: false,
        lifecycleEmailsUnsubscribedAt: new Date("2026-02-01T12:00:00.000Z"),
        createdAt: new Date("2026-01-01T08:00:00.000Z"),
      } satisfies AdminUserRecord);
    });
  });
});
