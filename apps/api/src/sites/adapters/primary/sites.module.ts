import { Module } from "@nestjs/common";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SitesReadRepository } from "src/sites/core/gateways/SitesReadRepository";
import { SitesWriteRepository } from "src/sites/core/gateways/SitesWriteRepository";
import { CreateNewSiteUseCase } from "src/sites/core/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/core/usecases/getSiteById.usecase";
import { SqlSitesReadRepository } from "../secondary/site-repository/read/SqlSiteReadRepository";
import { SqlSiteWriteRepository } from "../secondary/site-repository/write/SqlSiteWriteRepository";
import { SitesController } from "./sites.controller";

@Module({
  controllers: [SitesController],
  providers: [
    {
      provide: CreateNewSiteUseCase,
      useFactory: (siteRepository: SitesWriteRepository, dateProvider: IDateProvider) =>
        new CreateNewSiteUseCase(siteRepository, dateProvider),
      inject: [SqlSiteWriteRepository, DateProvider],
    },
    {
      provide: GetSiteByIdUseCase,
      useFactory: (siteRepository: SitesReadRepository) => new GetSiteByIdUseCase(siteRepository),
      inject: [SqlSitesReadRepository],
    },
    SqlSiteWriteRepository,
    SqlSitesReadRepository,
    DateProvider,
  ],
})
export class SitesModule {}
