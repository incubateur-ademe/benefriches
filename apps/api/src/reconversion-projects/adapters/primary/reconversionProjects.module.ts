import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageRepository } from "src/carbon-storage/adapters/secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";
import { LocationFeaturesModule } from "src/location-features/adapters/primary/locationFeatures.module";
import { GeoApiGouvService } from "src/location-features/adapters/secondary/city-data-provider/GeoApiGouvService";
import { CityDataProvider } from "src/location-features/core/gateways/CityDataProvider";
import { GetCityPopulationAndSurfaceAreaUseCase } from "src/location-features/core/usecases/getCityPopulationAndSurfaceArea.usecase";
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
  imports: [CarbonStorageModule, HttpModule, LocationFeaturesModule],
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
      provide: GetCityPopulationAndSurfaceAreaUseCase,
      useFactory: (cityDataProvider: CityDataProvider) =>
        new GetCityPopulationAndSurfaceAreaUseCase(cityDataProvider),
      inject: [GeoApiGouvService],
    },
    {
      provide: ComputeReconversionProjectImpactsUseCase,
      useFactory(
        reconversionProjectRepo: SqlReconversionProjectImpactsRepository,
        siteRepo: SqlSiteImpactsRepository,
        getCityCarbonStoragePerSoilsCategoryUseCase: GetCityCarbonStoragePerSoilsCategoryUseCase,
        dateProvider: IDateProvider,
        getCityPopulationAndSurfaceAreaUseCase: GetCityPopulationAndSurfaceAreaUseCase,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(
          reconversionProjectRepo,
          siteRepo,
          getCityCarbonStoragePerSoilsCategoryUseCase,
          dateProvider,
          getCityPopulationAndSurfaceAreaUseCase,
        );
      },
      inject: [
        SqlReconversionProjectImpactsRepository,
        SqlSiteImpactsRepository,
        GetCityCarbonStoragePerSoilsCategoryUseCase,
        DateProvider,
        GetCityPopulationAndSurfaceAreaUseCase,
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
    GeoApiGouvService,
  ],
})
export class ReconversionProjectsModule {}
