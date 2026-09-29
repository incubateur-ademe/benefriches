import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { InMemoryLifecycleEmailCohortQuery } from "src/notifications/adapters/secondary/lifecycle-email-cohort/InMemoryLifecycleEmailCohortQuery";
import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { FirstSiteReminderRecipient } from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { buildFirstSiteReminderEmail } from "src/notifications/core/templates/firstSiteReminderEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { SuccessResult, TResult } from "src/shared-kernel/result";

import {
  SendFirstSiteRemindersUseCase,
  type SendFirstSiteRemindersSummary,
} from "./sendFirstSiteReminders.usecase";

const fakeNow = new Date("2026-01-15T08:00:00.000Z");
const webappUrl = "http://localhost:3001";
const unsubscribeTokenService = new HmacUnsubscribeTokenService("unsubscribe-secret-for-tests");
const contact = {
  firstName: "Mathilde",
  lastName: "Lefèvre",
  role: "Chargée de déploiement",
  phone: "01 23 45 67 89",
  email: "mathilde.lefevre@example.com",
} satisfies LifecycleEmailContact;

const recipient1: FirstSiteReminderRecipient = {
  userId: "user-1",
  email: "gregoire.bailleux@example.fr",
  firstName: "Grégoire",
  lastName: "Bailleux",
  registeredAt: new Date("2026-01-14T00:00:00.000Z"),
};
const recipient2: FirstSiteReminderRecipient = {
  userId: "user-2",
  email: "camille.martin@example.fr",
  firstName: "Camille",
  lastName: "Martin",
  registeredAt: new Date("2026-01-13T12:00:00.000Z"),
};

const getSuccessData = <TData>(result: TResult<TData, never>): TData =>
  (result as SuccessResult<TData>).getData();

const setup = (options: {
  isEnabled: boolean;
  contact: LifecycleEmailContact | undefined;
  cohort: FirstSiteReminderRecipient[];
}) => {
  const deliveries: LifecycleEmailDelivery[] = [];
  const deliveryRepository = new InMemoryLifecycleEmailDeliveryRepository(deliveries);
  const cohortQuery = new InMemoryLifecycleEmailCohortQuery();
  cohortQuery._setFirstSiteReminderRecipients(options.cohort);
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  recipientQuery._setRecipients(
    options.cohort.map((recipient) => ({
      id: recipient.userId,
      email: recipient.email,
      firstName: recipient.firstName,
      lastName: recipient.lastName,
      unsubscribedAt: null,
    })),
  );
  const mailer = new FakeMailer();
  const dateProvider = new DeterministicDateProvider(fakeNow);
  const uidGenerator = new DeterministicUuidGenerator();
  uidGenerator.nextUuids("delivery-2", "delivery-1");
  const logger = new SpyLogger();
  const sender = new LifecycleEmailSender(
    deliveryRepository,
    new InMemoryLifecycleEmailDeliveryQuery(deliveries),
    recipientQuery,
    mailer,
    dateProvider,
    uidGenerator,
    options.isEnabled,
  );
  const useCase = new SendFirstSiteRemindersUseCase(
    cohortQuery,
    sender,
    dateProvider,
    webappUrl,
    unsubscribeTokenService,
    options.contact,
    logger,
  );
  return { useCase, deliveries, deliveryRepository, mailer, logger };
};

