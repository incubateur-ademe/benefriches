import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { Knex } from "knex";

import { SqlLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/SqlLifecycleEmailDeliveryQuery";
import { SqlLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/SqlLifecycleEmailDeliveryRepository";
import { SqlLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/SqlLifecycleEmailRecipientQuery";
import { SqlLifecycleEmailSubscriptionRepository } from "src/notifications/adapters/secondary/lifecycle-email-subscription/SqlLifecycleEmailSubscriptionRepository";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import { HmacUnsubscribeTokenService } from "src/notifications/adapters/secondary/unsubscribe-token/HmacUnsubscribeTokenService";
import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type { LifecycleEmailRecipientQuery } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { LifecycleEmailSubscriptionRepository } from "src/notifications/core/gateways/LifecycleEmailSubscriptionRepository";
import type { Mailer } from "src/notifications/core/gateways/Mailer";
import type { UnsubscribeTokenService } from "src/notifications/core/gateways/UnsubscribeTokenService";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { SendLifecycleEmailPreviewUseCase } from "src/notifications/core/usecases/sendLifecycleEmailPreview.usecase";
import { SendWelcomeEmailUseCase } from "src/notifications/core/usecases/sendWelcomeEmail.usecase";
import { UnsubscribeFromLifecycleEmailsUseCase } from "src/notifications/core/usecases/unsubscribeFromLifecycleEmails.usecase";
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
import { SendWelcomeEmailOnUserAccountCreatedHandler } from "./sendWelcomeEmailOnUserAccountCreated.handler";

@Module({
  imports: [ConfigModule, SqlConnectionModule],
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
      provide: SendLifecycleEmailPreviewUseCase,
      useFactory: (
        mailer: Mailer,
        configService: ConfigService,
        unsubscribeTokenService: UnsubscribeTokenService,
      ) =>
        new SendLifecycleEmailPreviewUseCase(
          mailer,
          new NestJsAppLogger("SendLifecycleEmailPreview"),
          configService.getOrThrow<string>("WEBAPP_URL"),
          unsubscribeTokenService,
        ),
      inject: [SmtpMailer, ConfigService, HmacUnsubscribeTokenService],
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
      provide: SqlLifecycleEmailRecipientQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailRecipientQuery(sqlConnection),
      inject: [SqlConnection],
    },
    SmtpMailer,
    RealDateProvider,
    RandomUuidGenerator,
  ],
  exports: [SendLifecycleEmailPreviewUseCase],
})
export class NotificationsModule {}
