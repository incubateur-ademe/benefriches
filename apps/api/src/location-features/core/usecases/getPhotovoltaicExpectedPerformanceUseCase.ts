import { UseCase } from "../../../shared-kernel/usecase";
import { PhotovoltaicDataProvider } from "../gateways/PhotovoltaicDataProvider";

type Request = {
  lat: number;
  long: number;
  peakPower: number;
};

type Response = {
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
};

export class GetPhotovoltaicExpectedPerformanceUseCase implements UseCase<Request, Response> {
  constructor(private readonly photovoltaicDataProvider: PhotovoltaicDataProvider) {}

  async execute({ lat, long, peakPower }: Request): Promise<Response> {
    const result = await this.photovoltaicDataProvider.getPhotovoltaicPerformance({
      lat,
      long,
      peakPower,
    });
    return {
      expectedPerformance: result.expectedPerformance,
    };
  }
}
