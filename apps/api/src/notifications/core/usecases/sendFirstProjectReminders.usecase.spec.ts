import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { InMemoryLifecycleEmailCohortQuery } from "src/notifications/adapters/secondary/lifecycle-email-cohort/InMemoryLifecycleEmailCohortQuery";
import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { FirstProjectReminderSite } from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { buildFirstProjectReminderEmail } from "src/notifications/core/templates/firstProjectReminderEmail";
import { buildUnsubscribeUrl } from "src/notifications/core/templates/unsubscribeUrl";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { SuccessResult, TResult } from "src/shared-kernel/result";

import {
  SendFirstProjectRemindersUseCase,
  type SendFirstProjectRemindersSummary,
} from "./sendFirstProjectReminders.usecase";

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

const fricheSite1: FirstProjectReminderSite = {
  siteId: "site-1",
  siteName: "Ancienne carrière d’argile de Blajan",
  siteNature: "FRICHE",
  siteCreatedAt: new Date("2026-01-14T00:00:00.000Z"),
  userId: "user-1",
  email: "gregoire.bailleux@example.fr",
  firstName: "Grégoire",
  lastName: "Bailleux",
};
const farmSite2: FirstProjectReminderSite = {
  siteId: "site-2",
  siteName: "Exploitation des Quatre Chemins",
  siteNature: "AGRICULTURAL_OPERATION",
  siteCreatedAt: new Date("2026-01-13T12:00:00.000Z"),
  userId: "user-1",
  email: "gregoire.bailleux@example.fr",
  firstName: "Grégoire",
  lastName: "Bailleux",
};

const getSuccessData = <TData>(result: TResult<TData, never>): TData =>
  (result as SuccessResult<TData>).getData();

