import { Module } from "@nestjs/common";
import { Knex } from "knex";
import {
  CreateReconversionProjectUseCase,
  ReconversionProjectRepository,
  SiteRepository,
} from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";
import {
  GetReconversionProjectsBySiteUseCase,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/domain/usecases/getReconversionProjectsBySite.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SqlConnection } from "src/shared-kernel/adapters/sql-knex/sqlConnection.module";
import { SqlSiteRepository } from "src/sites/adapters/secondary/site-repository/SqlSiteRepository";
import { SqlReconversionProjectRepository } from "../secondary/reconversion-project-repository/SqlReconversionProjectRepository";
import { SqlReconversionProjectsListRepository } from "../secondary/reconversion-projects-list-repository/SqlReconversionProjectsListRepository";
import { ReconversionProjectController } from "./reconversionProjects.controller";

@Module({
  controllers: [ReconversionProjectController],
  providers: [
    {
      provide: "SiteRepository",
      useFactory: (sqlConnection: Knex) => new SqlSiteRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: "ReconversionProjectRepository",
      useFactory: (sqlConnection: Knex) => new SqlReconversionProjectRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: "DateProvider",
      useClass: DateProvider,
    },
    {
      provide: CreateReconversionProjectUseCase,
      useFactory: (
        dateProvider: IDateProvider,
        siteRepository: SiteRepository,
        reconversionProjectRepository: ReconversionProjectRepository,
      ) =>
        new CreateReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        ),
      inject: ["DateProvider", "SiteRepository", "ReconversionProjectRepository"],
    },
    {
      provide: "ReconversionProjectsListRepository",
      useFactory: (sqlConnection: Knex) => new SqlReconversionProjectsListRepository(sqlConnection),
      inject: [SqlConnection],
    },
    {
      provide: GetReconversionProjectsBySiteUseCase,
      useFactory: (reconversionProjectsListRepository: ReconversionProjectsListRepository) =>
        new GetReconversionProjectsBySiteUseCase(reconversionProjectsListRepository),
      inject: ["ReconversionProjectsListRepository"],
    },
  ],
})
export class ReconversionProjectsModule {}
