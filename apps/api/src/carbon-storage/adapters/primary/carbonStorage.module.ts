import { Module } from "@nestjs/common";
import { CarbonStorageRepository } from "src/carbon-storage/domain/gateways/CarbonStorageRepository";
import { GetCityCarbonStoragePerSoilsCategoryUseCase } from "src/carbon-storage/domain/usecases/getCityCarbonStoragePerSoilsCategory";
import { SqlCarbonStorageRepository } from "../secondary/carbonStorageRepository/SqlCarbonStorageRepository";
import { CarbonStorageController } from "./carbonStorage.controller";

@Module({
  controllers: [CarbonStorageController],
  providers: [
    {
      provide: GetCityCarbonStoragePerSoilsCategoryUseCase,
      useFactory: (dataProvider: CarbonStorageRepository) =>
        new GetCityCarbonStoragePerSoilsCategoryUseCase(dataProvider),
      inject: [SqlCarbonStorageRepository],
    },
    SqlCarbonStorageRepository,
  ],
})
export class CarbonStorageModule {}
