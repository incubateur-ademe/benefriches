import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageRepository } from "src/carbon-storage/adapters/secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";
import { LocationFeaturesModule } from "src/location-features/adapters/primary/locationFeatures.module";
import { GeoApiGouvService } from "src/location-features/adapters/secondary/city-data-provider/GeoApiGouvService";
import { DV3FApiGouvService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService";
import { CityDataProvider } from "src/location-features/core/gateways/CityDataProvider";
import { CityPropertyValueProvider } from "src/location-features/core/gateways/CityPropertyValueProvider";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import { CreateExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/createExpressReconversionProject.usecase";
import {
  CreateReconversionProjectUseCase,
  ReconversionProjectRepository,
  SiteRepository,
} from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsListRepository,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/DateProvider";
import { IDateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { SqlSitesReadRepository } from "src/sites/adapters/secondary/site-repository/read/SqlSiteReadRepository";
import { SqlSiteWriteRepository } from "src/sites/adapters/secondary/site-repository/write/SqlSiteWriteRepository";
import { SitesReadRepository } from "src/sites/core/gateways/SitesReadRepository";
import { SqlReconversionProjectQuery } from "../secondary/queries/SqlReconversionProjectQuery";
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
      provide: GetCityRelatedDataService,
      useFactory: (
        cityDataProvider: CityDataProvider,
        cityPropertyValueProvider: CityPropertyValueProvider,
      ) => new GetCityRelatedDataService(cityDataProvider, cityPropertyValueProvider),
      inject: [GeoApiGouvService, DV3FApiGouvService],
    },
    {
      provide: ComputeReconversionProjectImpactsUseCase,
      useFactory(
        reconversionProjectRepo: SqlReconversionProjectImpactsRepository,
        siteRepo: SqlSiteImpactsRepository,
        getCityCarbonStoragePerSoilsCategoryUseCase: GetCityCarbonStoragePerSoilsCategoryUseCase,
        dateProvider: IDateProvider,
        getCityRelatedDataService: GetCityRelatedDataService,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(
          reconversionProjectRepo,
          siteRepo,
          getCityCarbonStoragePerSoilsCategoryUseCase,
          dateProvider,
          getCityRelatedDataService,
        );
      },
      inject: [
        SqlReconversionProjectImpactsRepository,
        SqlSiteImpactsRepository,
        GetCityCarbonStoragePerSoilsCategoryUseCase,
        DateProvider,
        GetCityRelatedDataService,
      ],
    },
    {
      provide: GetReconversionProjectFeaturesUseCase,
      useFactory(reconversionProjectQuery: SqlReconversionProjectQuery) {
        return new GetReconversionProjectFeaturesUseCase(reconversionProjectQuery);
      },
      inject: [SqlReconversionProjectQuery],
    },
    SqlReconversionProjectRepository,
    SqlReconversionProjectQuery,
    SqlReconversionProjectsListRepository,
    SqlSiteWriteRepository,
    SqlSitesReadRepository,
    SqlReconversionProjectImpactsRepository,
    SqlSiteImpactsRepository,
    DateProvider,
    SqlCarbonStorageRepository,
    GeoApiGouvService,
    DV3FApiGouvService,
  ],
})
export class ReconversionProjectsModule {}
