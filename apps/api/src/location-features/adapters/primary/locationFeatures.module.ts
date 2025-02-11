import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PhotovoltaicDataProvider } from "src/location-features/core/gateways/PhotovoltaicDataProvider";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/location-features/core/usecases/getPhotovoltaicExpectedPerformanceUseCase";

import { GeoApiGouvService } from "../secondary/city-data-provider/GeoApiGouvService";
import { PhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { LocationFeaturesController } from "./locationFeatures.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [LocationFeaturesController],
  providers: [
    {
      provide: GetPhotovoltaicExpectedPerformanceUseCase,
      useFactory: (photovoltaicDataProvider: PhotovoltaicDataProvider) =>
        new GetPhotovoltaicExpectedPerformanceUseCase(photovoltaicDataProvider),
      inject: [PhotovoltaicGeoInfoSystemApi],
    },
    PhotovoltaicGeoInfoSystemApi,
    GeoApiGouvService,
  ],
})
export class LocationFeaturesModule {}
