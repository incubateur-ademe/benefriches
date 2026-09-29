import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import type { FailureResult, SuccessResult } from "src/shared-kernel/result";

import { SendWelcomeEmailUseCase } from "./sendWelcomeEmail.usecase";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");
const webappUrl = "http://app.test.benefriches.fr";
const userId = "8d3b6a3e-5f1c-4b8e-9a7d-2c1e0f4b6a90";
const tokenService = new HmacUnsubscribeTokenService("unsubscribe-secret-for-tests");

const setup = () => {
  const deliveries: LifecycleEmailDelivery[] = [];
  const deliveryRepository = new InMemoryLifecycleEmailDeliveryRepository(deliveries);
  const deliveryQuery = new InMemoryLifecycleEmailDeliveryQuery(deliveries);
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  recipientQuery._setRecipients([
    { id: userId, email: "a@b.fr", firstName: "John", lastName: "Doe", unsubscribedAt: null },
  ]);
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
    true,
  );
  const usecase = new SendWelcomeEmailUseCase(sender, webappUrl, tokenService);
  return { usecase, deliveries, mailer };
};

describe("SendWelcomeEmail UseCase", () => {
  it("sends the welcome email and returns a sent outcome", async () => {
    const { usecase, deliveries, mailer } = setup();

    const result = await usecase.execute({ userId, userEmail: "a@b.fr" });

    assert.strictEqual(result.isSuccess(), true);
    assert.deepStrictEqual((result as SuccessResult<{ outcome: string }>).getData(), {
      outcome: "sent",
    });
    assert.strictEqual(deliveries.length, 1);
    assert.strictEqual(deliveries[0]?.status, "sent");
    assert.strictEqual(mailer.sentEmails.length, 1);
    assert.strictEqual(mailer.sentEmails[0]?.to, "a@b.fr");
    assert.strictEqual(mailer.sentEmails[0]?.subject, "Bienvenue chez Bénéfriches");
  });

  it("returns MailerFailed and leaves one failed delivery row when the mailer fails", async () => {
    const { usecase, deliveries, mailer } = setup();
    mailer.simulateFailure("boom");

    const result = await usecase.execute({ userId, userEmail: "a@b.fr" });

    assert.strictEqual(result.isFailure(), true);
    assert.strictEqual((result as FailureResult<"MailerFailed">).getError(), "MailerFailed");
    assert.strictEqual(deliveries.length, 1);
    assert.strictEqual(deliveries[0]?.status, "failed");
    assert.strictEqual(deliveries[0]?.errorMessage, "boom");
  });

  it("is a no-op the second time it executes for the same user", async () => {
    const { usecase, deliveries, mailer } = setup();

    await usecase.execute({ userId, userEmail: "a@b.fr" });
    const secondResult = await usecase.execute({ userId, userEmail: "a@b.fr" });

    assert.strictEqual(deliveries.length, 1);
    assert.strictEqual(mailer.sentEmails.length, 1);
    assert.strictEqual(secondResult.isSuccess(), true);
    assert.deepStrictEqual((secondResult as SuccessResult<{ outcome: string }>).getData(), {
      outcome: "skipped-already-sent",
    });
  });

  it("links the email to an unsubscribe URL signed for the recipient", async () => {
    const { usecase, mailer } = setup();

    await usecase.execute({ userId, userEmail: "a@b.fr" });

    const sentText = mailer.sentEmails[0]?.text ?? "";
    const expectedUrl = buildUnsubscribeUrl(webappUrl, tokenService.sign(userId));
    assert.ok(sentText.includes(expectedUrl));
    const token = /\/emails\/desinscription\?token=(\S+)/.exec(sentText)?.[1] ?? "";
    assert.strictEqual(tokenService.verify(token), userId);
  });
});
