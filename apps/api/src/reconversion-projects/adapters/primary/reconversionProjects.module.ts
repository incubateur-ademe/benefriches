import { Module } from "@nestjs/common";
import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageRepository } from "src/carbon-storage/adapters/secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";
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
        reconversionProjectRepo: SqlReconversionProjectImpactsRepository,
        siteRepo: SqlSiteImpactsRepository,
        getCityCarbonStoragePerSoilsCategoryUseCase: GetCityCarbonStoragePerSoilsCategoryUseCase,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(
          reconversionProjectRepo,
          siteRepo,
          getCityCarbonStoragePerSoilsCategoryUseCase,
        );
      },
      inject: [
        SqlReconversionProjectImpactsRepository,
        SqlSiteImpactsRepository,
        GetCityCarbonStoragePerSoilsCategoryUseCase,
      ],
    },
    SqlReconversionProjectRepository,
    SqlReconversionProjectsListRepository,
    SqlSiteRepository,
    SqlReconversionProjectImpactsRepository,
    SqlSiteImpactsRepository,
    DateProvider,
    SqlCarbonStorageRepository,
  ],
})
export class ReconversionProjectsModule {}
