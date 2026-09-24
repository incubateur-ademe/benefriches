import { Controller, Get, Query } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
// oxlint-disable-next-line api-conventions/no-local-dto-schema -- legacy local schemas, to move to packages/shared/src/api-dtos
import { z } from "zod";

import { GetPhotovoltaicExpectedPerformanceUseCase } from "src/photovoltaic-performance/core/usecases/getPhotovoltaicExpectedPerformance.usecase";

const GetPhotovoltaicExpectedPerformanceDtoSchema = z.object({
  lat: z.coerce.number().min(-90).max(90),
  long: z.coerce.number().min(-180).max(180),
  peakPower: z.coerce.number().nonnegative(),
});

class GetPhotovoltaicExpectedPerformanceDto extends createZodDto(
  GetPhotovoltaicExpectedPerformanceDtoSchema,
) {}

@Controller("photovoltaic-performance")
export class PhotovoltaicPerformanceController {
  private readonly getPhotovoltaicExpectedPerformanceUseCase: GetPhotovoltaicExpectedPerformanceUseCase;
  constructor(
    getPhotovoltaicExpectedPerformanceUseCase: GetPhotovoltaicExpectedPerformanceUseCase,
  ) {
    this.getPhotovoltaicExpectedPerformanceUseCase = getPhotovoltaicExpectedPerformanceUseCase;
  }

  @Get()
  async getPhotovoltaicExpectedPerformance(@Query() query: GetPhotovoltaicExpectedPerformanceDto) {
    const { lat, long, peakPower } = query;

    const result = await this.getPhotovoltaicExpectedPerformanceUseCase.execute({
      lat,
      long,
      peakPower,
    });

    if (!result.isSuccess()) {
      // This usecase always succeeds, so this should never happen
      throw new Error("Failed to compute photovoltaic performance");
    }

    return result.getData();
  }
}
