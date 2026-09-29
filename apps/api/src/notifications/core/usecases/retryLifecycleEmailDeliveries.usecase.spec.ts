import assert from "node:assert/strict";
import { describe, it, mock } from "node:test";

import { InMemoryLifecycleEmailCohortQuery } from "src/notifications/adapters/secondary/lifecycle-email-cohort/InMemoryLifecycleEmailCohortQuery";
import { InMemoryLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryQuery";
import { InMemoryLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/InMemoryLifecycleEmailDeliveryRepository";
import { InMemoryLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/InMemoryLifecycleEmailRecipientQuery";
import { InMemoryLifecycleEmailSiteQuery } from "src/notifications/adapters/secondary/lifecycle-email-site/InMemoryLifecycleEmailSiteQuery";
import { FakeMailer } from "src/notifications/adapters/secondary/mailer/FakeMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type {
  FirstProjectReminderSite,
  FirstSiteReminderRecipient,
} from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { LifecycleEmailDelivery } from "src/notifications/core/models/lifecycleEmail";
import type { LifecycleEmailContact } from "src/notifications/core/models/lifecycleEmailContact";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { DeterministicDateProvider } from "src/shared-kernel/adapters/date/DeterministicDateProvider";
import { DeterministicUuidGenerator } from "src/shared-kernel/adapters/id-generator/DeterministicIdGenerator";
import { SpyLogger } from "src/shared-kernel/adapters/logger/SpyLogger";
import type { SuccessResult, TResult } from "src/shared-kernel/result";

import {
  RetryLifecycleEmailDeliveriesUseCase,
  type RetryLifecycleEmailDeliveriesSummary,
} from "./retryLifecycleEmailDeliveries.usecase";
import { SendFirstProjectRemindersUseCase } from "./sendFirstProjectReminders.usecase";
import { SendFirstSiteRemindersUseCase } from "./sendFirstSiteReminders.usecase";
import { SendWelcomeEmailUseCase } from "./sendWelcomeEmail.usecase";

const fakeNow = new Date("2026-01-01T10:00:00.000Z");
const aDayBefore = new Date("2025-12-31T10:00:00.000Z");
const webappUrl = "http://localhost:3001";
const unsubscribeTokenService = new HmacUnsubscribeTokenService("unsubscribe-secret-for-tests");

const getSuccessData = <TData>(result: TResult<TData, never>): TData =>
  (result as SuccessResult<TData>).getData();

const contact = {
  firstName: "Mathilde",
  lastName: "Lefèvre",
  role: "Chargée de déploiement",
  phone: "01 23 45 67 89",
  email: "mathilde.lefevre@example.com",
} satisfies LifecycleEmailContact;

const setup = (options: {
  isEnabled: boolean;
  deliveries: LifecycleEmailDelivery[];
  contact?: LifecycleEmailContact | undefined;
}) => {
  const deliveryRepository = new InMemoryLifecycleEmailDeliveryRepository(options.deliveries);
  const deliveryQuery = new InMemoryLifecycleEmailDeliveryQuery(options.deliveries);
  const recipientQuery = new InMemoryLifecycleEmailRecipientQuery();
  const siteQuery = new InMemoryLifecycleEmailSiteQuery();
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
    siteQuery,
    sender,
    dateProvider,
    webappUrl,
    unsubscribeTokenService,
    "contact" in options ? options.contact : contact,
    logger,
  );
  return { useCase, deliveryRepository, recipientQuery, siteQuery, mailer, logger };
};

describe("RetryLifecycleEmailDeliveries UseCase", () => {
  it("retries a failed welcome email with the same message the welcome use case sends", async () => {
    // Capture what the inline welcome path sends for this user.
    const welcomeDeliveries: LifecycleEmailDelivery[] = [];
    const welcomeRecipientQuery = new InMemoryLifecycleEmailRecipientQuery();
    welcomeRecipientQuery._setRecipients([
      {
        id: "user-1",
        email: "user@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
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
      {
        id: "user-1",
        email: "user@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
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
      {
        id: "user-1",
        email: "user@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
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
      {
        id: "user-1",
        email: "user@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
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
      {
        id: "user-1",
        email: "user@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
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
      {
        id: "user-1",
        email: "user-1@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
      {
        id: "user-2",
        email: "user-2@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
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
      {
        id: "user-1",
        email: "user@example.fr",
        firstName: "John",
        lastName: "Doe",
        unsubscribedAt: null,
      },
    ]);

    await useCase.execute();

    assert.deepStrictEqual(logger._info, [
      "Lifecycle email retry summary: candidates=1, sent=1, failed=0, abandoned=0, skippedDisabled=0, skippedUnsubscribed=0, skippedRecipientNotFound=0, skippedAlreadyClaimed=0, errored=0",
    ]);
  });
  describe("first site reminder", () => {
    const failedFirstSiteReminder = (): LifecycleEmailDelivery => ({
      id: "delivery-1",
      userId: "user-1",
      emailType: "first-site-reminder",
      relatedEntityId: null,
      status: "failed",
      createdAt: aDayBefore,
      sentAt: null,
      errorMessage: "SMTP down",
      attempts: 1,
      lastAttemptedAt: aDayBefore,
    });

    it("retries a failed first site reminder with the same message the send use case sends", async () => {
      // Capture what the daily job sends for this user.
      const reminderDeliveries: LifecycleEmailDelivery[] = [];
      const reminderRecipient: FirstSiteReminderRecipient = {
        userId: "user-1",
        email: "gregoire.bailleux@example.fr",
        firstName: "Grégoire",
        lastName: "Bailleux",
        registeredAt: new Date("2025-12-30T20:00:00.000Z"),
      };
      const cohortQuery = new InMemoryLifecycleEmailCohortQuery();
      cohortQuery._setFirstSiteReminderRecipients([reminderRecipient]);
      const reminderRecipientQuery = new InMemoryLifecycleEmailRecipientQuery();
      reminderRecipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);
      const reminderMailer = new FakeMailer();
      const reminderUidGenerator = new DeterministicUuidGenerator();
      reminderUidGenerator.nextUuids("reminder-delivery");
      await new SendFirstSiteRemindersUseCase(
        cohortQuery,
        new LifecycleEmailSender(
          new InMemoryLifecycleEmailDeliveryRepository(reminderDeliveries),
          new InMemoryLifecycleEmailDeliveryQuery(reminderDeliveries),
          reminderRecipientQuery,
          reminderMailer,
          new DeterministicDateProvider(fakeNow),
          reminderUidGenerator,
          true,
        ),
        new DeterministicDateProvider(fakeNow),
        webappUrl,
        unsubscribeTokenService,
        contact,
        new SpyLogger(),
      ).execute({ dryRun: false });
      const expectedMessage = reminderMailer.sentEmails[0];
      assert.ok(expectedMessage);

      const { useCase, recipientQuery, mailer } = setup({
        isEnabled: true,
        deliveries: [failedFirstSiteReminder()],
      });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
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

    it("greets the recipient with their current name on retry", async () => {
      const { useCase, recipientQuery, mailer } = setup({
        isEnabled: true,
        deliveries: [failedFirstSiteReminder()],
      });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux-Martin",
          unsubscribedAt: null,
        },
      ]);

      await useCase.execute();

      assert.ok(mailer.sentEmails[0]?.text.startsWith("Bonjour Grégoire Bailleux-Martin,\n\n"));
    });

    it("counts a first site reminder retry as failed when the contact is not configured", async () => {
      const deliveries = [failedFirstSiteReminder()];
      const { useCase, recipientQuery, mailer } = setup({
        isEnabled: true,
        deliveries,
        contact: undefined,
      });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);

      const result = await useCase.execute();

      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "first-site-reminder",
          relatedEntityId: null,
          status: "failed",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Lifecycle email contact is not configured",
          attempts: 2,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
      assert.deepStrictEqual(getSuccessData(result), {
        candidates: 1,
        sent: 0,
        failed: 1,
        abandoned: 0,
        skippedDisabled: 0,
        skippedUnsubscribed: 0,
        skippedRecipientNotFound: 0,
        skippedAlreadyClaimed: 0,
        errored: 0,
      } satisfies RetryLifecycleEmailDeliveriesSummary);
    });
  });

  describe("first project reminder", () => {
    const failedFirstProjectReminder = (attempts: number): LifecycleEmailDelivery => ({
      id: "delivery-1",
      userId: "user-1",
      emailType: "first-project-reminder",
      relatedEntityId: "site-1",
      status: "failed",
      createdAt: aDayBefore,
      sentAt: null,
      errorMessage: "SMTP down",
      attempts,
      lastAttemptedAt: aDayBefore,
    });

    it("retries a failed first project reminder with the same message the send use case sends", async () => {
      // Capture what the daily job sends for this site.
      const reminderDeliveries: LifecycleEmailDelivery[] = [];
      const reminderSite: FirstProjectReminderSite = {
        siteId: "site-1",
        siteName: "Ancienne carrière d’argile de Blajan",
        siteNature: "FRICHE",
        siteCreatedAt: new Date("2025-12-30T20:00:00.000Z"),
        userId: "user-1",
        email: "gregoire.bailleux@example.fr",
        firstName: "Grégoire",
        lastName: "Bailleux",
      };
      const cohortQuery = new InMemoryLifecycleEmailCohortQuery();
      cohortQuery._setFirstProjectReminderSites([reminderSite]);
      const reminderRecipientQuery = new InMemoryLifecycleEmailRecipientQuery();
      reminderRecipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);
      const reminderMailer = new FakeMailer();
      const reminderUidGenerator = new DeterministicUuidGenerator();
      reminderUidGenerator.nextUuids("reminder-delivery");
      await new SendFirstProjectRemindersUseCase(
        cohortQuery,
        new LifecycleEmailSender(
          new InMemoryLifecycleEmailDeliveryRepository(reminderDeliveries),
          new InMemoryLifecycleEmailDeliveryQuery(reminderDeliveries),
          reminderRecipientQuery,
          reminderMailer,
          new DeterministicDateProvider(fakeNow),
          reminderUidGenerator,
          true,
        ),
        new DeterministicDateProvider(fakeNow),
        webappUrl,
        unsubscribeTokenService,
        contact,
        new SpyLogger(),
      ).execute({ dryRun: false });
      const expectedMessage = reminderMailer.sentEmails[0];
      assert.ok(expectedMessage);

      const { useCase, recipientQuery, siteQuery, mailer } = setup({
        isEnabled: true,
        deliveries: [failedFirstProjectReminder(1)],
      });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);
      siteQuery._setSites([
        { id: "site-1", name: "Ancienne carrière d’argile de Blajan", nature: "FRICHE" },
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

    it("uses the site's current name on retry", async () => {
      const { useCase, recipientQuery, siteQuery, mailer } = setup({
        isEnabled: true,
        deliveries: [failedFirstProjectReminder(1)],
      });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);
      siteQuery._setSites([{ id: "site-1", name: "Carrière de Blajan", nature: "FRICHE" }]);

      await useCase.execute();

      assert.deepStrictEqual(
        mailer.sentEmails.map((email) => email.subject),
        ["Carrière de Blajan : et si vous renseigniez votre projet d’aménagement ?"],
      );
    });

    it("counts a retry as failed when the site no longer exists", async () => {
      const deliveries = [failedFirstProjectReminder(1)];
      const { useCase, recipientQuery, mailer } = setup({ isEnabled: true, deliveries });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);

      const result = await useCase.execute();

      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "first-project-reminder",
          relatedEntityId: "site-1",
          status: "failed",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Site site-1 not found",
          attempts: 2,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
      assert.deepStrictEqual(getSuccessData(result), {
        candidates: 1,
        sent: 0,
        failed: 1,
        abandoned: 0,
        skippedDisabled: 0,
        skippedUnsubscribed: 0,
        skippedRecipientNotFound: 0,
        skippedAlreadyClaimed: 0,
        errored: 0,
      } satisfies RetryLifecycleEmailDeliveriesSummary);
    });

    it("abandons the retry of a deleted site at the last allowed attempt", async () => {
      const deliveries = [failedFirstProjectReminder(4)];
      const { useCase, recipientQuery, mailer } = setup({ isEnabled: true, deliveries });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);

      const result = await useCase.execute();

      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "first-project-reminder",
          relatedEntityId: "site-1",
          status: "abandoned",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Site site-1 not found",
          attempts: 5,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
      assert.deepStrictEqual(getSuccessData(result), {
        candidates: 1,
        sent: 0,
        failed: 0,
        abandoned: 1,
        skippedDisabled: 0,
        skippedUnsubscribed: 0,
        skippedRecipientNotFound: 0,
        skippedAlreadyClaimed: 0,
        errored: 0,
      } satisfies RetryLifecycleEmailDeliveriesSummary);
    });

    it("counts a first project reminder retry as failed when the contact is not configured", async () => {
      const deliveries = [failedFirstProjectReminder(1)];
      const { useCase, recipientQuery, siteQuery, mailer } = setup({
        isEnabled: true,
        deliveries,
        contact: undefined,
      });
      recipientQuery._setRecipients([
        {
          id: "user-1",
          email: "gregoire.bailleux@example.fr",
          firstName: "Grégoire",
          lastName: "Bailleux",
          unsubscribedAt: null,
        },
      ]);
      siteQuery._setSites([
        { id: "site-1", name: "Ancienne carrière d’argile de Blajan", nature: "FRICHE" },
      ]);

      const result = await useCase.execute();

      assert.deepStrictEqual(mailer.sentEmails, []);
      assert.deepStrictEqual(deliveries, [
        {
          id: "delivery-1",
          userId: "user-1",
          emailType: "first-project-reminder",
          relatedEntityId: "site-1",
          status: "failed",
          createdAt: aDayBefore,
          sentAt: null,
          errorMessage: "Lifecycle email contact is not configured",
          attempts: 2,
          lastAttemptedAt: fakeNow,
        },
      ] satisfies LifecycleEmailDelivery[]);
      assert.deepStrictEqual(getSuccessData(result), {
        candidates: 1,
        sent: 0,
        failed: 1,
        abandoned: 0,
        skippedDisabled: 0,
        skippedUnsubscribed: 0,
        skippedRecipientNotFound: 0,
        skippedAlreadyClaimed: 0,
        errored: 0,
      } satisfies RetryLifecycleEmailDeliveriesSummary);
    });
  });
});
