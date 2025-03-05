import { Module } from "@nestjs/common";

import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SitesQuery } from "src/sites/core/gateways/SitesQuery";
import { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { CreateNewExpressSiteUseCase } from "src/sites/core/usecases/createNewExpressSite.usecase";
import { CreateNewCustomSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";

import { SqlSitesQuery } from "../secondary/site-query/SqlSitesQuery";
import { SqlSiteRepository } from "../secondary/site-repository/SqlSiteRepository";
import { SitesController } from "./sites.controller";

@Module({
  controllers: [SitesController],
  providers: [
    {
      provide: CreateNewCustomSiteUseCase,
      useFactory: (siteRepository: SitesRepository, dateProvider: DateProvider) =>
        new CreateNewCustomSiteUseCase(siteRepository, dateProvider),
      inject: [SqlSiteRepository, RealDateProvider],
    },
    {
      provide: CreateNewExpressSiteUseCase,
      useFactory: (siteRepository: SitesRepository, dateProvider: DateProvider) =>
        new CreateNewExpressSiteUseCase(siteRepository, dateProvider),
      inject: [SqlSiteRepository, RealDateProvider],
    },
    {
      provide: GetSiteByIdUseCase,
      useFactory: (siteRepository: SitesQuery) => new GetSiteByIdUseCase(siteRepository),
      inject: [SqlSitesQuery],
    },
    SqlSiteRepository,
    SqlSitesQuery,
    RealDateProvider,
  ],
})
export class SitesModule {}
