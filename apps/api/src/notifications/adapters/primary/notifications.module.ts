import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import type { Knex } from "knex";

import { SqlLifecycleEmailDeliveryQuery } from "src/notifications/adapters/secondary/lifecycle-email-delivery/SqlLifecycleEmailDeliveryQuery";
import { SqlLifecycleEmailDeliveryRepository } from "src/notifications/adapters/secondary/lifecycle-email-delivery/SqlLifecycleEmailDeliveryRepository";
import { SqlLifecycleEmailRecipientQuery } from "src/notifications/adapters/secondary/lifecycle-email-recipient/SqlLifecycleEmailRecipientQuery";
import { SmtpMailer } from "src/notifications/adapters/secondary/mailer/SmtpMailer";
import type { LifecycleEmailDeliveryQuery } from "src/notifications/core/gateways/LifecycleEmailDeliveryQuery";
import type { LifecycleEmailDeliveryRepository } from "src/notifications/core/gateways/LifecycleEmailDeliveryRepository";
import type { LifecycleEmailRecipientQuery } from "src/notifications/core/gateways/LifecycleEmailRecipientQuery";
import type { Mailer } from "src/notifications/core/gateways/Mailer";
import { LifecycleEmailSender } from "src/notifications/core/services/lifecycleEmailSender";
import { SendWelcomeEmailUseCase } from "src/notifications/core/usecases/sendWelcomeEmail.usecase";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import {
  SqlConnection,
  SqlConnectionModule,
} from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import type { DateProvider } from "src/shared-kernel/dateProvider";
import type { UidGenerator } from "src/shared-kernel/uidGenerator";

import { SendWelcomeEmailOnUserAccountCreatedHandler } from "./sendWelcomeEmailOnUserAccountCreated.handler";

@Module({
  imports: [ConfigModule, SqlConnectionModule],
  providers: [
    {
      provide: SendWelcomeEmailOnUserAccountCreatedHandler,
      useFactory: (sendWelcomeEmailUseCase: SendWelcomeEmailUseCase) =>
        new SendWelcomeEmailOnUserAccountCreatedHandler(sendWelcomeEmailUseCase),
      inject: [SendWelcomeEmailUseCase],
    },
    {
      provide: SendWelcomeEmailUseCase,
      useFactory: (sender: LifecycleEmailSender, configService: ConfigService) =>
        new SendWelcomeEmailUseCase(sender, configService.getOrThrow<string>("WEBAPP_URL")),
      inject: [LifecycleEmailSender, ConfigService],
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
      provide: SqlLifecycleEmailRecipientQuery,
      useFactory: (sqlConnection: Knex) => new SqlLifecycleEmailRecipientQuery(sqlConnection),
      inject: [SqlConnection],
    },
    SmtpMailer,
    RealDateProvider,
    RandomUuidGenerator,
  ],
})
export class NotificationsModule {}
