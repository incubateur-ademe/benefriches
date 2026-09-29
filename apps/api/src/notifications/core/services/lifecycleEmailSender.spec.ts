import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import type { LifecycleEmailMessage } from "src/notifications/core/gateways/Mailer";
import {
  LIFECYCLE_EMAIL_MAX_ATTEMPTS,
  type LifecycleEmailDelivery,
} from "src/notifications/core/models/lifecycleEmail";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

import { LifecycleEmailSender, type RenderLifecycleEmailForRetry } from "./lifecycleEmailSender";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");

const buildMessage = (): LifecycleEmailMessage => ({
  to: "user@example.fr",
  subject: "Bienvenue chez Bénéfriches",
  html: "<p>hello</p>",
  text: "hello",
});

const setup = (options: { isEnabled: boolean }) => {
  const deliveries: LifecycleEmailDelivery[] = [];
  const deliveryRepository = new InMemoryLifecycleEmailDeliveryRepository(deliveries);
  const deliveryQuery = new InMemoryLifecycleEmailDeliveryQuery(deliveries);
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  const mailer = new FakeMailer();
  const dateProvider = new DeterministicDateProvider(fakeNow);
  const uidGenerator = new DeterministicUuidGenerator();
  uidGenerator.nextUuids("delivery-1");
  const sender = new LifecycleEmailSender(
    deliveryRepository,
    deliveryQuery,
    recipientQuery,
    mailer,
    dateProvider,
    uidGenerator,
    options.isEnabled,
  );
  return { sender, deliveries, recipientQuery, mailer };
};

