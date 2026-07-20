import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";
import { DateProvider } from "src/shared-kernel/dateProvider";
import { SqlReconversionProjectAndSiteImpactsQuery } from "src/stats/adapters/secondary/SqlStatsQuery";
import { ComputeEvaluatedProjectStatsUseCase } from "src/stats/core/usecases/computeEvaluatedProjectStats.usecase";

import { StatsController } from "./stats.controller";

@Module({
  imports: [CarbonStorageModule, ConfigModule, HttpModule],
  controllers: [StatsController],
  providers: [
    {
      provide: ComputeEvaluatedProjectStatsUseCase,
      useFactory: (
        evaluatedProjectsImpactsStatsQuery: SqlReconversionProjectAndSiteImpactsQuery,
        getCarbonStorageFromSoilDistributionService: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
      ) =>
        new ComputeEvaluatedProjectStatsUseCase(
          evaluatedProjectsImpactsStatsQuery,
          getCarbonStorageFromSoilDistributionService,
          dateProvider,
        ),
      inject: [
        SqlReconversionProjectAndSiteImpactsQuery,
        GetCarbonStorageFromSoilDistributionService,
        RealDateProvider,
      ],
    },
    SqlReconversionProjectAndSiteImpactsQuery,
    RealDateProvider,
    SqlCarbonStorageQuery,
  ],
})
export class StatistiquesModule {}
