import { NestExpressApplication } from "@nestjs/platform-express";
import type { Knex } from "knex";
import assert from "node:assert/strict";
import { after, before, beforeEach, describe, it } from "node:test";
import request from "supertest";
import { createTestApp } from "test/testApp";
import { v4 as uuid } from "uuid";

import { mapUserToSqlRow } from "src/auth/adapters/user-repository/SqlUserRepository";
import { createUserAccountCreatedEvent } from "src/auth/core/events/userAccountCreated.event";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { UserBuilder } from "src/users/core/model/user.mock";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");

// Flips a middle character of the signature: the last base64url character of a 32-byte HMAC
// carries unused bits, so changing it may decode to the same bytes.
const tamperSignature = (token: string): string => {
  const [version, id, signature = ""] = token.split(".");
  const index = Math.floor(signature.length / 2);
  const replacement = signature[index] === "A" ? "B" : "A";
  return `${version}.${id}.${signature.slice(0, index)}${replacement}${signature.slice(index + 1)}`;
};

// No test sends an access-token cookie: every success case also proves the route is outside
// the authentication guard.
describe("NotificationsController integration test", () => {
  // One app for the whole suite: the SqlConnectionModule's Knex pool is a process-wide
  // singleton, so closing an app between tests would tear it down for sibling tests.
  let fakeMailer: FakeMailer;
  let app: NestExpressApplication;
  let sqlConnection: Knex;
  let tokenService: HmacUnsubscribeTokenService;

  before(async () => {
    fakeMailer = new FakeMailer();

    app = await createTestApp({
      providerOverrides: [
        { token: SmtpMailer, useValue: fakeMailer },
        { token: RealDateProvider, useValue: new DeterministicDateProvider(fakeNow) },
      ],
    });
    await app.init();

    sqlConnection = app.get(SqlConnection);
    tokenService = app.get(HmacUnsubscribeTokenService);
  });

  beforeEach(() => {
    fakeMailer._reset();
  });

  after(async () => {
    await app.close();
  });

  const insertUser = async (unsubscribedAt: Date | null) => {
    const user = new UserBuilder().withId(uuid()).withEmail("john.doe@example.com").build();
    await sqlConnection("users").insert({
      ...mapUserToSqlRow(user),
      lifecycle_emails_unsubscribed_at: unsubscribedAt,
    });
    return user;
  };

  const getUnsubscribedAt = async (userId: string) => {
    const row = await sqlConnection("users")
      .select("lifecycle_emails_unsubscribed_at")
      .where("id", userId)
      .first();
    return row?.lifecycle_emails_unsubscribed_at;
  };

  const countUsers = async () => {
    const result = await sqlConnection.raw<{ rows: { count: number }[] }>(
      "SELECT COUNT(*)::int AS count FROM users",
    );
    return result.rows[0]?.count;
  };

  const publishAccountCreated = async (userId: string) => {
    await app.get(RealEventPublisher).publish(
      createUserAccountCreatedEvent("event-1", {
        userId,
        userEmail: "john.doe@example.com",
        userFirstName: "John",
        userLastName: "Doe",
        subscribedToNewsletter: false,
      }),
    );
  };

  describe("POST /api/lifecycle-emails/unsubscribe", () => {
    it("unsubscribes through the link in the welcome email, without being logged in", async () => {
      const user = await insertUser(null);
      await publishAccountCreated(user.id);
      const sentText = fakeMailer.sentEmails[0]?.text ?? "";
      const token = /\/emails\/desinscription\?token=(\S+)/.exec(sentText)?.[1];
      assert.ok(token, "the welcome email should contain an unsubscribe link");

      const response = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token });

      assert.strictEqual(response.status, 204);
      assert.deepStrictEqual(await getUnsubscribedAt(user.id), fakeNow);
    });

    it("returns the same success when the same link is used twice", async () => {
      const user = await insertUser(null);
      const token = tokenService.sign(user.id);

      const first = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token });
      const second = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token });

      assert.strictEqual(first.status, 204);
      assert.strictEqual(second.status, 204);
      assert.deepStrictEqual(await getUnsubscribedAt(user.id), fakeNow);
    });

    it("stores one lifecycle-emails.unsubscribed event, even when the link is used twice", async () => {
      const user = await insertUser(null);
      const token = tokenService.sign(user.id);

      await request(app.getHttpServer()).post("/api/lifecycle-emails/unsubscribe").send({ token });
      await request(app.getHttpServer()).post("/api/lifecycle-emails/unsubscribe").send({ token });

      assert.deepStrictEqual(
        await sqlConnection("domain_events")
          .select("name", "payload")
          .where("name", "lifecycle-emails.unsubscribed"),
        [{ name: "lifecycle-emails.unsubscribed", payload: { userId: user.id } }],
      );
    });

    it("keeps the original unsubscribe date on a repeated use", async () => {
      const firstUnsubscribedAt = new Date("2025-06-01T08:00:00.000Z");
      const user = await insertUser(firstUnsubscribedAt);

      const response = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token: tokenService.sign(user.id) });

      assert.strictEqual(response.status, 204);
      assert.deepStrictEqual(await getUnsubscribedAt(user.id), firstUnsubscribedAt);
    });

    it("rejects a tampered token and leaves the user subscribed", async () => {
      const user = await insertUser(null);

      const response = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token: tamperSignature(tokenService.sign(user.id)) });

      assert.strictEqual(response.status, 400);
      assert.deepStrictEqual(response.body, {
        error: "INVALID_UNSUBSCRIBE_TOKEN",
        message: "Invalid unsubscribe token",
      });
      assert.strictEqual(await getUnsubscribedAt(user.id), null);
    });

    it("rejects a request without a token", async () => {
      const response = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({});

      assert.strictEqual(response.status, 400);
      const errors = (response.body as { errors: { path: string[] }[] }).errors;
      assert.ok(errors.some((error) => error.path.join(".") === "token"));
    });

    it("stops every later lifecycle email once unsubscribed", async () => {
      const user = await insertUser(null);
      const unsubscribeResponse = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token: tokenService.sign(user.id) });
      assert.strictEqual(unsubscribeResponse.status, 204);

      await publishAccountCreated(user.id);

      assert.strictEqual(fakeMailer.sentEmails.length, 0);
      const deliveries = await sqlConnection("lifecycle_email_deliveries").where(
        "user_id",
        user.id,
      );
      assert.strictEqual(deliveries.length, 0);
    });

    it("accepts a valid link for a deleted account without creating anything", async () => {
      const usersCountBefore = await countUsers();

      const response = await request(app.getHttpServer())
        .post("/api/lifecycle-emails/unsubscribe")
        .send({ token: tokenService.sign(uuid()) });

      assert.strictEqual(response.status, 204);
      assert.strictEqual(await countUsers(), usersCountBefore);
    });
  });
});
