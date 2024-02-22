import { Module } from "@nestjs/common";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SitesRepository } from "src/sites/domain/gateways/SitesRepository";
import { CreateNewSiteUseCase } from "src/sites/domain/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/domain/usecases/getSiteById.usecase";
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
      useFactory: (siteRepository: SitesRepository) => new GetSiteByIdUseCase(siteRepository),
      inject: [SqlSiteRepository],
    },
    SqlSiteRepository,
    DateProvider,
  ],
})
export class SitesModule {}