describe("LifecycleEmailSender", () => {
  it("does not send and writes no row when the kill switch is off", async () => {
    const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: false });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);

    const outcome = await sender.send({
      userId: "user-1",
      emailType: "welcome",
      message: buildMessage(),
    });

    assert.strictEqual(outcome, "skipped-disabled");
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
  });

  it("does not send to an unsubscribed user", async () => {
    const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: new Date("2026-01-01") },
    ]);

    const outcome = await sender.send({
      userId: "user-1",
      emailType: "welcome",
      message: buildMessage(),
    });

    assert.strictEqual(outcome, "skipped-unsubscribed");
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
  });

  it("does not send a second time when a prior sent delivery exists for the same user, type and entity", async () => {
    const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);
    deliveries.push({
      id: "existing-delivery",
      userId: "user-1",
      emailType: "welcome",
      relatedEntityId: null,
      status: "sent",
      createdAt: fakeNow,
      sentAt: fakeNow,
      errorMessage: null,
      attempts: 1,
      lastAttemptedAt: fakeNow,
    });

    const outcome = await sender.send({
      userId: "user-1",
      emailType: "welcome",
      message: buildMessage(),
    });

    assert.strictEqual(outcome, "skipped-already-sent");
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.strictEqual(deliveries.length, 1);
  });

  it("does not retry when a prior failed delivery exists — a later sweeper owns retries", async () => {
    const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);
    deliveries.push({
      id: "existing-delivery",
      userId: "user-1",
      emailType: "welcome",
      relatedEntityId: null,
      status: "failed",
      createdAt: fakeNow,
      sentAt: null,
      errorMessage: "boom",
      attempts: 1,
      lastAttemptedAt: fakeNow,
    });

    const outcome = await sender.send({
      userId: "user-1",
      emailType: "welcome",
      message: buildMessage(),
    });

    assert.strictEqual(outcome, "skipped-already-sent");
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.strictEqual(deliveries.length, 1);
  });

  it("leaves exactly one sent row on a successful send", async () => {
    const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);
    const message = buildMessage();

    const outcome = await sender.send({ userId: "user-1", emailType: "welcome", message });

    assert.strictEqual(outcome, "sent");
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "sent",
        createdAt: fakeNow,
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
    assert.deepStrictEqual(mailer.sentEmails, [message]);
  });

  it("leaves exactly one failed row carrying the error, and does not throw, when the mailer fails", async () => {
    const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);
    mailer.simulateFailure("SMTP unreachable");

    const outcome = await sender.send({
      userId: "user-1",
      emailType: "welcome",
      message: buildMessage(),
    });

    assert.strictEqual(outcome, "failed");
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: fakeNow,
        sentAt: null,
        errorMessage: "SMTP unreachable",
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
  });

  it("sends independently per related entity", async () => {
    const { sender, deliveries, recipientQuery } = setup({ isEnabled: true });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);
    deliveries.push({
      id: "existing-delivery",
      userId: "user-1",
      emailType: "welcome",
      relatedEntityId: "site-a",
      status: "sent",
      createdAt: fakeNow,
      sentAt: fakeNow,
      errorMessage: null,
      attempts: 1,
      lastAttemptedAt: fakeNow,
    });

    const outcome = await sender.send({
      userId: "user-1",
      emailType: "welcome",
      relatedEntityId: "site-b",
      message: buildMessage(),
    });

    assert.strictEqual(outcome, "sent");
    assert.strictEqual(deliveries.length, 2);
  });

  describe("retry", () => {
    const aDayBefore = new Date("2025-12-31T10:00:00.000Z");
    const renderForRecipient: RenderLifecycleEmailForRetry = (recipient) =>
      Promise.resolve({ ...buildMessage(), to: recipient.email });

    it("sends a failed delivery and marks it sent on the same row", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, renderForRecipient);

      assert.strictEqual(outcome, "sent");
      assert.deepStrictEqual(mailer.sentEmails, [{ ...buildMessage(), to: "user@example.fr" }]);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "welcome",
          relatedEntityId: null,
          status: "sent",
          createdAt: aDayBefore,
          sentAt: fakeNow,
          errorMessage: "SMTP down",
          attempts: 2,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("marks the row failed with the new error and one more attempt when the mailer throws below the cap", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      mailer.simulateFailure("Connection timeout");
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, renderForRecipient);

      assert.strictEqual(outcome, "failed");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "welcome",
          relatedEntityId: null,
          status: "failed",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Connection timeout",
          attempts: 2,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("abandons the delivery when the last allowed attempt fails", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      mailer.simulateFailure("Mailbox unavailable");
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: LIFECYCLE_EMAIL_MAX_ATTEMPTS - 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, renderForRecipient);

      assert.strictEqual(outcome, "abandoned");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "welcome",
          relatedEntityId: null,
          status: "abandoned",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Mailbox unavailable",
          attempts: LIFECYCLE_EMAIL_MAX_ATTEMPTS,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("abandons a pending row stranded at the cap without rendering or sending", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      const render = mock.fn(renderForRecipient);
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "pending",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: LIFECYCLE_EMAIL_MAX_ATTEMPTS,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, render);

      assert.strictEqual(outcome, "abandoned");
      assert.strictEqual(render.mock.callCount(), 0);
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "welcome",
          relatedEntityId: null,
          status: "abandoned",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Stranded in pending after the last allowed attempt",
          attempts: LIFECYCLE_EMAIL_MAX_ATTEMPTS,
          lastAttemptedAt: aDayBefore,
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("counts a render error as a failed attempt", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, () =>
        Promise.reject(new Error("Site not found")),
      );

      assert.strictEqual(outcome, "failed");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "welcome",
          relatedEntityId: null,
          status: "failed",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Site not found",
          attempts: 2,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
    });

    it("does nothing when the kill switch is off", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: false });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, renderForRecipient);

      assert.strictEqual(outcome, "skipped-disabled");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [delivery]);
    });

    it("skips a recipient who has unsubscribed since the failure", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "user@example.fr",
          unsubscribedAt: new Date("2025-12-31T12:00:00.000Z"),
        },
      ]);
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, renderForRecipient);

      assert.strictEqual(outcome, "skipped-unsubscribed");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [delivery]);
    });

    it("skips a delivery whose recipient no longer exists", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([]);
      const delivery: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      };
      deliveries.push({ ...delivery });

      const outcome = await sender.retry(delivery, renderForRecipient);

      assert.strictEqual(outcome, "skipped-recipient-not-found");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [delivery]);
    });

    it("skips a delivery another run has already claimed", async () => {
      const { sender, deliveries, recipientQuery, mailer } = setup({ isEnabled: true });
      recipientQuery._setRecipients([
        { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
      ]);
      const claimedByAnotherRun: LifecycleEmailDelivery = {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "pending",
        createdAt: aDayBefore,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 2,
        lastAttemptedAt: fakeNow,
      };
      deliveries.push({ ...claimedByAnotherRun });

      const outcome = await sender.retry(
        { ...claimedByAnotherRun, status: "failed", attempts: 1, lastAttemptedAt: aDayBefore },
        renderForRecipient,
      );

      assert.strictEqual(outcome, "skipped-already-claimed");
      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [claimedByAnotherRun]);
    });
  });
});
