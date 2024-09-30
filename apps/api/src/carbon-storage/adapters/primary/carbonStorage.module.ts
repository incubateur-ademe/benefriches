import { Module } from "@nestjs/common";

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
    SqlCarbonStorageQuery,
  ],
  exports: [GetCityCarbonStoragePerSoilsCategoryUseCase],
})
export class CarbonStorageModule {}
