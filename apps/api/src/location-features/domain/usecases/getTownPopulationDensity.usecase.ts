import { lastValueFrom } from "rxjs";
import { UseCase } from "../../../shared-kernel/usecase";
import { TownDataProvider } from "../gateways/TownDataProvider";

type Request = {
  cityCode: string;
};

type Response = number;

export class GetTownPopulationDensityUseCase
  implements UseCase<Request, number>
{
  constructor(private readonly townDataProvider: TownDataProvider) {}

  async execute({ cityCode }: Request): Promise<Response> {
    const town = await lastValueFrom(
      this.townDataProvider.getTownAreaAndPopulation(cityCode),
    );

    const density = town.population / town.area;
    const rounded = Math.round(density * 100) / 100;

    return rounded;
  }
}
