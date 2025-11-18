import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { CarbonStorageModule } from "src/carbon-storage/adapters/primary/carbonStorage.module";
import { SqlCarbonStorageQuery } from "src/carbon-storage/adapters/secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { DateProvider } from "src/shared-kernel/adapters/date/IDateProvider";
import { RealDateProvider } from "src/shared-kernel/adapters/date/RealDateProvider";

import { SqlCityStatsQuery } from "../../reconversion-projects/adapters/secondary/queries/city-stats/SqlCityStatsQuery";
import { ComputeReconversionProjectImpactsStatsUseCase } from "../core/usecases/computeStatsFromImpacts.usecase";
import { StatsController } from "./stats.controller";

@Module({
  imports: [CarbonStorageModule, ConfigModule, HttpModule],
  controllers: [StatsController],
  providers: [
    {
      provide: ComputeReconversionProjectImpactsStatsUseCase,
      useFactory(
        getCarbonStorageFromSoilDistribution: GetCarbonStorageFromSoilDistributionService,
        dateProvider: DateProvider,
        cityStatsRepo: SqlCityStatsQuery,
      ) {
        return new ComputeReconversionProjectImpactsStatsUseCase(
          getCarbonStorageFromSoilDistribution,
          dateProvider,
          cityStatsRepo,
        );
      },
      inject: [GetCarbonStorageFromSoilDistributionService, RealDateProvider, SqlCityStatsQuery],
    },
    SqlCarbonStorageQuery,
    RealDateProvider,
    SqlCityStatsQuery,
  ],
})
export class StatsModule {}
