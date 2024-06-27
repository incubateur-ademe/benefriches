import { Module } from "@nestjs/common";
import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageRepository } from "src/carbon-storage/adapters/secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { CreateExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createExpressReconversionProject.usecase";
import {
  CreateReconversionProjectUseCase,
  ReconversionProjectRepository,
  SiteRepository,
} from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SqlSitesReadRepository } from "src/sites/adapters/secondary/site-repository/read/SqlSiteReadRepository";
import { SqlSiteWriteRepository } from "src/sites/adapters/secondary/site-repository/write/SqlSiteWriteRepository";
import { SitesReadRepository } from "src/sites/core/gateways/SitesReadRepository";
import { SqlReconversionProjectImpactsRepository } from "../secondary/reconversion-project-impacts-repository/SqlReconversionProjectImpactsRepository";
import { SqlReconversionProjectRepository } from "../secondary/reconversion-project-repository/SqlReconversionProjectRepository";
import { SqlReconversionProjectsListRepository } from "../secondary/reconversion-projects-list-repository/SqlReconversionProjectsListRepository";
import { SqlSiteImpactsRepository } from "../secondary/site-impacts-repository/SqlSiteImpactsRepository";
import { ReconversionProjectController } from "./reconversionProjects.controller";

@Module({
  controllers: [ReconversionProjectController],
  imports: [CarbonStorageModule],
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
      inject: [DateProvider, SqlSiteWriteRepository, SqlReconversionProjectRepository],
    },
    {
      provide: CreateExpressReconversionProjectUseCase,
      useFactory: (
        dateProvider: IDateProvider,
        siteRepository: SitesReadRepository,
        reconversionProjectRepository: ReconversionProjectRepository,
      ) =>
        new CreateExpressReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        ),
      inject: [DateProvider, SqlSitesReadRepository, SqlReconversionProjectRepository],
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
        reconversionProjectRepo: SqlReconversionProjectImpactsRepository,
        siteRepo: SqlSiteImpactsRepository,
        getCityCarbonStoragePerSoilsCategoryUseCase: GetCityCarbonStoragePerSoilsCategoryUseCase,
        dateProvider: IDateProvider,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(
          reconversionProjectRepo,
          siteRepo,
          getCityCarbonStoragePerSoilsCategoryUseCase,
          dateProvider,
        );
      },
      inject: [
        SqlReconversionProjectImpactsRepository,
        SqlSiteImpactsRepository,
        GetCityCarbonStoragePerSoilsCategoryUseCase,
        DateProvider,
      ],
    },
    SqlReconversionProjectRepository,
    SqlReconversionProjectsListRepository,
    SqlSiteWriteRepository,
    SqlSitesReadRepository,
    SqlReconversionProjectImpactsRepository,
    SqlSiteImpactsRepository,
    DateProvider,
    SqlCarbonStorageRepository,
  ],
})
export class ReconversionProjectsModule {}
