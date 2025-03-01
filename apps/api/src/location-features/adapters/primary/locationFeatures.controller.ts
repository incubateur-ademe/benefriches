import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/location-features/core/usecases/getPhotovoltaicExpectedPerformanceUseCase";

const GetPhotovoltaicExpectedPerformanceDtoSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),
  peakPower: z.coerce.number().nonnegative(),
});

class GetPhotovoltaicExpectedPerformanceDto extends createZodDto(
  GetPhotovoltaicExpectedPerformanceDtoSchema,
) {}

@Controller("location-features")
export class LocationFeaturesController {
  constructor(
    private readonly getPhotovoltaicExpectedPerformanceUseCase: GetPhotovoltaicExpectedPerformanceUseCase,
  ) {}

  @Get("pv-expected-performance")
  async getPhotovoltaicExpectedPerformance(@Query() query: GetPhotovoltaicExpectedPerformanceDto) {
    const { lat, long, peakPower } = query;

    const result = await this.getPhotovoltaicExpectedPerformanceUseCase.execute({
      lat,
      long,
      peakPower,
    });

    return result;
  }
}