const setup = (options: {
  isEnabled: boolean;
  contact: LifecycleEmailContact | undefined;
  cohort: FirstProjectReminderSite[];
}) => {
  const deliveries: LifecycleEmailDelivery[] = [];
  const deliveryRepository = new InMemoryLifecycleEmailDeliveryRepository(deliveries);
  const cohortQuery = new InMemoryLifecycleEmailCohortQuery();
  cohortQuery._setFirstProjectReminderSites(options.cohort);
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  recipientQuery._setRecipients([
    {
      id: "user-1",
      email: "gregoire.bailleux@example.fr",
      firstName: "Grégoire",
      lastName: "Bailleux",
      unsubscribedAt: null,
    },
  ]);
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
  const useCase = new SendFirstProjectRemindersUseCase(
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

describe("SendFirstProjectReminders UseCase", () => {
  it("sends the reminder for each eligible site and records a delivery scoped to the site", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [fricheSite1],
    });

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(mailer.sentEmails, [
      {
        to: "gregoire.bailleux@example.fr",
        ...buildFirstProjectReminderEmail({
          firstName: "Grégoire",
          lastName: "Bailleux",
          site: { id: "site-1", name: "Ancienne carrière d’argile de Blajan", nature: "FRICHE" },
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
        emailType: "first-project-reminder",
        relatedEntityId: "site-1",
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("sends one email per site to a user with two eligible sites", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [fricheSite1, farmSite2],
    });

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(
      mailer.sentEmails.map((email) => email.subject),
      [
        "Ancienne carrière d’argile de Blajan : et si vous renseigniez votre projet d’aménagement ?",
        "Exploitation des Quatre Chemins : et si vous renseigniez votre projet d’aménagement ?",
      ],
    );
    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "first-project-reminder",
        relatedEntityId: "site-1",
        status: "sent",
        createdAt: fakeNow,
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
      {
        id: "delivery-2",
        userId: "user-1",
        emailType: "first-project-reminder",
        relatedEntityId: "site-2",
        status: "sent",
        createdAt: fakeNow,
        sentAt: fakeNow,
        errorMessage: null,
        attempts: 1,
        lastAttemptedAt: fakeNow,
      },
    ] satisfies LifecycleEmailDelivery[]);
    assert.deepStrictEqual(getSuccessData(result), {
      eligible: 2,
      sent: 2,
      failed: 0,
      skippedDisabled: 0,
      skippedUnsubscribed: 0,
      skippedAlreadySent: 0,
      skippedContactNotConfigured: 0,
      errored: 0,
      dryRun: false,
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("dry run lists the eligible sites and sends nothing", async () => {
    const { useCase, deliveries, mailer, logger } = setup({
      isEnabled: true,
      contact,
      cohort: [fricheSite1],
    });

    const result = await useCase.execute({ dryRun: true });

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(logger._info, [
      "[DRY RUN] First project reminders: sites created after 2026-01-12T08:00:00.000Z and at or before 2026-01-14T08:00:00.000Z",
      "[DRY RUN] Eligible for first project reminder: siteId=site-1, siteName=Ancienne carrière d’argile de Blajan, siteNature=FRICHE, userId=user-1, email=gregoire.bailleux@example.fr, siteCreatedAt=2026-01-14T00:00:00.000Z",
      "[DRY RUN] First project reminder summary: eligible=1, sent=0, failed=0, skippedDisabled=0, skippedUnsubscribed=0, skippedAlreadySent=0, skippedContactNotConfigured=0, errored=0",
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("sends nothing and writes nothing when the kill switch is off", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: false,
      contact,
      cohort: [fricheSite1],
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("sends nothing and writes nothing when the contact is not configured", async () => {
    const { useCase, deliveries, mailer, logger } = setup({
      isEnabled: true,
      contact: undefined,
      cohort: [fricheSite1],
    });

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
    assert.deepStrictEqual(logger._warn, [
      {
        message:
          "Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*): first project reminders not sent",
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("dry run warns when the contact is not configured and still lists the eligible sites", async () => {
    const { useCase, deliveries, mailer, logger } = setup({
      isEnabled: true,
      contact: undefined,
      cohort: [fricheSite1],
    });

    await useCase.execute({ dryRun: true });

    assert.ok(
      logger._info.includes(
        "[DRY RUN] Eligible for first project reminder: siteId=site-1, siteName=Ancienne carrière d’argile de Blajan, siteNature=FRICHE, userId=user-1, email=gregoire.bailleux@example.fr, siteCreatedAt=2026-01-14T00:00:00.000Z",
      ),
    );
    assert.deepStrictEqual(logger._warn, [
      {
        message:
          "[DRY RUN] Lifecycle email contact is not configured (LIFECYCLE_EMAILS_CONTACT_*): first project reminders not sent",
        error: undefined,
      },
    ]);
    assert.deepStrictEqual(mailer.sentEmails, []);
    assert.deepStrictEqual(deliveries, []);
  });

  it("running twice sends each site at most one reminder", async () => {
    // The stub returns the same cohort both times, standing in for a concurrent run the
    // SQL could not yet see.
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [fricheSite1],
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("counts a mailer failure as failed and records the failed delivery", async () => {
    const { useCase, deliveries, mailer } = setup({
      isEnabled: true,
      contact,
      cohort: [fricheSite1],
    });
    mailer.simulateFailure("SMTP down");

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(deliveries, [
      {
        id: "delivery-1",
        userId: "user-1",
        emailType: "first-project-reminder",
        relatedEntityId: "site-1",
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("keeps going after a site whose send throws, and counts it as errored", async () => {
    const { useCase, deliveryRepository, mailer, logger } = setup({
      isEnabled: true,
      contact,
      cohort: [fricheSite1, farmSite2],
    });
    const saveError = new Error("unique violation");
    const originalSave = deliveryRepository.save.bind(deliveryRepository);
    mock.method(deliveryRepository, "save", (delivery: LifecycleEmailDelivery) =>
      delivery.relatedEntityId === "site-1" ? Promise.reject(saveError) : originalSave(delivery),
    );

    const result = await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(
      mailer.sentEmails.map((email) => email.subject),
      ["Exploitation des Quatre Chemins : et si vous renseigniez votre projet d’aménagement ?"],
    );
    assert.deepStrictEqual(logger._error, [
      { message: "First project reminder failed for site site-1 (user user-1)", error: saveError },
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
    } satisfies SendFirstProjectRemindersSummary);
  });

  it("logs the window and one summary line", async () => {
    const { useCase, logger } = setup({ isEnabled: true, contact, cohort: [fricheSite1] });

    await useCase.execute({ dryRun: false });

    assert.deepStrictEqual(logger._info, [
      "First project reminders: sites created after 2026-01-12T08:00:00.000Z and at or before 2026-01-14T08:00:00.000Z",
      "First project reminder summary: eligible=1, sent=1, failed=0, skippedDisabled=0, skippedUnsubscribed=0, skippedAlreadySent=0, skippedContactNotConfigured=0, errored=0",
    ]);
  });
});
