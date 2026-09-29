import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { SuccessResult, TResult } from "src/shared-kernel/result";

import {
  RetryLifecycleEmailDeliveriesUseCase,
  type RetryLifecycleEmailDeliveriesSummary,
} from "./retryLifecycleEmailDeliveries.usecase";
import { SendWelcomeEmailUseCase } from "./sendWelcomeEmail.usecase";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");
const aDayBefore = new Date("2025-12-31T10:00:00.000Z");
const webappUrl = "http://localhost:3001";
const unsubscribeTokenService = new HmacUnsubscribeTokenService("unsubscribe-secret-for-tests");

const getSuccessData = <TData>(result: TResult<TData, never>): TData =>
  (result as SuccessResult<TData>).getData();

const setup = (options: { isEnabled: boolean; deliveries: LifecycleEmailDelivery[] }) => {
  const deliveryRepository = new InMemoryLifecycleEmailDeliveryRepository(options.deliveries);
  const deliveryQuery = new InMemoryLifecycleEmailDeliveryQuery(options.deliveries);
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  const mailer = new FakeMailer();
  const dateProvider = new DeterministicDateProvider(fakeNow);
  const logger = new SpyLogger();
  const sender = new LifecycleEmailSender(
    deliveryRepository,
    deliveryQuery,
    recipientQuery,
    mailer,
    dateProvider,
    new DeterministicUuidGenerator(),
    options.isEnabled,
  );
  const useCase = new RetryLifecycleEmailDeliveriesUseCase(
    deliveryQuery,
    sender,
    dateProvider,
    webappUrl,
    unsubscribeTokenService,
    logger,
  );
  return { useCase, deliveryRepository, recipientQuery, mailer, logger };
};

