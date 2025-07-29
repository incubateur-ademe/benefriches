import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { FricheGenerator } from "shared";

import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { PhotovoltaicPerformanceModule } from "src/photovoltaic-performance/adapters/primary/photovoltaicPerformance.module";
import { PhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
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
import { SqlUserQuery } from "src/users/adapters/secondary/user-query/SqlUserQuery";
import { UserQuery } from "src/users/core/gateways/UserQuery";

import { SqlCityStatsQuery } from "../secondary/queries/city-stats/SqlCityStatsQuery";
import { SqlReconversionProjectQuery } from "../secondary/queries/reconversion-project-features/SqlReconversionProjectQuery";
import { SqlReconversionProjectImpactsQuery } from "../secondary/queries/reconversion-project-impacts/SqlReconversionProjectImpactsQuery";
import { SqlReconversionProjectsListQuery } from "../secondary/queries/reconversion-project-list/SqlReconversionProjectsListQuery";
import { SqlSiteImpactsQuery } from "../secondary/queries/site-impacts/SqlSiteImpactsQuery";
import { SqlReconversionProjectRepository } from "../secondary/repositories/reconversion-project/SqlReconversionProjectRepository";
import { ReconversionProjectController } from "./reconversionProjects.controller";

@Module({
  controllers: [ReconversionProjectController],
  imports: [CarbonStorageModule, HttpModule, PhotovoltaicPerformanceModule],
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
        photovoltaicPerformanceService: PhotovoltaicDataProvider,
        userQuery: UserQuery,
      ) =>
        new CreateExpressReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          reconversionProjectRepository,
          photovoltaicPerformanceService,
          userQuery,
        ),
      inject: [
        RealDateProvider,
        SqlSitesQuery,
        SqlReconversionProjectRepository,
        PhotovoltaicGeoInfoSystemApi,
        SqlUserQuery,
      ],
    },
    {
      provide: GetUserReconversionProjectsBySiteUseCase,
      useFactory: (reconversionProjectsListQuery: ReconversionProjectsListQuery) =>
        new GetUserReconversionProjectsBySiteUseCase(reconversionProjectsListQuery),
      inject: [SqlReconversionProjectsListQuery],
    },
    {
      provide: ComputeReconversionProjectImpactsUseCase,
      useFactory(
        reconversionProjectRepo: SqlReconversionProjectImpactsQuery,
        siteRepo: SqlSiteImpactsQuery,
        cityStatsRepo: SqlCityStatsQuery,
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
      ) {
        return new ComputeReconversionProjectImpactsUseCase(
          reconversionProjectRepo,
          siteRepo,
          cityStatsRepo,
          getCarbonStorageFromSoilDistribution,
          dateProvider,
        );
      },
      inject: [
        SqlReconversionProjectImpactsQuery,
        SqlSiteImpactsQuery,
        SqlCityStatsQuery,
        GetCarbonStorageFromSoilDistributionService,
        RealDateProvider,
      ],
    },
    {
      provide: QuickComputeUrbanProjectImpactsOnFricheUseCase,
      useFactory(
        cityStatsRepo: SqlCityStatsQuery,
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
      ) {
        return new QuickComputeUrbanProjectImpactsOnFricheUseCase(
          cityStatsRepo,
          new FricheGenerator(),
          dateProvider,
          getCarbonStorageFromSoilDistribution,
        );
      },
      inject: [SqlCityStatsQuery, GetCarbonStorageFromSoilDistributionService, RealDateProvider],
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
        cityStatsRepo: SqlCityStatsQuery,
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
      ) {
        return new ComputeProjectUrbanSprawlImpactsComparisonUseCase(
          reconversionProjectRepo,
          siteRepo,
          cityStatsRepo,
          getCarbonStorageFromSoilDistribution,
          dateProvider,
        );
      },
      inject: [
        SqlReconversionProjectImpactsQuery,
        SqlSiteImpactsQuery,
        SqlCityStatsQuery,
        GetCarbonStorageFromSoilDistributionService,
        RealDateProvider,
      ],
    },
    SqlReconversionProjectRepository,
    SqlReconversionProjectQuery,
    SqlReconversionProjectsListQuery,
    SqlSiteRepository,
    SqlSitesQuery,
    SqlReconversionProjectImpactsQuery,
    SqlSiteImpactsQuery,
    SqlUserQuery,
    RealDateProvider,
    SqlCarbonStorageQuery,
    SqlCityStatsQuery,
    PhotovoltaicGeoInfoSystemApi,
  ],
})
export class ReconversionProjectsModule {}
