import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { AuthModule } from "src/auth/adapters/auth.module";
import { SqlCityStatsQuery } from "src/reconversion-projects/adapters/secondary/queries/city-stats/SqlCityStatsQuery";
import { CityStatsProvider } from "src/reconversion-projects/core/gateways/CityStatsProvider";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { SiteEvaluationsModule } from "src/site-evaluations/adapters/primary/siteEvaluations.module";
import { MutafrichesEvaluationQuery } from "src/site-evaluations/adapters/secondary/queries/MutafrichesEvaluationQuery";
import type { MutabilityEvaluationQuery } from "src/site-evaluations/core/gateways/MutabilityEvaluationQuery";
import { SitesQuery } from "src/sites/core/gateways/SitesQuery";
import { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { CreateNewExpressSiteUseCase } from "src/sites/core/usecases/createNewExpressSite.usecase";
import { CreateNewCustomSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { GetSiteViewByIdUseCase } from "src/sites/core/usecases/getSiteViewById.usecase";

import { SqlSitesQuery } from "../secondary/site-query/SqlSitesQuery";
import { SqlSiteRepository } from "../secondary/site-repository/SqlSiteRepository";
import { SitesController } from "./sites.controller";

@Module({
  imports: [HttpModule, AuthModule, ConfigModule, SiteEvaluationsModule],
  controllers: [SitesController],
  providers: [
    {
      provide: CreateNewCustomSiteUseCase,
      useFactory: (
        siteRepository: SitesRepository,
        dateProvider: DateProvider,
        uuidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) =>
        new CreateNewCustomSiteUseCase(siteRepository, dateProvider, uuidGenerator, eventPublisher),
      inject: [SqlSiteRepository, RealDateProvider, RandomUuidGenerator, RealEventPublisher],
    },
    {
      provide: CreateNewExpressSiteUseCase,
      useFactory: (
        siteRepository: SitesRepository,
        dateProvider: DateProvider,
        cityStatsQuery: CityStatsProvider,
        uuidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) =>
        new CreateNewExpressSiteUseCase(
          siteRepository,
          dateProvider,
          cityStatsQuery,
          uuidGenerator,
          eventPublisher,
        ),
      inject: [
        SqlSiteRepository,
        RealDateProvider,
        SqlCityStatsQuery,
        RandomUuidGenerator,
        RealEventPublisher,
      ],
    },
    {
      provide: GetSiteByIdUseCase,
      useFactory: (siteRepository: SitesQuery) => new GetSiteByIdUseCase(siteRepository),
      inject: [SqlSitesQuery],
    },
    {
      provide: GetSiteViewByIdUseCase,
      useFactory: (
        siteRepository: SitesQuery,
        mutabilityEvaluationQuery: MutabilityEvaluationQuery,
      ) => new GetSiteViewByIdUseCase(siteRepository, mutabilityEvaluationQuery),
      inject: [SqlSitesQuery, MutafrichesEvaluationQuery],
    },
    SqlSiteRepository,
    SqlSitesQuery,
    RealDateProvider,
    SqlCityStatsQuery,
    RandomUuidGenerator,
    RealEventPublisher,
    MutafrichesEvaluationQuery,
  ],
})
export class SitesModule {}