describe("RetryLifecycleEmailDeliveries UseCase", () => {
  it("retries a failed welcome email with the same message the welcome use case sends", async () => {
    // Capture what the inline welcome path sends for this user.
    const welcomeDeliveries: LifecycleEmailDelivery[] = [];
    const welcomeRecipientQuery = new InMemoryLifecycleEmailRecipientQuery();
    welcomeRecipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);
    const welcomeMailer = new FakeMailer();
    const welcomeUidGenerator = new DeterministicUuidGenerator();
    welcomeUidGenerator.nextUuids("welcome-delivery");
    await new SendWelcomeEmailUseCase(
      new LifecycleEmailSender(
        new InMemoryLifecycleEmailDeliveryRepository(welcomeDeliveries),
        new InMemoryLifecycleEmailDeliveryQuery(welcomeDeliveries),
        welcomeRecipientQuery,
        welcomeMailer,
        new DeterministicDateProvider(fakeNow),
        welcomeUidGenerator,
        true,
      ),
      webappUrl,
      unsubscribeTokenService,
    ).execute({ userId: "user-1", userEmail: "user@example.fr" });
    const expectedMessage = welcomeMailer.sentEmails[0];
    assert.ok(expectedMessage);

    const { useCase, recipientQuery, mailer } = setup({
      isEnabled: true,
      deliveries: [
        {
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
        },
      ],
    });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);

    const result = await useCase.execute();

    assert.deepStrictEqual(mailer.sentEmails, [expectedMessage]);
    assert.deepStrictEqual(getSuccessData(result), {
      candidates: 1,
      sent: 1,
      failed: 0,
      abandoned: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedRecipientNotFound: 0,
      skippedAlreadyClaimed: 0,
      errored: 0,
    } satisfies RetryLifecycleEmailDeliveriesSummary);
  });

  it("leaves a pending delivery younger than 15 minutes untouched", async () => {
    const freshPending: LifecycleEmailDelivery = {
      id: "delivery-1",
      userId: "user-1",
      emailType: "welcome",
      relatedEntityId: null,
      status: "pending",
      createdAt: new Date("2026-01-01T09:46:00.000Z"),
      sentAt: null,
      errorMessage: null,
      attempts: 1,
      lastAttemptedAt: new Date("2026-01-01T09:46:00.000Z"),
    };
    const deliveries = [{ ...freshPending }];
    const { useCase, recipientQuery, mailer } = setup({ isEnabled: true, deliveries });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);

    const result = await useCase.execute();

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, [freshPending]);
    assert.deepStrictEqual(getSuccessData(result), {
      candidates: 0,
      sent: 0,
      failed: 0,
      abandoned: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedRecipientNotFound: 0,
      skippedAlreadyClaimed: 0,
      errored: 0,
    } satisfies RetryLifecycleEmailDeliveriesSummary);
  });

  it("retries a pending delivery stranded for more than 15 minutes", async () => {
    const deliveries: LifecycleEmailDelivery[] = [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "pending",
        createdAt: new Date("2026-01-01T09:44:00.000Z"),
        sentAt: null,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: new Date("2026-01-01T09:44:00.000Z"),
      },
    ];
    const { useCase, recipientQuery, mailer } = setup({ isEnabled: true, deliveries });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);

    await useCase.execute();

    assert.deepStrictEqual(
      mailer.sentEmails.map((email) => email.to),
      ["user@example.fr"],
    );
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "sent",
        createdAt: new Date("2026-01-01T09:44:00.000Z"),
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 2,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
  });

  it("sends nothing and changes nothing when the kill switch is off", async () => {
    const failed: LifecycleEmailDelivery = {
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
    const deliveries = [{ ...failed }];
    const { useCase, recipientQuery, mailer } = setup({ isEnabled: false, deliveries });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);

    const result = await useCase.execute();

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, [failed]);
    assert.deepStrictEqual(getSuccessData(result), {
      candidates: 1,
      sent: 0,
      failed: 0,
      abandoned: 0,
      skippedDisabled: 1,
      skippedUnsubscribed: 0,
      skippedRecipientNotFound: 0,
      skippedAlreadyClaimed: 0,
      errored: 0,
    } satisfies RetryLifecycleEmailDeliveriesSummary);
  });

  it("keeps going after a delivery whose ledger update throws, and counts it as errored", async () => {
    const deliveries: LifecycleEmailDelivery[] = [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: new Date("2025-12-31T10:00:00.000Z"),
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      },
      {
        id: "delivery-2",
        userId: "user-2",
        emailType: "welcome",
        relatedEntityId: null,
        status: "failed",
        createdAt: new Date("2025-12-31T11:00:00.000Z"),
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: aDayBefore,
      },
    ];
    const { useCase, deliveryRepository, recipientQuery, mailer, logger } = setup({
      isEnabled: true,
      deliveries,
    });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user-1@example.fr", unsubscribedAt: null },
      { id: "user-2", email: "user-2@example.fr", unsubscribedAt: null },
    ]);
    const dbError = new Error("connection reset");
    const originalClaim = deliveryRepository.claimForRetry.bind(deliveryRepository);
    mock.method(
      deliveryRepository,
      "claimForRetry",
      (input: Parameters<typeof originalClaim>[0]) =>
        input.id === "delivery-1" ? Promise.reject(dbError) : originalClaim(input),
    );

    const result = await useCase.execute();

    assert.deepStrictEqual(
      mailer.sentEmails.map((email) => email.to),
      ["user-2@example.fr"],
    );
    assert.deepStrictEqual(getSuccessData(result), {
      candidates: 2,
      sent: 1,
      failed: 0,
      abandoned: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedRecipientNotFound: 0,
      skippedAlreadyClaimed: 0,
      errored: 1,
    } satisfies RetryLifecycleEmailDeliveriesSummary);
    assert.deepStrictEqual(logger._error, [
      { message: "Retry failed for lifecycle email delivery delivery-1", error: dbError },
    ]);
  });

  it("logs one summary line", async () => {
    const { useCase, recipientQuery, logger } = setup({
      isEnabled: true,
      deliveries: [
        {
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
        },
      ],
    });
    recipientQuery._setRecipients([
      { id: "user-1", email: "user@example.fr", unsubscribedAt: null },
    ]);

    await useCase.execute();

    assert.deepStrictEqual(logger._info, [
      "Lifecycle email retry summary: candidates=1, sent=1, failed=0, abandoned=0, skippedDisabled=0, skippedUnsubscribed=0, skippedRecipientNotFound=0, skippedAlreadyClaimed=0, errored=0",
    ]);
  });
});
