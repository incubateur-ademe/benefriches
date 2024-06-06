import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PhotovoltaicDataProvider } from "src/location-features/core/gateways/PhotovoltaicDataProvider";
import { TownDataProvider } from "src/location-features/core/gateways/TownDataProvider";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/location-features/core/usecases/getPhotovoltaicExpectedPerformanceUseCase";
import { GetTownPopulationDensityUseCase } from "src/location-features/core/usecases/getTownPopulationDensity.usecase";
import { PhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { LocalDataInseeService } from "../secondary/town-data-provider/LocalDataInseeService";
import { LocationFeaturesController } from "./locationFeatures.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LocationFeaturesController],
  providers: [
    {
      provide: GetTownPopulationDensityUseCase,
      useFactory: (townDataProvider: TownDataProvider) =>
        new GetTownPopulationDensityUseCase(townDataProvider),
      inject: [LocalDataInseeService],
    },
    {
      provide: GetPhotovoltaicExpectedPerformanceUseCase,
      useFactory: (photovoltaicDataProvider: PhotovoltaicDataProvider) =>
        new GetPhotovoltaicExpectedPerformanceUseCase(photovoltaicDataProvider),
      inject: [PhotovoltaicGeoInfoSystemApi],
    },
    PhotovoltaicGeoInfoSystemApi,
    LocalDataInseeService,
  ],
})
export class LocationFeaturesModule {}
