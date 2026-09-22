import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import type { LifecycleEmailMessage } from "src/notifications/core/gateways/Mailer";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";

import { LifecycleEmailSender } from "./lifecycleEmailSender";

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
      },
    ]);
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
      },
    ]);
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
});