describe("SendFirstSiteReminders UseCase", () => {
  it("sends the reminder to each eligible user and records an account-scoped delivery", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [recipient1],
    });

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(mailer.sentEmails, [
      {
        to: "gregoire.bailleux@example.fr",
        ...buildFirstSiteReminderEmail({
          firstName: "Grégoire",
          lastName: "Bailleux",
          contact,
          webappUrl,
          unsubscribeUrl: buildUnsubscribeUrl(webappUrl, unsubscribeTokenService.sign("user-1")),
        }),
      },
    ]);
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "first-site-reminder",
        relatedEntityId: null,
        status: "sent",
        createdAt: fakeNow,
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 1,
      sent: 1,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("dry run lists the eligible users and sends nothing", async () => {
    const { useCase, deliveries, mailer, logger } = setup({
      isEnabled: true,
      contact,
      cohort: [recipient1],
    });

    const result = await useCase.execute({ dryRun: true });

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(logger._info, [
      "[DRY RUN] First site reminders: registered after 2026-01-12T08:00:00.000Z and at or before 2026-01-14T08:00:00.000Z",
      "[DRY RUN] Eligible for first site reminder: userId=user-1, email=gregoire.bailleux@example.fr, registeredAt=2026-01-14T00:00:00.000Z",
      "[DRY RUN] First site reminder summary: eligible=1, sent=0, failed=0, skippedDisabled=0, skippedUnsubscribed=0, skippedAlreadySent=0, skippedContactNotConfigured=0, errored=0",
    ]);
    assert.deepStrictEqual(logger._warn, []);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 1,
      sent: 0,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: true,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("sends nothing and writes nothing when the kill switch is off", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: false,
      contact,
      cohort: [recipient1],
    });

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 1,
      sent: 0,
      failed: 0,
      skippedDisabled: 1,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("sends nothing and writes nothing when the contact is not configured", async () => {
    const { useCase, deliveries, mailer, logger } = setup({
      isEnabled: true,
      contact: undefined,
      cohort: [recipient1],
    });

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(logger._warn, [
      {
        message:
          "Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*): first site reminders not sent",
        error: undefined,
      },
    ]);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 1,
      sent: 0,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 1,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("dry run warns when the contact is not configured and still lists the eligible users", async () => {
    const { useCase, deliveries, mailer, logger } = setup({
      isEnabled: true,
      contact: undefined,
      cohort: [recipient1],
    });

    await useCase.execute({ dryRun: true });

    assert.ok(
      logger._info.includes(
        "[DRY RUN] Eligible for first site reminder: userId=user-1, email=gregoire.bailleux@example.fr, registeredAt=2026-01-14T00:00:00.000Z",
      ),
    );
    assert.deepStrictEqual(logger._warn, [
      {
        message:
          "[DRY RUN] Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*): first site reminders not sent",
        error: undefined,
      },
    ]);
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
  });

  it("running twice sends each user at most one reminder", async () => {
    // The stub returns the same cohort both times, standing in for a concurrent run the
    // SQL could not yet see.
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [recipient1],
    });

    await useCase.execute({ dryRun: false });
    const secondResult = await useCase.execute({ dryRun: false });

    assert.strictEqual(mailer.sentEmails.length, 1);
    assert.strictEqual(deliveries.length, 1);
    assert.deepStrictEqual(getSuccessData(secondResult), {
      eligible: 1,
      sent: 0,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 1,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("counts a mailer failure as failed and records the failed delivery", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [recipient1],
    });
    mailer.simulateFailure("SMTP down");

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "first-site-reminder",
        relatedEntityId: null,
        status: "failed",
        createdAt: fakeNow,
        sentAt: null,
        errorMessage: "SMTP down",
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 1,
      sent: 0,
      failed: 1,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("keeps going after a user whose send throws, and counts it as errored", async () => {
    const { useCase, deliveryRepository, mailer, logger } = setup({
      isEnabled: true,
      contact,
      cohort: [recipient1, recipient2],
    });
    const saveError = new Error("unique violation");
    const originalSave = deliveryRepository.save.bind(deliveryRepository);
    mock.method(deliveryRepository, "save", (delivery: LifecycleEmailDelivery) =>
      delivery.userId === "user-1" ? Promise.reject(saveError) : originalSave(delivery),
    );

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(
      mailer.sentEmails.map((email) => email.to),
      ["camille.martin@example.fr"],
    );
    assert.deepStrictEqual(logger._error, [
      { message: "First site reminder failed for user user-1", error: saveError },
    ]);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 2,
      sent: 1,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 1,
      dryRun: false,
    } satisfies SendFirstSiteRemindersSummary);
  });

  it("logs the window and one summary line", async () => {
    const { useCase, logger } = setup({ isEnabled: true, contact, cohort: [recipient1] });

    await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(logger._info, [
      "First site reminders: registered after 2026-01-12T08:00:00.000Z and at or before 2026-01-14T08:00:00.000Z",
      "First site reminder summary: eligible=1, sent=1, failed=0, skippedDisabled=0, skippedUnsubscribed=0, skippedAlreadySent=0, skippedContactNotConfigured=0, errored=0",
    ]);
  });
});
