import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PhotovoltaicDataProvider } from "src/location-features/domain/gateways/PhotovoltaicDataProvider";
import { TownDataProvider } from "src/location-features/domain/gateways/TownDataProvider";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/location-features/domain/usecases/getPhotovoltaicExpectedPerformanceUseCase";
import { GetTownPopulationDensityUseCase } from "src/location-features/domain/usecases/getTownPopulationDensity.usecase";
import { PhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { LocalDataInseeService } from "../secondary/town-data-provider/LocalDataInseeService";
import { LocationFeaturesController } from "./locationFeatures.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LocationFeaturesController],
  providers: [
    { provide: "TownDataProvider", useClass: LocalDataInseeService },
    {
      provide: GetTownPopulationDensityUseCase,
      useFactory: (townDataProvider: TownDataProvider) =>
        new GetTownPopulationDensityUseCase(townDataProvider),
      inject: ["TownDataProvider"],
    },
    { provide: "PhotovoltaicDataProvider", useClass: PhotovoltaicGeoInfoSystemApi },
    {
      provide: GetPhotovoltaicExpectedPerformanceUseCase,
      useFactory: (photovoltaicDataProvider: PhotovoltaicDataProvider) =>
        new GetPhotovoltaicExpectedPerformanceUseCase(photovoltaicDataProvider),
      inject: ["PhotovoltaicDataProvider"],
    },
  ],
})
export class LocationFeaturesModule {}
