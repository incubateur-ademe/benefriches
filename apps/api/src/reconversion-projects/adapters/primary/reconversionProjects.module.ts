import { Module } from "@nestjs/common";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/domain/usecases/computeReconversionProjectImpacts.usecase";
import {
  CreateReconversionProjectUseCase,
  ReconversionProjectRepository,
  SiteRepository,
} from "src/reconversion-projects/domain/usecases/createReconversionProject.usecase";
import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/domain/usecases/getUserReconversionProjectsBySite.usecase";
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
      provide: GetUserReconversionProjectsBySiteUseCase,
      useFactory: (reconversionProjectsListRepository: ReconversionProjectsListRepository) =>
        new GetUserReconversionProjectsBySiteUseCase(reconversionProjectsListRepository),
      inject: [SqlReconversionProjectsListRepository],
    },
    {
      provide: ComputeReconversionProjectImpactsUseCase,
      useFactory(
        reconversionProjectRepo: SqlReconversionProjectRepository,
        siteRepo: SqlSiteRepository,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(reconversionProjectRepo, siteRepo);
      },
      inject: [SqlReconversionProjectRepository, SqlSiteRepository],
    },
    SqlReconversionProjectRepository,
    SqlReconversionProjectsListRepository,
    SqlSiteRepository,
    DateProvider,
  ],
})
export class ReconversionProjectsModule {}
