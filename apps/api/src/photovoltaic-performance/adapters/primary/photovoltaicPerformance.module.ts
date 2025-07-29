import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PhotovoltaicDataProvider } from "src/photovoltaic-performance/core/gateways/PhotovoltaicDataProvider";
import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/photovoltaic-performance/core/usecases/getPhotovoltaicExpectedPerformanceUseCase";

import { PhotovoltaicGeoInfoSystemApi } from "../secondary/photovoltaic-data-provider/PhotovoltaicGeoInfoSystemApi";
import { PhotovoltaicPerformanceController } from "./photovoltaicPerformance.controller";

@Module({
  imports: [ConfigModule, HttpModule],
  controllers: [PhotovoltaicPerformanceController],
  providers: [
    {
      provide: GetPhotovoltaicExpectedPerformanceUseCase,
      useFactory: (photovoltaicDataProvider: PhotovoltaicDataProvider) =>
        new GetPhotovoltaicExpectedPerformanceUseCase(photovoltaicDataProvider),
      inject: [PhotovoltaicGeoInfoSystemApi],
    },
    PhotovoltaicGeoInfoSystemApi,
  ],
})
export class PhotovoltaicPerformanceModule {}
