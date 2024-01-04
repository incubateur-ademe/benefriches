import { lastValueFrom } from "rxjs";
import { UseCase } from "../../../shared-kernel/usecase";
import { TownDataProvider } from "../gateways/TownDataProvider";

type Request = {
  cityCode: string;
};

type Response = {
  value: number;
  unit: "hab/km2";
  sources: {
    population: number;
    area: number;
  };
};

export class GetTownPopulationDensityUseCase implements UseCase<Request, Response> {
  constructor(private readonly townDataProvider: TownDataProvider) {}

  async execute({ cityCode }: Request): Promise<Response> {
    const town = await lastValueFrom(this.townDataProvider.getTownAreaAndPopulation(cityCode));

    const density = town.population / town.area;
    const rounded = Math.round(density * 100) / 100;

    return {
      value: rounded,
      unit: "hab/km2",
      sources: {
        population: town.population,
        area: town.area,
      },
    };
  }
}
