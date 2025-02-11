import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { FricheGenerator } from "shared";

import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";
import { LocationFeaturesModule } from "src/location-features/adapters/primary/locationFeatures.module";
import { GeoApiGouvService } from "src/location-features/adapters/secondary/city-data-provider/GeoApiGouvService";
import { DV3FApiGouvService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService";
import { CityDataProvider } from "src/location-features/core/gateways/CityDataProvider";
import { CityPropertyValueProvider } from "src/location-features/core/gateways/CityPropertyValueProvider";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import {
  CreateExpressReconversionProjectUseCase,
  SiteQuery,
} from "src/reconversion-projects/core/usecases/createExpressReconversionProject.usecase";
import {
  CreateReconversionProjectUseCase,
  ReconversionProjectRepository,
  SiteRepository,
} from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsListQuery,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { QuickComputeUrbanProjectImpactsOnFricheUseCase } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { SqlSitesQuery } from "src/sites/adapters/secondary/site-query/SqlSitesQuery";
import { SqlSiteRepository } from "src/sites/adapters/secondary/site-repository/SqlSiteRepository";

import { SqlReconversionProjectQuery } from "../secondary/queries/SqlReconversionProjectQuery";
import { SqlReconversionProjectImpactsQuery } from "../secondary/queries/reconversion-project-impacts/SqlReconversionProjectImpactsQuery";
import { SqlReconversionProjectsListQuery } from "../secondary/queries/reconversion-project-list/SqlReconversionProjectsListQuery";
import { SqlSiteImpactsQuery } from "../secondary/queries/site-impacts/SqlSiteImpactsQuery";
import { SqlReconversionProjectRepository } from "../secondary/repositories/reconversion-project/SqlReconversionProjectRepository";
import { GeoApiGouvCityCodeService } from "../secondary/services/city-code-service/GeoApiGouvCityCodeService";
import { ReconversionProjectController } from "./reconversionProjects.controller";

@Module({
  controllers: [ReconversionProjectController],
  imports: [CarbonStorageModule, HttpModule, LocationFeaturesModule],
  providers: [
    {
      provide: CreateReconversionProjectUseCase,
      useFactory: (
        dateProvider: DateProvider,
        siteRepository: SiteRepository,
        reconversionProjectRepository: ReconversionProjectRepository,
      ) =>
        new CreateReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        ),
      inject: [RealDateProvider, SqlSiteRepository, SqlReconversionProjectRepository],
    },
    {
      provide: CreateExpressReconversionProjectUseCase,
      useFactory: (
        dateProvider: DateProvider,
        siteRepository: SiteQuery,
        reconversionProjectRepository: ReconversionProjectRepository,
      ) =>
        new CreateExpressReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
        ),
      inject: [RealDateProvider, SqlSitesQuery, SqlReconversionProjectRepository],
    },
    {
      provide: GetUserReconversionProjectsBySiteUseCase,
      useFactory: (reconversionProjectsListQuery: ReconversionProjectsListQuery) =>
        new GetUserReconversionProjectsBySiteUseCase(reconversionProjectsListQuery),
      inject: [SqlReconversionProjectsListQuery],
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
        reconversionProjectRepo: SqlReconversionProjectImpactsQuery,
        siteRepo: SqlSiteImpactsQuery,
        getCityCarbonStoragePerSoilsCategoryUseCase: GetCityCarbonStoragePerSoilsCategoryUseCase,
        dateProvider: DateProvider,
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
        SqlReconversionProjectImpactsQuery,
        SqlSiteImpactsQuery,
        GetCityCarbonStoragePerSoilsCategoryUseCase,
        RealDateProvider,
        GetCityRelatedDataService,
      ],
    },
    {
      provide: QuickComputeUrbanProjectImpactsOnFricheUseCase,
      useFactory(
        cityCodeService: GeoApiGouvCityCodeService,
        getCityCarbonStoragePerSoilsCategoryUseCase: GetCityCarbonStoragePerSoilsCategoryUseCase,
        dateProvider: DateProvider,
        getCityRelatedDataService: GetCityRelatedDataService,
      ) {
        return new QuickComputeUrbanProjectImpactsOnFricheUseCase(
          cityCodeService,
          new FricheGenerator(),
          dateProvider,
          getCityCarbonStoragePerSoilsCategoryUseCase,
          getCityRelatedDataService,
        );
      },
      inject: [
        GeoApiGouvCityCodeService,
        GetCityCarbonStoragePerSoilsCategoryUseCase,
        RealDateProvider,
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
    SqlReconversionProjectsListQuery,
    SqlSiteRepository,
    SqlSitesQuery,
    SqlReconversionProjectImpactsQuery,
    SqlSiteImpactsQuery,
    RealDateProvider,
    SqlCarbonStorageQuery,
    GeoApiGouvService,
    GeoApiGouvCityCodeService,
    DV3FApiGouvService,
  ],
})
export class ReconversionProjectsModule {}
