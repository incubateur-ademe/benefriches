import { success } from "../../../shared-kernel/result";
import type { TResult } from "../../../shared-kernel/result";
import { UseCase } from "../../../shared-kernel/usecase";
import { PhotovoltaicDataProvider } from "../gateways/PhotovoltaicDataProvider";

type Request = {
  lat: number;
  long: number;
  peakPower: number;
};

type GetPhotovoltaicExpectedPerformanceResult = TResult<{
  expectedPerformance: {
    kwhPerDay: number;
    kwhPerMonth: number;
    kwhPerYear: number;
    lossPercents: {
      angleIncidence: number;
      spectralIncidence: number;
      tempAndIrradiance: number;
      total: number;
    };
  };
}>;

export class GetPhotovoltaicExpectedPerformanceUseCase implements UseCase<
  Request,
  GetPhotovoltaicExpectedPerformanceResult
> {
  private readonly photovoltaicDataProvider: PhotovoltaicDataProvider;
  constructor(photovoltaicDataProvider: PhotovoltaicDataProvider) {
    this.photovoltaicDataProvider = photovoltaicDataProvider;
  }

  async execute({
    lat,
    long,
    peakPower,
  }: Request): Promise<GetPhotovoltaicExpectedPerformanceResult> {
    const result = await this.photovoltaicDataProvider.getPhotovoltaicPerformance({
      lat,
      long,
      peakPower,
    });
    return success({
      expectedPerformance: result.expectedPerformance,
    });
  }
}
