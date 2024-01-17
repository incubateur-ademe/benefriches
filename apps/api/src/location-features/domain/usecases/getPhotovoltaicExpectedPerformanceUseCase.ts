import { lastValueFrom } from "rxjs";
import { UseCase } from "../../../shared-kernel/usecase";
import { PhotovoltaicDataProvider } from "../gateways/PhotovoltaicDataProvider";

type Request = {
  lat: number;
  long: number;
  peakPower: number;
};

type Response = {
  computationContext: {
    location: {
      lat: number;
      long: number;
      elevation: number;
    };
    dataSources: {
      radiation: string;
      meteo: string;
      period: string;
      horizon?: string;
    };
    pvInstallation: {
      slope: { value: number; optimal: boolean };
      azimuth: { value: number; optimal: boolean };
      type: string;
      technology: string;
      peakPower: number;
      systemLoss: number;
    };
  };
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
    const result = await lastValueFrom(
      this.photovoltaicDataProvider.getPhotovoltaicPerformance({ lat, long, peakPower }),
    );

    return {
      computationContext: {
        location: result.context.location,
        dataSources: {
          radiation: result.context.meteoData.radiationDb,
          meteo: result.context.meteoData.meteoDb,
          period: `${result.context.meteoData.yearMin} - ${result.context.meteoData.yearMax}`,
          horizon: result.context.meteoData.useHorizon
            ? result.context.meteoData.horizonDb
            : undefined,
        },
        pvInstallation: {
          technology: result.context.pvModule.technology,
          peakPower: result.context.pvModule.peakPower,
          systemLoss: result.context.pvModule.systemLoss,
          slope: result.context.mountingSystem.slope,
          azimuth: result.context.mountingSystem.azimuth,
          type: result.context.mountingSystem.type,
        },
      },
      expectedPerformance: result.expectedPerformance,
    };
  }
}
