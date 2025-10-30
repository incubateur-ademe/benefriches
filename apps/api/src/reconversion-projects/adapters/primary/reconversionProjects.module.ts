import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { FricheGenerator } from "shared";

import { AuthModule } from "src/auth/adapters/auth.module";
import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { PhotovoltaicPerformanceModule } from "src/photovoltaic-performance/adapters/primary/photovoltaicPerformance.module";
import { PhotovoltaicGeoInfoSystemApi } from "src/photovoltaic-performance/adapters/secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { ReconversionProjectRepository } from "src/reconversion-projects/core/gateways/ReconversionProjectRepository";
import { ComputeProjectUrbanSprawlImpactsComparisonUseCase } from "src/reconversion-projects/core/usecases/computeProjectUrbanSprawlImpactsComparison.usecase";
import { ComputeReconversionProjectImpactsUseCase } from "src/reconversion-projects/core/usecases/computeReconversionProjectImpacts.usecase";
import {
  CreateReconversionProjectUseCase,
  SiteRepository,
} from "src/reconversion-projects/core/usecases/createReconversionProject.usecase";
import { DuplicateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/duplicateReconversionProject.usecase";
import { GenerateAndSaveExpressReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/generateAndSaveExpressReconversionProject.usecase";
import {
  GenerateExpressReconversionProjectUseCase,
  SiteQuery,
} from "src/reconversion-projects/core/usecases/generateExpressReconversionProject.usecase";
import { GetReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/getReconversionProject.usecase";
import { GetReconversionProjectFeaturesUseCase } from "src/reconversion-projects/core/usecases/getReconversionProjectFeatures.usecase";
import {
  GetUserReconversionProjectsBySiteUseCase,
  ReconversionProjectsListQuery,
} from "src/reconversion-projects/core/usecases/getUserReconversionProjectsBySite.usecase";
import { QuickComputeUrbanProjectImpactsOnFricheUseCase } from "src/reconversion-projects/core/usecases/quickComputeUrbanProjectImpactsOnFricheUseCase.usecase";
import { UpdateReconversionProjectUseCase } from "src/reconversion-projects/core/usecases/updateReconversionProject.usecase";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { RealEventPublisher } from "src/shared-kernel/adapters/events/publisher/RealEventPublisher";
import { RandomUuidGenerator } from "src/shared-kernel/adapters/id-generator/RandomUuidGenerator";
import { UidGenerator } from "src/shared-kernel/adapters/id-generator/UidGenerator";
import { DomainEventPublisher } from "src/shared-kernel/domainEventPublisher";
import { SqlSitesQuery } from "src/sites/adapters/secondary/site-query/SqlSitesQuery";
import { SqlSiteRepository } from "src/sites/adapters/secondary/site-repository/SqlSiteRepository";
import { SitesQuery } from "src/sites/core/gateways/SitesQuery";
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
  imports: [
    CarbonStorageModule,
    ConfigModule,
    HttpModule,
    PhotovoltaicPerformanceModule,
    AuthModule,
  ],
  controllers: [ReconversionProjectController],
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
      provide: UpdateReconversionProjectUseCase,
      useFactory: (
        dateProvider: DateProvider,
        reconversionProjectRepository: ReconversionProjectRepository,
      ) => new UpdateReconversionProjectUseCase(dateProvider, reconversionProjectRepository),
      inject: [RealDateProvider, SqlReconversionProjectRepository],
    },
    {
      provide: GetReconversionProjectUseCase,
      useFactory: (
        reconversionProjectRepository: ReconversionProjectRepository,
        siteQuery: SitesQuery,
      ) => new GetReconversionProjectUseCase(reconversionProjectRepository, siteQuery),
      inject: [SqlReconversionProjectRepository, SqlSitesQuery],
    },
    {
      provide: GenerateExpressReconversionProjectUseCase,
      useFactory: (
        dateProvider: DateProvider,
        siteRepository: SiteQuery,
        photovoltaicPerformanceService: PhotovoltaicDataProvider,
        userQuery: UserQuery,
      ) =>
        new GenerateExpressReconversionProjectUseCase(
          dateProvider,
          siteRepository,
          photovoltaicPerformanceService,
          userQuery,
        ),
      inject: [RealDateProvider, SqlSitesQuery, PhotovoltaicGeoInfoSystemApi, SqlUserQuery],
    },
    {
      provide: GenerateAndSaveExpressReconversionProjectUseCase,
      useFactory: (
        generateExpressReconversionProjectUseCase: GenerateExpressReconversionProjectUseCase,
        reconversionProjectRepository: ReconversionProjectRepository,
      ) =>
        new GenerateAndSaveExpressReconversionProjectUseCase(
          generateExpressReconversionProjectUseCase,
          reconversionProjectRepository,
        ),
      inject: [GenerateExpressReconversionProjectUseCase, SqlReconversionProjectRepository],
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
    {
      provide: DuplicateReconversionProjectUseCase,
      useFactory(
        repository: ReconversionProjectRepository,
        dateProvider: DateProvider,
        uidGenerator: UidGenerator,
        eventPublisher: DomainEventPublisher,
      ) {
        return new DuplicateReconversionProjectUseCase(
          repository,
          dateProvider,
          uidGenerator,
          eventPublisher,
        );
      },
      inject: [
        SqlReconversionProjectRepository,
        RealDateProvider,
        RandomUuidGenerator,
        RealEventPublisher,
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
    RandomUuidGenerator,
    RealEventPublisher,
  ],
})
export class ReconversionProjectsModule {}
