import { Module } from "@nestjs/common";

import { GetCarbonStorageFromSoilDistributionService } from "src/carbon-storage/core/services/getCarbonStorageFromSoilDistribution";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/core/usecases/getCityCarbonStoragePerSoilsCategory";

import { SqlCarbonStorageQuery } from "../secondary/carbon-storage-query/SqlCarbonStorageQuery";
import { CarbonStorageController } from "./carbonStorage.controller";

@Module({
  controllers: [CarbonStorageController],
  providers: [
    {
      provide: GetCityCarbonStoragePerSoilsCategoryUseCase,
      useFactory: (dataProvider: SqlCarbonStorageQuery) =>
        new GetCityCarbonStoragePerSoilsCategoryUseCase(dataProvider),
      inject: [SqlCarbonStorageQuery],
    },
    {
      provide: GetCarbonStorageFromSoilDistributionService,
      useFactory: (dataProvider: SqlCarbonStorageQuery) =>
        new GetCarbonStorageFromSoilDistributionService(dataProvider),
      inject: [SqlCarbonStorageQuery],
    },
    SqlCarbonStorageQuery,
  ],
  exports: [
    GetCityCarbonStoragePerSoilsCategoryUseCase,
    GetCarbonStorageFromSoilDistributionService,
  ],
})
export class CarbonStorageModule {}
