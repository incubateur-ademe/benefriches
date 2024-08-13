import { Module } from "@nestjs/common";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SitesQuery } from "src/sites/core/gateways/SitesQuery";
import { SitesRepository } from "src/sites/core/gateways/SitesRepository";
import { CreateNewSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { SqlSitesQuery } from "../secondary/site-query/SqlSitesQuery";
import { SqlSiteRepository } from "../secondary/site-repository/SqlSiteRepository";
import { SitesController } from "./sites.controller";

@Module({
  controllers: [SitesController],
  providers: [
    {
      provide: CreateNewSiteUseCase,
      useFactory: (siteRepository: SitesRepository, dateProvider: IDateProvider) =>
        new CreateNewSiteUseCase(siteRepository, dateProvider),
      inject: [SqlSiteRepository, DateProvider],
    },
    {
      provide: GetSiteByIdUseCase,
      useFactory: (siteRepository: SitesQuery) => new GetSiteByIdUseCase(siteRepository),
      inject: [SqlSitesQuery],
    },
    SqlSiteRepository,
    SqlSitesQuery,
    DateProvider,
  ],
})
export class SitesModule {}
