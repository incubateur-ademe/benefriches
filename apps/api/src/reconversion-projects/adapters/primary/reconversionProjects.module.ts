import { Module } from "@nestjs/common";
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
import { SqlSiteRepository } from "src/sites/adapters/secondary/site-repository/SqlSiteRepository";
import { SqlReconversionProjectRepository } from "../secondary/reconversion-project-repository/SqlReconversionProjectRepository";
import { SqlReconversionProjectsListRepository } from "../secondary/reconversion-projects-list-repository/SqlReconversionProjectsListRepository";
import { ReconversionProjectController } from "./reconversionProjects.controller";

@Module({
  controllers: [ReconversionProjectController],
  providers: [
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
      inject: [DateProvider, SqlSiteRepository, SqlReconversionProjectRepository],
    },
    {
      provide: GetReconversionProjectsBySiteUseCase,
      useFactory: (reconversionProjectsListRepository: ReconversionProjectsListRepository) =>
        new GetReconversionProjectsBySiteUseCase(reconversionProjectsListRepository),
      inject: [SqlReconversionProjectsListRepository],
    },
    SqlReconversionProjectRepository,
    SqlReconversionProjectsListRepository,
    SqlSiteRepository,
    DateProvider,
  ],
})
export class ReconversionProjectsModule {}
