import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { Knex } from "knex";

import { CRMGateway } from "src/marketing/core/CRMGateway";
import { MarketingUsersQuery } from "src/marketing/core/gateways/MarketingUsersQuery";
import { MarketingUsersRepository } from "src/marketing/core/gateways/MarketingUsersRepository";
import { SyncNewsletterSubscriptionsUseCase } from "src/marketing/core/usecases/syncNewsletterSubscriptions.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { NestJsAppLogger } from "src/shared-kernel/adapters/logger/NestJsAppLogger";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";

import { ConnectCrm } from "../secondary/ConnectCrm";
import { SqlMarketingUsersQuery } from "../secondary/users-query/SqlMarketingUsersQuery";
import { SqlMarketingUsersRepository } from "../secondary/users-repository/SqlMarketingUsersRepository";
import { LoginSucceededHandler } from "./loginSucceeded.handler";
import { UserAccountCreatedHandler } from "./userAccountCreated.handler";

@Module({
  imports: [HttpModule, ConfigModule],
  providers: [
    {
      provide: UserAccountCreatedHandler,
      useFactory: (crm: CRMGateway) => new UserAccountCreatedHandler(crm),
      inject: [ConnectCrm],
    },
    {
      provide: LoginSucceededHandler,
      useFactory: (crm: CRMGateway, dateProvider: DateProvider) =>
        new LoginSucceededHandler(crm, dateProvider),
      inject: [ConnectCrm, RealDateProvider],
    },
    {
      provide: SqlMarketingUsersQuery,
      useFactory: (sqlConnection: Knex) => new SqlMarketingUsersQuery(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SqlMarketingUsersRepository,
      useFactory: (sqlConnection: Knex) => new SqlMarketingUsersRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: SyncNewsletterSubscriptionsUseCase,
      useFactory: (
        usersQuery: MarketingUsersQuery,
        usersRepository: MarketingUsersRepository,
        crm: CRMGateway,
      ) =>
        new SyncNewsletterSubscriptionsUseCase(
          usersQuery,
          usersRepository,
          crm,
          new NestJsAppLogger("SyncNewsletterSubscriptions"),
        ),
      inject: [SqlMarketingUsersQuery, SqlMarketingUsersRepository, ConnectCrm],
    },
    RealDateProvider,
    ConnectCrm,
  ],
  exports: [SyncNewsletterSubscriptionsUseCase],
})
export class MarketingModule {}
