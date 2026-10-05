import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { Knex } from "knex";

import { SqlLifecycleEmailCohortQuery } from "src/notifications/adapters/secondary/lifecycle-email-cohort/SqlLifecycleEmailCohortQuery";
import { SqlLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/SqlLifecycleEmailDeliveryQuery";
import { SqlLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/SqlLifecycleEmailDeliveryRepository";
import { SqlLifecycleEmailProjectQuery } from "src/notifications/adapters/secondary/lifecycle-email-project/SqlLifecycleEmailProjectQuery";
import { SqlLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/SqlLifecycleEmailRecipientQuery";
import { SqlLifecycleEmailSiteQuery } from "src/notifications/adapters/secondary/lifecycle-email-site/SqlLifecycleEmailSiteQuery";
import { SqlLifecycleEmailSubscriptionRepository } from "src/notifications/adapters/secondary/lifecycle-email-subscription/SqlLifecycleEmailSubscriptionRepository";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailCohortQuery } from "src/notifications/core/gateways/LifecycleEmailCohortQuery";
import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type { LifecycleEmailProjectQuery } from "src/notifications/core/gateways/LifecycleEmailProjectQuery";
import type { LifecycleEmailRecipientQuery } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { LifecycleEmailSiteQuery } from "src/notifications/core/gateways/LifecycleEmailSiteQuery";
import type { LifecycleEmailSubscriptionRepository } from "src/notifications/core/gateways/LifecycleEmailSubscriptionRepository";
import type { Mailer } from "src/notifications/core/gateways/Mailer";
import type { ProjectImpactsCalculator } from "src/notifications/core/gateways/ProjectImpactsCalculator";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { RetryLifecycleEmailDeliveriesUseCase } from "src/notifications/core/usecases/retryLifecycleEmailDeliveries.usecase";
import { SendFirstProjectRemindersUseCase } from "src/notifications/core/usecases/sendFirstProjectReminders.usecase";
import { SendFirstSiteRemindersUseCase } from "src/notifications/core/usecases/sendFirstSiteReminders.usecase";
import { SendLifecycleEmailPreviewUseCase } from "src/notifications/core/usecases/sendLifecycleEmailPreview.usecase";
import { SendProjectImpactsSummaryEmailUseCase } from "src/notifications/core/usecases/sendProjectImpactsSummaryEmail.usecase";
import { SendWelcomeEmailUseCase } from "src/notifications/core/usecases/sendWelcomeEmail.usecase";
import { UnsubscribeFromLifecycleEmailsUseCase } from "src/notifications/core/usecases/unsubscribeFromLifecycleEmails.usecase";
import { ReconversionProjectsModule } from "src/reconversion-projects/adapters/primary/reconversionProjects.module";
import { ComputeReconversionProjectBreakEvenLevelUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectBreakEvenLevel.usecase";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { NestJsAppLogger } from "src/shared-kernel/adapters/logger/NestJsAppLogger";
import {
  SqlConnection,
  SqlConnectionModule,
} from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";

import { NotificationsController } from "./notifications.controller";
import { readLifecycleEmailContact } from "./readLifecycleEmailContact";
import { SendProjectImpactsSummaryOnReconversionProjectCreatedHandler } from "./sendProjectImpactsSummaryOnReconversionProjectCreated.handler";
import { SendWelcomeEmailOnUserAccountCreatedHandler } from "./sendWelcomeEmailOnUserAccountCreated.handler";

@Module({
  // ReconversionProjectsModule exports the impacts computation the project impacts summary
  // derives its headlines from.
  imports: [ConfigModule, SqlConnectionModule, ReconversionProjectsModule],
  controllers: [NotificationsController],
  providers: [
    {
      provide: SendWelcomeEmailOnUserAccountCreatedHandler,
      useFactory: (sendWelcomeEmailUseCase: SendWelcomeEmailUseCase) =>
        new SendWelcomeEmailOnUserAccountCreatedHandler(sendWelcomeEmailUseCase),
      inject: [SendWelcomeEmailUseCase],
    },
    {
      provide: SendWelcomeEmailUseCase,
      useFactory: (
        sender: LifecycleEmailSender,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
      ) =>
        new SendWelcomeEmailUseCase(
          sender,
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
        ),
      inject: [LifecycleEmailSender, ConfigService, HmacUnsubscribeTokenService],
    },
    {
      provide: SendProjectImpactsSummaryOnReconversionProjectCreatedHandler,
      useFactory: (sendProjectImpactsSummaryEmailUseCase: SendProjectImpactsSummaryEmailUseCase) =>
        new SendProjectImpactsSummaryOnReconversionProjectCreatedHandler(
          sendProjectImpactsSummaryEmailUseCase,
        ),
      inject: [SendProjectImpactsSummaryEmailUseCase],
    },
    {
      provide: SendProjectImpactsSummaryEmailUseCase,
      useFactory: (
        sender: LifecycleEmailSender,
        projectQuery: LifecycleEmailProjectQuery,
        projectImpactsCalculator: ProjectImpactsCalculator,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
      ) =>
        new SendProjectImpactsSummaryEmailUseCase(
          sender,
          projectQuery,
          projectImpactsCalculator,
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
          new NestJsAppLogger("SendProjectImpactsSummaryEmail"),
        ),
      inject: [
        LifecycleEmailSender,
        SqlLifecycleEmailProjectQuery,
        ComputeReconversionProjectBreakEvenLevelUseCase,
        ConfigService,
        HmacUnsubscribeTokenService,
      ],
    },
    {
      provide: RetryLifecycleEmailDeliveriesUseCase,
      useFactory: (
        deliveryQuery: LifecycleEmailDeliveryQuery,
        siteQuery: LifecycleEmailSiteQuery,
        projectQuery: LifecycleEmailProjectQuery,
        projectImpactsCalculator: ProjectImpactsCalculator,
        sender: LifecycleEmailSender,
        dateProvider: DateProvider,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
      ) =>
        new RetryLifecycleEmailDeliveriesUseCase(
          deliveryQuery,
          siteQuery,
          projectQuery,
          projectImpactsCalculator,
          sender,
          dateProvider,
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
          readLifecycleEmailContact(configService),
          new NestJsAppLogger("RetryLifecycleEmailDeliveries"),
        ),
      inject: [
        SqlLifecycleEmailDeliveryQuery,
        SqlLifecycleEmailSiteQuery,
        SqlLifecycleEmailProjectQuery,
        ComputeReconversionProjectBreakEvenLevelUseCase,
        LifecycleEmailSender,
        RealDateProvider,
        ConfigService,
        HmacUnsubscribeTokenService,
      ],
    },
    {
      provide: SendFirstSiteRemindersUseCase,
      useFactory: (
        cohortQuery: LifecycleEmailCohortQuery,
        sender: LifecycleEmailSender,
        dateProvider: DateProvider,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
      ) =>
        new SendFirstSiteRemindersUseCase(
          cohortQuery,
          sender,
          dateProvider,
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
          readLifecycleEmailContact(configService),
          new NestJsAppLogger("SendFirstSiteReminders"),
        ),
      inject: [
        SqlLifecycleEmailCohortQuery,
        LifecycleEmailSender,
        RealDateProvider,
        ConfigService,
        HmacUnsubscribeTokenService,
      ],
    },
    {
      provide: SendFirstProjectRemindersUseCase,
      useFactory: (
        cohortQuery: LifecycleEmailCohortQuery,
        sender: LifecycleEmailSender,
        dateProvider: DateProvider,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
      ) =>
        new SendFirstProjectRemindersUseCase(
          cohortQuery,
          sender,
          dateProvider,
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
          readLifecycleEmailContact(configService),
          new NestJsAppLogger("SendFirstProjectReminders"),
        ),
      inject: [
        SqlLifecycleEmailCohortQuery,
        LifecycleEmailSender,
        RealDateProvider,
        ConfigService,
        HmacUnsubscribeTokenService,
      ],
    },
    {
      provide: SendLifecycleEmailPreviewUseCase,
      useFactory: (
        mailer: Mailer,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
        projectQuery: LifecycleEmailProjectQuery,
        projectImpactsCalculator: ProjectImpactsCalculator,
      ) =>
        new SendLifecycleEmailPreviewUseCase(
          mailer,
          new NestJsAppLogger("SendLifecycleEmailPreview"),
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
          readLifecycleEmailContact(configService),
          projectQuery,
          projectImpactsCalculator,
        ),
      inject: [
        SmtpMailer,
        ConfigService,
        HmacUnsubscribeTokenService,
        SqlLifecycleEmailProjectQuery,
        ComputeReconversionProjectBreakEvenLevelUseCase,
      ],
    },
    {
      provide: UnsubscribeFromLifecycleEmailsUseCase,
      useFactory: (
        unsubscribeTokenService: UnsubscribeTokenService,
        subscriptionRepository: LifecycleEmailSubscriptionRepository,
        dateProvider: DateProvider,
      ) =>
        new UnsubscribeFromLifecycleEmailsUseCase(
          unsubscribeTokenService,
          subscriptionRepository,
          dateProvider,
        ),
      inject: [
        HmacUnsubscribeTokenService,
        SqlLifecycleEmailSubscriptionRepository,
        RealDateProvider,
      ],
    },
    {
      provide: HmacUnsubscribeTokenService,
      // Throws at boot when the secret is missing or empty: an empty HMAC key would make
      // every unsubscribe token forgeable.
      useFactory: (configService: ConfigService) =>
        new HmacUnsubscribeTokenService(
          configService.getOrThrow<string>("LIFECYCLE_EMAILS_UNSUBSCRIBE_SECRET"),
        ),
      inject: [ConfigService],
    },
    {
      provide: LifecycleEmailSender,
      useFactory: (
        deliveryRepository: LifecycleEmailDeliveryRepository,
        deliveryQuery: LifecycleEmailDeliveryQuery,
        recipientQuery: LifecycleEmailRecipientQuery,
        mailer: Mailer,
        dateProvider: DateProvider,
        uidGenerator: UidGenerator,
        configService: ConfigService,
      ) =>
        new LifecycleEmailSender(
          deliveryRepository,
          deliveryQuery,
          recipientQuery,
          mailer,
          dateProvider,
          uidGenerator,
          configService.get("LIFECYCLE_EMAILS_ENABLED") === "true",
        ),
      inject: [
        SqlLifecycleEmailDeliveryRepository,
        SqlLifecycleEmailDeliveryQuery,
        SqlLifecycleEmailRecipientQuery,
        SmtpMailer,
        RealDateProvider,
        RandomUuidGenerator,
        ConfigService,
      ],
    },
    {
      provide: SqlLifecycleEmailDeliveryRepository,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailDeliveryRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlLifecycleEmailDeliveryQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailDeliveryQuery(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlLifecycleEmailSubscriptionRepository,
      useFactory: (sqlConnection: Knex) =>
        new SqlLifecycleEmailSubscriptionRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlLifecycleEmailCohortQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailCohortQuery(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlLifecycleEmailRecipientQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailRecipientQuery(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlLifecycleEmailSiteQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailSiteQuery(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlLifecycleEmailProjectQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailProjectQuery(sqlConnection),
      inject: [SqlConnection],
    },
    SmtpMailer,
    RealDateProvider,
    RandomUuidGenerator,
  ],
  exports: [
    SendLifecycleEmailPreviewUseCase,
    RetryLifecycleEmailDeliveriesUseCase,
    SendFirstSiteRemindersUseCase,
    SendFirstProjectRemindersUseCase,
  ],
})
export class NotificationsModule {}
