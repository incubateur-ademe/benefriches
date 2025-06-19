import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { FricheGenerator } from "shared";

import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { LocationFeaturesModule } from "src/location-features/adapters/primary/locationFeatures.module";
import { DV3FApiGouvService } from "src/location-features/adapters/secondary/city-dv3f-provider/DV3FApiService";
import { CityPropertyValueProvider } from "src/location-features/core/gateways/CityPropertyValueProvider";
import { GetCityRelatedDataService } from "src/location-features/core/services/getCityRelatedData";
import { CityDataProvider } from "src/reconversion-projects/core/gateways/CityDataProvider";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase";
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
import { GeoApiGouvService } from "../secondary/services/city-service/GeoApiGouvService";
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
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
        getCityRelatedDataService: GetCityRelatedDataService,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(
          reconversionProjectRepo,
          siteRepo,
          getCarbonStorageFromSoilDistribution,
          dateProvider,
          getCityRelatedDataService,
        );
      },
      inject: [
        SqlReconversionProjectImpactsQuery,
        SqlSiteImpactsQuery,
        GetCarbonStorageFromSoilDistributionService,
        RealDateProvider,
        GetCityRelatedDataService,
      ],
    },
    {
      provide: QuickComputeUrbanProjectImpactsOnFricheUseCase,
      useFactory(
        cityCodeService: GeoApiGouvService,
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
        getCityRelatedDataService: GetCityRelatedDataService,
      ) {
        return new QuickComputeUrbanProjectImpactsOnFricheUseCase(
          cityCodeService,
          new FricheGenerator(),
          dateProvider,
          getCarbonStorageFromSoilDistribution,
          getCityRelatedDataService,
        );
      },
      inject: [
        GeoApiGouvService,
        GetCarbonStorageFromSoilDistributionService,
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
    {
      provide: ComputeProjectUrbanSprawlImpactsComparisonUseCase,
      useFactory(
        reconversionProjectRepo: SqlReconversionProjectImpactsQuery,
        siteRepo: SqlSiteImpactsQuery,
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
        getCityRelatedDataService: GetCityRelatedDataService,
      ) {
        return new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
          reconversionProjectRepo,
          siteRepo,
          getCarbonStorageFromSoilDistribution,
          dateProvider,
          getCityRelatedDataService,
        );
      },
      inject: [
        SqlReconversionProjectImpactsQuery,
        SqlSiteImpactsQuery,
        GetCarbonStorageFromSoilDistributionService,
        RealDateProvider,
        GetCityRelatedDataService,
      ],
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
    DV3FApiGouvService,
  ],
})
export class ReconversionProjectsModule {}
