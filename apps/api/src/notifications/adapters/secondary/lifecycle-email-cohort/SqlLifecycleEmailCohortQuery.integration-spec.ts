import { addHours, subHours } from "date-fns";
import knex, { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, describe, it } from "node:test";
import { siteCreationModeSchema, type SiteCreationMode } from "shared";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import type { FirstSiteReminderRecipient } from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import {
  lifecycleEmailDeliveryStatusSchema,
  type LifecycleEmailDeliveryStatus,
  type LifecycleEmailType,
} from "src/notifications/core/models/lifecycleEmail";
import { computeReminderWindow } from "src/notifications/core/models/reminderWindow";
import knexConfig from "src/shared-kernel/adapters/sql-knex/knexConfig";
import { UserBuilder } from "src/users/core/model/user.mock";

import { SqlLifecycleEmailCohortQuery } from "./SqlLifecycleEmailCohortQuery";

const fakeNow = new Date("2026-01-15T08:00:00.000Z");
const window = computeReminderWindow(fakeNow);
const hoursBeforeNow = (hours: number) => subHours(fakeNow, hours);

describe("SqlLifecycleEmailCohortQuery integration", () => {
  let sqlConnection: Knex;
  let query: SqlLifecycleEmailCohortQuery;

  before(() => {
    sqlConnection = knex(knexConfig);
    query = new SqlLifecycleEmailCohortQuery(sqlConnection);
  });

  after(async () => {
    await sqlConnection.destroy();
  });

  const insertUser = async (options: {
    email: string;
    createdAt: Date;
    unsubscribedAt?: Date | null;
    firstname?: string | null;
    lastname?: string | null;
  }): Promise<string> => {
    const userId = uuid();
    const user = new UserBuilder().withId(userId).withEmail(options.email).build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      created_at: options.createdAt,
      lifecycle_emails_unsubscribed_at: options.unsubscribedAt ?? null,
      firstname: options.firstname === undefined ? "Grégoire" : options.firstname,
      lastname: options.lastname === undefined ? "Bailleux" : options.lastname,
    });
    return userId;
  };

  const insertSite = async (options: {
    createdBy: string;
    creationMode: SiteCreationMode;
    status: "active" | "archived";
  }) => {
    await sqlConnection("sites").insert({
      id: uuid(),
      created_by: options.createdBy,
      name: "Friche de Blajan",
      nature: "FRICHE",
      surface_area: 15000,
      owner_structure_type: "company",
      creation_mode: options.creationMode,
      status: options.status,
      created_at: hoursBeforeNow(12),
    });
  };

  const insertDelivery = async (options: {
    userId: string;
    emailType: LifecycleEmailType;
    status: LifecycleEmailDeliveryStatus;
  }) => {
    await sqlConnection("lifecycle_email_deliveries").insert({
      id: uuid(),
      user_id: options.userId,
      email_type: options.emailType,
      related_entity_id: null,
      status: options.status,
      created_at: hoursBeforeNow(1),
      sent_at: options.status === "sent" ? hoursBeforeNow(1) : null,
      error_message: null,
      attempts: 1,
      last_attempted_at: hoursBeforeNow(1),
    });
  };

  describe("findFirstSiteReminderRecipients", () => {
    it("returns a user registered 36 hours ago with no site, mapped to the recipient shape", async () => {
      const userId = await insertUser({
        email: "gregoire.bailleux@example.fr",
        createdAt: hoursBeforeNow(36),
      });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(result, [
        {
          userId,
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          registeredAt: hoursBeforeNow(36),
        },
      ] satisfies FirstSiteReminderRecipient[]);
    });

    it("excludes a user registered less than 24 hours ago", async () => {
      await insertUser({ email: "recent@example.fr", createdAt: hoursBeforeNow(12) });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(result, []);
    });

    it("excludes a user registered more than 72 hours ago", async () => {
      await insertUser({ email: "old@example.fr", createdAt: hoursBeforeNow(73) });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(result, []);
    });

    it("includes a user registered exactly 24 hours ago", async () => {
      const userId = await insertUser({
        email: "exactly24@example.fr",
        createdAt: hoursBeforeNow(24),
      });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(
        result.map((recipient) => recipient.userId),
        [userId],
      );
    });

    it("excludes a user registered exactly 72 hours ago", async () => {
      await insertUser({ email: "exactly72@example.fr", createdAt: hoursBeforeNow(72) });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(result, []);
    });

    it("still returns a user registered 60 hours ago, so a missed run is caught up", async () => {
      const userId = await insertUser({
        email: "missed@example.fr",
        createdAt: hoursBeforeNow(60),
      });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(
        result.map((recipient) => recipient.userId),
        [userId],
      );
    });

    it("returns a user too recent today in the next morning's window", async () => {
      const userId = await insertUser({
        email: "gregoire.bailleux@example.fr",
        createdAt: hoursBeforeNow(12),
      });

      const today = await query.findFirstSiteReminderRecipients(window);
      const nextMorning = await query.findFirstSiteReminderRecipients(
        computeReminderWindow(addHours(fakeNow, 24)),
      );

      assert.deepStrictEqual(today, []);
      assert.deepStrictEqual(nextMorning, [
        {
          userId,
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          registeredAt: hoursBeforeNow(12),
        },
      ] satisfies FirstSiteReminderRecipient[]);
    });

    describe("any site suppresses the reminder", () => {
      for (const creationMode of siteCreationModeSchema.options) {
        it(`excludes a user with a ${creationMode} site`, async () => {
          const userId = await insertUser({
            email: "with-site@example.fr",
            createdAt: hoursBeforeNow(36),
          });
          await insertSite({ createdBy: userId, creationMode, status: "active" });

          const result = await query.findFirstSiteReminderRecipients(window);

          assert.deepStrictEqual(result, []);
        });
      }

      it("excludes a user whose only site is archived", async () => {
        const userId = await insertUser({
          email: "archived-site@example.fr",
          createdAt: hoursBeforeNow(36),
        });
        await insertSite({ createdBy: userId, creationMode: "custom", status: "archived" });

        const result = await query.findFirstSiteReminderRecipients(window);

        assert.deepStrictEqual(result, []);
      });

      it("ignores sites created by other users", async () => {
        const userWithoutSiteId = await insertUser({
          email: "no-site@example.fr",
          createdAt: hoursBeforeNow(36),
        });
        const otherUserId = await insertUser({
          email: "other@example.fr",
          createdAt: hoursBeforeNow(200),
        });
        await insertSite({ createdBy: otherUserId, creationMode: "custom", status: "active" });

        const result = await query.findFirstSiteReminderRecipients(window);

        assert.deepStrictEqual(
          result.map((recipient) => recipient.userId),
          [userWithoutSiteId],
        );
      });
    });

    describe("an existing first site reminder excludes, whatever its status", () => {
      for (const status of lifecycleEmailDeliveryStatusSchema.options) {
        it(`excludes a user with a ${status} first site reminder`, async () => {
          const userId = await insertUser({
            email: "already@example.fr",
            createdAt: hoursBeforeNow(36),
          });
          await insertDelivery({ userId, emailType: "first-site-reminder", status });

          const result = await query.findFirstSiteReminderRecipients(window);

          assert.deepStrictEqual(result, []);
        });
      }

      it("ignores ledger rows of other email types", async () => {
        const userId = await insertUser({
          email: "welcomed@example.fr",
          createdAt: hoursBeforeNow(36),
        });
        await insertDelivery({ userId, emailType: "welcome", status: "sent" });

        const result = await query.findFirstSiteReminderRecipients(window);

        assert.deepStrictEqual(
          result.map((recipient) => recipient.userId),
          [userId],
        );
      });
    });

    it("excludes a user who unsubscribed", async () => {
      await insertUser({
        email: "unsubscribed@example.fr",
        createdAt: hoursBeforeNow(36),
        unsubscribedAt: hoursBeforeNow(30),
      });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(result, []);
    });

    it("maps missing names to null", async () => {
      const userId = await insertUser({
        email: "legacy@example.fr",
        createdAt: hoursBeforeNow(36),
        firstname: null,
        lastname: null,
      });

      const result = await query.findFirstSiteReminderRecipients(window);

      assert.deepStrictEqual(result, [
        {
          userId,
          email: "legacy@example.fr",
          firstName: null,
          lastName: null,
          registeredAt: hoursBeforeNow(36),
        },
      ] satisfies FirstSiteReminderRecipient[]);
    });
  });
});
