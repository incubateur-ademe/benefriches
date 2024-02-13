import { Module } from "@nestjs/common";
import { Knex } from "knex";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SitesRepository } from "src/sites/domain/gateways/SitesRepository";
import { CreateNewSiteUseCase } from "src/sites/domain/usecases/createNewSite.usecase";
import { GetSiteByIdUseCase } from "src/sites/domain/usecases/getSiteById.usecase";
import { SqlSiteRepository } from "../secondary/site-repository/SqlSiteRepository";
import { SitesController } from "./sites.controller";

@Module({
  controllers: [SitesController],
  providers: [
    {
      provide: "SiteRepository",
      useFactory: (sqlConnection: Knex) => new SqlSiteRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: "DateProvider",
      useClass: DateProvider,
    },
    {
      provide: CreateNewSiteUseCase,
      useFactory: (siteRepository: SitesRepository, dateProvider: IDateProvider) =>
        new CreateNewSiteUseCase(siteRepository, dateProvider),
      inject: ["SiteRepository", "DateProvider"],
    },
    {
      provide: GetSiteByIdUseCase,
      useFactory: (siteRepository: SitesRepository) => new GetSiteByIdUseCase(siteRepository),
      inject: ["SiteRepository"],
    },
  ],
})
export class SitesModule {}
