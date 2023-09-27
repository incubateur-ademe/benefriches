import { UseCase } from "../../../shared-kernel/usecase";
import { CarbonStocksPerSoilsCategoryDataProvider } from "../gateways/CarbonStocksPerSoilCategoryDataProvider";
import { TownCarbonStocksPerSoilCategory } from "../models/townCarbonStocksPerSoilCategory";

type Request = {
  cityCode: string;
};

export class GetTownCarbonStocksPerSoilsCategoryUseCase
  implements UseCase<Request, TownCarbonStocksPerSoilCategory>
{
  constructor(
    private readonly carbonStocksDataProvider: CarbonStocksPerSoilsCategoryDataProvider,
  ) {}

  async execute({
    cityCode,
  }: Request): Promise<TownCarbonStocksPerSoilCategory> {
    const { zpcCode, zpcDescription } =
      await this.carbonStocksDataProvider.getTownZpcCode(cityCode);
    const stocks =
      await this.carbonStocksDataProvider.getCarbonStocksPerSoilsCategoryForZpc(
        zpcCode,
      );

    return Promise.resolve(
      TownCarbonStocksPerSoilCategory.create({
        cityCode,
        zpcCode,
        zpcDescription,
        stocksUnit: "tC/ha",
        stocks,
      }),
    );
  }
}
