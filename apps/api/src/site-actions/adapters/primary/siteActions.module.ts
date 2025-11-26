import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "src/auth/adapters/auth.module";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { SiteActionsQuery } from "src/site-actions/core/gateways/SiteActionsQuery";
import { SiteActionsRepository } from "src/site-actions/core/gateways/SiteActionsRepository";
import { GetSiteActionsUseCase } from "src/site-actions/core/usecases/getSiteActions.usecase";
import { InitializeSiteActionsUseCase } from "src/site-actions/core/usecases/initializeSiteActions.usecase";
import { UpdateSiteActionStatusUseCase } from "src/site-actions/core/usecases/updateSiteActionStatus.usecase";

import { SqlSiteActionsQuery } from "../secondary/site-actions-query/SqlSiteActionsQuery";
import { SqlSiteActionsRepository } from "../secondary/site-actions-repository/SqlSiteActionsRepository";
import { ReconversionProjectCreatedHandler } from "./ReconversionProjectCreatedHandler";
import { SiteCreatedFromEvaluationHandler } from "./SiteCreatedFromEvaluationHandler";
import { SiteCreatedHandler } from "./SiteCreatedHandler";
import { SiteActionsController } from "./siteActions.controller";

@Module({
  imports: [ConfigModule, AuthModule],
  controllers: [SiteActionsController],
  providers: [
    {
      provide: InitializeSiteActionsUseCase,
      useFactory: (
        siteActionsRepository: SiteActionsRepository,
        siteActionsQuery: SiteActionsQuery,
        dateProvider: DateProvider,
        uuidGenerator: UidGenerator,
      ) =>
        new InitializeSiteActionsUseCase(
          siteActionsRepository,
          siteActionsQuery,
          dateProvider,
          uuidGenerator,
        ),
      inject: [
        SqlSiteActionsRepository,
        SqlSiteActionsQuery,
        RealDateProvider,
        RandomUuidGenerator,
      ],
    },
    {
      provide: UpdateSiteActionStatusUseCase,
      useFactory: (
        siteActionsRepository: SiteActionsRepository,
        siteActionsQuery: SiteActionsQuery,
        dateProvider: DateProvider,
      ) => new UpdateSiteActionStatusUseCase(siteActionsRepository, siteActionsQuery, dateProvider),
      inject: [SqlSiteActionsRepository, SqlSiteActionsQuery, RealDateProvider],
    },
    {
      provide: GetSiteActionsUseCase,
      useFactory: (siteActionsQuery: SiteActionsQuery) =>
        new GetSiteActionsUseCase(siteActionsQuery),
      inject: [SqlSiteActionsQuery],
    },
    {
      provide: ReconversionProjectCreatedHandler,
      useFactory: (
        updateSiteActionStatusUseCase: UpdateSiteActionStatusUseCase,
        siteActionsQuery: SiteActionsQuery,
      ) => new ReconversionProjectCreatedHandler(updateSiteActionStatusUseCase, siteActionsQuery),
      inject: [UpdateSiteActionStatusUseCase, SqlSiteActionsQuery],
    },
    {
      provide: SiteCreatedFromEvaluationHandler,
      useFactory: (
        updateSiteActionStatusUseCase: UpdateSiteActionStatusUseCase,
        siteActionsQuery: SiteActionsQuery,
      ) => new SiteCreatedFromEvaluationHandler(updateSiteActionStatusUseCase, siteActionsQuery),
      inject: [UpdateSiteActionStatusUseCase, SqlSiteActionsQuery],
    },
    SqlSiteActionsRepository,
    SqlSiteActionsQuery,
    RealDateProvider,
    RandomUuidGenerator,
    SiteCreatedHandler,
  ],
})
export class SiteActionsModule {}
