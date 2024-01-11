import { Module } from "@nestjs/common";
import { Knex } from "knex";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import {
  CreateNewSiteUseCase,
  SiteRepository,
} from "src/sites/domain/usecases/createNewSite.usecase";
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
      provide: CreateNewSiteUseCase,
      useFactory: (siteRepository: SiteRepository) => new CreateNewSiteUseCase(siteRepository),
      inject: ["SiteRepository"],
    },
  ],
})
export class SitesModule {}
